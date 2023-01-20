import { PADDLE_DB_ID, SLACK_BOT_TOKEN, SLACK_SIGNING_SECRET } from '../../config/env';
import { notion } from '../../lib/notion/client';
import { messageUtil } from '../../lib/messageUtil';
import { App, ExpressReceiver } from '@slack/bolt';
import { PageObjectResponse, PartialPageObjectResponse } from '@notionhq/client/build/src/api-endpoints';

const BOT_MAINTAINER_USER_ID = 'U039U2U8ZDF';
const MAINTAIN_TEAM_ID = 'S03M673UAJH';

const receiver = new ExpressReceiver({
  signingSecret: SLACK_SIGNING_SECRET,
  scopes: ['chat:write', 'commands'],
  endpoints: '/events',
  processBeforeResponse: true,
});

const app = new App({ receiver, token: SLACK_BOT_TOKEN });

/** 後方一致で、半角スペースor全角スペース + '教えて' */
const messageRegex = /( |　)+教えて$/;

app.message(messageRegex, async ({ say, event, ...f }) => {
  console.log(f.client.users);

  if (!('text' in event) || !event.text) return;

  try {
    /** 「<keyword> 教えて」 の keyword の部分 */
    const keyword = event.text.split(/( |　)/)[0];
    const [hitWithTitleWords, hitWithNgWords] = await Promise.all([
      // 単語名に keyword を含むデータを取得
      notion.databases.query({
        database_id: PADDLE_DB_ID,
        filter: {
          property: '単語',
          rich_text: {
            contains: keyword,
          },
        },
      }),
      // 単語に keyword を含まずに、NG ワードに keyword を含むデータを取得
      notion.databases.query({
        database_id: PADDLE_DB_ID,
        filter: {
          and: [
            {
              property: 'NG',
              rich_text: {
                contains: keyword,
              },
            },
            {
              property: '単語',
              rich_text: {
                does_not_contain: keyword,
              },
            },
          ],
        },
      }),
    ]);

    const mainMessage = hitWithTitleWords.results.map(parseWord);
    const suggestionMessage =
      hitWithNgWords.results.length === 0
        ? []
        : [`\n${messageUtil.boldText('もしかして...')}`, ...hitWithNgWords.results.map(parseWord)];

    const messages = [...mainMessage, ...suggestionMessage].flatMap((v) => (v === null ? [] : v));

    if (messages.length === 0) {
      await say(`該当するものがありませんでした ${messageUtil.teamMention(MAINTAIN_TEAM_ID)}`);
      return;
    }

    await say(messageUtil.multiline(messages));
  } catch (err) {
    console.error(err);
    await say(
      messageUtil.multiline([
        messageUtil.userMention(BOT_MAINTAINER_USER_ID),
        'エラーが発生しました。確認してください。',
      ]),
    );
  }
});

const parseWord = (word: PageObjectResponse | PartialPageObjectResponse) => {
  if (
    !('properties' in word) ||
    word.properties['単語'].type !== 'title' ||
    word.properties['定義'].type !== 'rich_text'
  ) {
    return null;
  }

  const wordName = messageUtil.boldText(word.properties['単語'].title.map((v) => v.plain_text).join(''));
  const description = word.properties['定義'].rich_text.map((v) => v.plain_text).join('');
  const url = `https://www.notion.so/${word.id.replaceAll('-', '')}`;
  return [messageUtil.link(url, wordName), `➢ ${description}\n`];
};

export const paddle = receiver.app;
