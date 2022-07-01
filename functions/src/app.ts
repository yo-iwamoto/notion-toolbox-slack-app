import { SLACK_BOT_TOKEN, SLACK_SIGNING_SECRET } from './config/env';
import { handleNotionTouch } from './commands/notion-touch';
import { App, ExpressReceiver } from '@slack/bolt';

const receiver = new ExpressReceiver({
  signingSecret: SLACK_SIGNING_SECRET,
  scopes: ['chat:write', 'commands'],
  endpoints: '/events',
  processBeforeResponse: true,
});

const app = new App({ receiver, token: SLACK_BOT_TOKEN });

app.command('/notion-touch', handleNotionTouch);

export const handleSlack = receiver.app;
