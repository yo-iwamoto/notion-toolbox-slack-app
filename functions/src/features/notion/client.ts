import { NOTION_INTEGRATION_TOKEN } from '../../config/env';
import { Client } from '@notionhq/client';

export const notion = new Client({ auth: NOTION_INTEGRATION_TOKEN });
