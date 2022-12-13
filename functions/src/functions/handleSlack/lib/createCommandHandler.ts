import { SlackCommandException } from './SlackCommandException';
import type { Middleware, SlackCommandMiddlewareArgs } from '@slack/bolt';

type Callback = (args: SlackCommandMiddlewareArgs, text: string) => Promise<string | void> | string | void;

export const createCommandHandler =
  (callback: Callback): Middleware<SlackCommandMiddlewareArgs> =>
  async (args) => {
    const {
      ack,
      respond,
      command: { text: rawText },
    } = args;
    await ack();

    const { isSilent, text } = parseText(rawText);

    try {
      const result = (await callback(args, text)) ?? 'ok';

      await respond({ text: result, response_type: isSilent ? 'ephemeral' : 'in_channel' });
    } catch (err) {
      if (err instanceof SlackCommandException) {
        await respond({ text: err.displayMessage, response_type: 'in_channel' });
      } else {
        await respond({ text: 'エラーが発生しました', response_type: 'in_channel' });
      }
    }
  };

/**
 * 引数で与えられた text で -s が指定されているか判定し、含まれていた場合はこれを pop して返す
 */
const parseText = (text: SlackCommandMiddlewareArgs['command']['text']) => {
  const textArray = text.split(' ');
  const textArrayLastEl = textArray[textArray.length - 1];
  const hasOption = textArrayLastEl === '-s' || textArrayLastEl === '--silent';
  if (hasOption) {
    textArray.pop();
  }

  return {
    isSilent: hasOption,
    text: textArray.join(' '),
  };
};
