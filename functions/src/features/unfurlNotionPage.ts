import { retrievePage } from '../lib/notion/retrievePage';
import type { AllMiddlewareArgs, App, LinkUnfurls, SlackEventMiddlewareArgs } from '@slack/bolt';

const unfurlNotionPage = async ({ event, client }: SlackEventMiddlewareArgs<'link_shared'> & AllMiddlewareArgs) => {
  const unfurls: LinkUnfurls = {};

  await Promise.all(
    event.links.map(async (link) => {
      const { author, title } = await retrievePage(link.url.replace('&amp;', '&'));

      unfurls[link.url] = {
        title,
        title_link: link.url,
        author_icon: author.avatar_url ?? undefined,
        author_name: author.name ?? undefined,
      };
    }),
  );

  await client.chat.unfurl({
    ts: event.message_ts,
    channel: event.channel,
    unfurls,
  });
};

const register = (app: App) => {
  app.event('link_shared', unfurlNotionPage);
};

export default register;
