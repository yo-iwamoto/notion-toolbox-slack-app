import { SLACK_BOT_TOKEN, SLACK_SIGNING_SECRET } from './config/env';
import { handleNotionTouch } from './commands/notion-touch';
import { handleLinkShared } from './events/linkShared';
import { getWords } from './features/notion/getWords';
import { App, ExpressReceiver } from '@slack/bolt';

const receiver = new ExpressReceiver({
  signingSecret: SLACK_SIGNING_SECRET,
  scopes: ['chat:write', 'commands'],
  endpoints: '/events',
  processBeforeResponse: true,
});

const app = new App({ receiver, token: SLACK_BOT_TOKEN });

app.command('/notion-touch', handleNotionTouch);
app.event('link_shared', handleLinkShared);

const messages = [
  (ng: string, name: string, mention: string) => `${ng}…？${name}では？🤔 ${mention}`,
  (ng: string, name: string, mention: string) => `いや${ng}ではなく${name}なんだがそれは、、 ${mention}`,
  (ng: string, name: string, mention: string) =>
    `その${ng}っていうのは、もしかして${name}のことだったりしますか、、、、？😥(困惑) ${mention}`,
];

// ユーザーとして参加しているチャンネルの全てのメッセージをlisten
app.message('', async ({ message, say, event }) => {
  if (!('text' in event)) return;

  const mention = 'user' in message ? ` <@${message.user}>` : '';

  // データベースから単語一覧を取得
  const words = await getWords();
  for (const { name, ngs } of words) {
    for (const ng of ngs) {
      // NGワードを検出するたびにメンション付きで怒る
      if (event.text?.includes(ng)) {
        const message = messages[Math.floor(Math.random() * messages.length)];
        await say(message(ng, name, mention));
      }
    }
  }
});

export const handleSlack = receiver.app;
