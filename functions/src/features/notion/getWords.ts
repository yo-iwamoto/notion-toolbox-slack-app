import { notion } from './client';

export const getWords = async () => {
  const res = await notion.databases.query({
    database_id: '6ae14c39223c40e6b0d010ed199e3a63',
  });

  return res.results.map((row) => {
    if (!('properties' in row)) {
      throw new Error();
    }

    const nameData = row.properties['名前'];
    const ngData = row.properties['NG'];
    if (nameData.type !== 'title' || ngData.type !== 'rich_text') {
      throw new Error();
    }

    return {
      name: nameData.title.map((t) => t.plain_text).join(),
      ngs: ngData.rich_text
        .map((t) => t.plain_text)
        .join()
        .split('、'),
    };
  });
};
