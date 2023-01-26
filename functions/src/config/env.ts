import dotenv from 'dotenv';

if (process.env.NODE_ENV === 'development') {
  dotenv.config();
}

export const NOTION_INTEGRATION_TOKEN = process.env.NOTION_INTEGRATION_TOKEN as string;
export const NOTION_READONLY_INTEGRATION_TOKEN = process.env.NOTION_READONLY_INTEGRATION_TOKEN as string;
export const NOTION_QUICK_DB_ID = process.env.NOTION_QUICK_DB_ID as string;
export const NOTION_WORDS_DB_ID = process.env.NOTION_WORDS_DB_ID as string;
export const SLACK_SIGNING_SECRET = process.env.SLACK_SIGNING_SECRET as string;
export const SLACK_BOT_TOKEN = process.env.SLACK_BOT_TOKEN as string;
export const PADDLE_DB_ID = process.env.PADDLE_DB_ID as string;
export const SLACK_WORKSPACE_ID = process.env.SLACK_WORKSPACE_ID as string;
export const WAIT_LIST_SLACK_SIGNING_SECRET = process.env.WAIT_LIST_SLACK_SIGNING_SECRET as string;
export const WAIT_LIST_SLACK_BOT_TOKEN = process.env.WAIT_LIST_SLACK_BOT_TOKEN as string;
export const WAIT_LIST_SLACK_TARGET_CHANNEL_ID = process.env.WAIT_LIST_SLACK_TARGET_CHANNEL_ID as string;
