import { notion } from './client';
import * as notionProps from './props';

/**
 * @param title 作成されるページのタイトル
 * @param databaseId Notion のデータベース ID
 * @returns 作成されたページの URL
 * @throws Error | NotionClientError
 */
export const createPage = async (title: string, databaseId: string) => {
  const res = await notion.pages.create({
    parent: { database_id: databaseId },
    properties: {
      title: notionProps.title(title),
    },
  });

  if (!('url' in res)) {
    throw new Error();
  }

  return res.url;
};
