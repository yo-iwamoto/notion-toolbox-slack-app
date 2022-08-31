import { NOTION_INTEGRATION_TOKEN, NOTION_READONLY_INTEGRATION_TOKEN } from '../../config/env';
import { Client } from '@notionhq/client';

export const notionAdmin = new Client({ auth: NOTION_INTEGRATION_TOKEN });

export const notion = new Client({ auth: NOTION_READONLY_INTEGRATION_TOKEN });
