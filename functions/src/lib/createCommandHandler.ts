import { SlackCommandException } from './SlackCommandException';
import type { Middleware, SlackCommandMiddlewareArgs } from '@slack/bolt';

type Callback = (args: Omit<SlackCommandMiddlewareArgs, 'ack' | 'respond'>) => Promise<string | void> | string | void;

export const createCommandHandler =
  (callback: Callback): Middleware<SlackCommandMiddlewareArgs> =>
  async ({ ack, respond, ...args }) => {
    await ack();

    try {
      const text = (await callback(args)) ?? 'ok';

      const textArguments = args.command.text.split(' ');
      const isSilent = textArguments.includes('-s') || textArguments.includes('--silent');

      await respond({ text, response_type: isSilent ? 'ephemeral' : 'in_channel' });
    } catch (err) {
      if (err instanceof SlackCommandException) {
        await respond({ text: err.displayMessage, response_type: 'in_channel' });
      } else {
        await respond({ text: 'エラーが発生しました', response_type: 'in_channel' });
      }
    }
  };
