import { notion } from './client';

export const retrievePage = async (url: string) => {
  const pageId = getPageId(url);

  const res = await notion.pages.retrieve({ page_id: pageId });
  if (!('properties' in res)) {
    throw new Error();
  }

  const authorId = res.created_by.id;
  const author = await notion.users.retrieve({ user_id: authorId });

  let title = '';

  if (res.icon?.type === 'emoji') {
    title += `${res.icon.emoji} `;
  }

  Object.values(res.properties).forEach((property) => {
    if (property.type !== 'title') {
      return;
    }

    title += property.title.map((text) => text.plain_text).join();
  });

  if (title === '') {
    throw new Error();
  }

  return {
    author,
    title,
  };
};

/**
 * @throws Error
 */
const getPageId = (urlString: string) => {
  const url = new URL(urlString);
  const p = url.searchParams.get('p');
  if (p !== null) {
    return p;
  }

  const pathArray = url.pathname.split('/');
  const pageNameArray = pathArray[pathArray.length - 1].split('-');
  const pageId = pageNameArray[pageNameArray.length - 1];

  return pageId;
};
