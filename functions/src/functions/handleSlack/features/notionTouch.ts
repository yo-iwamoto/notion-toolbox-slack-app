import { NOTION_QUICK_DB_ID } from '../../../config/env';
import { createPage } from '../../../lib/notion/createPage';

import { createCommandHandler } from '../../../lib/createCommandHandler';
import { messageUtil } from '../../../lib/messageUtil';
import { App } from '@slack/bolt';

const notionTouch = createCommandHandler(async ({ command: { user_id } }, text) => {
  const pageName = text === '' ? new Date().toDateString() : text;

  const url = await createPage(pageName, NOTION_QUICK_DB_ID);

  return messageUtil.multiline([`${messageUtil.userMention(user_id)} Created: ${messageUtil.boldText(pageName)}`, url]);
});

const register = (app: App) => {
  app.command('/notion-touch', notionTouch);
};

export default register;
