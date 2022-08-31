import { SLACK_BOT_TOKEN, SLACK_SIGNING_SECRET } from './config/env';
import registerNotionTouch from './features/notionTouch';
import registerUnfurlNotionPage from './features/unfurlNotionPage';
import { App, ExpressReceiver } from '@slack/bolt';

const receiver = new ExpressReceiver({
  signingSecret: SLACK_SIGNING_SECRET,
  scopes: ['chat:write', 'commands'],
  endpoints: '/events',
  processBeforeResponse: true,
});

const app = new App({ receiver, token: SLACK_BOT_TOKEN });

registerNotionTouch(app);
registerUnfurlNotionPage(app);

export const handleSlack = receiver.app;
