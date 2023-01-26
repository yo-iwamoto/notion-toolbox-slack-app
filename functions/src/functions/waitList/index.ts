import {
  SLACK_WORKSPACE_ID,
  WAIT_LIST_SLACK_BOT_TOKEN,
  WAIT_LIST_SLACK_SIGNING_SECRET,
  WAIT_LIST_SLACK_TARGET_CHANNEL_ID,
} from '../../config/env';
import { messageUtil } from '../../lib/messageUtil';
import { App, ExpressReceiver } from '@slack/bolt';
import { z } from 'zod';

const receiver = new ExpressReceiver({
  signingSecret: WAIT_LIST_SLACK_SIGNING_SECRET,
  scopes: ['chat:write', 'reactions:read'],
  endpoints: '/events',
  processBeforeResponse: true,
});

const app = new App({ receiver, token: WAIT_LIST_SLACK_BOT_TOKEN });

const zGetReactionsResponse = z
  .object({
    message: z
      .object({
        reactions: z
          .object({
            name: z.string(),
            users: z.string().array(),
          })
          .passthrough()
          .array(),
      })
      .passthrough(),
  })
  .passthrough();

app.event('reaction_added', async ({ event, say }) => {
  // reaction 対象が message でない時、終了
  if (event.item.type !== 'message') return;
  // reaction の emoji が :sumi: でない時、終了
  if (event.reaction !== 'sumi') return;
  console.log(event.item.ts);

  const res = await app.client.reactions.get({
    channel: WAIT_LIST_SLACK_TARGET_CHANNEL_ID,
    timestamp: event.item.ts,
  });
  const parseResult = zGetReactionsResponse.safeParse(res);
  // レスポンス型が期待したものでない時、これ以降の処理が行えないため終了
  if (!parseResult.success) return;
  const { data } = parseResult;

  const nextUserId = data.message.reactions.find((r) => r.name === 'tsugi-clipping-stg')?.users[0];
  // :tsugi-clipping-stg: を reaction したユーザーがいない時、これ以降の処理が不要なため終了
  if (nextUserId === undefined) return;

  await say(
    messageUtil.multiline([
      `${messageUtil.userMention(nextUserId)} ステージングが空きました`,
      `https://${SLACK_WORKSPACE_ID}.slack.com/archives/${WAIT_LIST_SLACK_TARGET_CHANNEL_ID}/p${event.item.ts
        .split('.')
        .join('')}`,
    ]),
  );
});

export const waitList = receiver.app;
