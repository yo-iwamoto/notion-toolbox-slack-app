const slackCommandExceptionCodes = {
  invalid: 'invalid',
  internal: 'internal',
} as const;
type SlackCommandExceptionCodes = typeof slackCommandExceptionCodes[keyof typeof slackCommandExceptionCodes];

export class SlackCommandException {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private constructor(public code: SlackCommandExceptionCodes, public displayMessage: string, public cause?: any) {}

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static invalid = (displayMessage = 'パラメーターが間違っています', cause?: any) =>
    new SlackCommandException(slackCommandExceptionCodes.invalid, displayMessage, cause);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static internal = (displayMessage = 'エラーが発生しました', cause?: any) =>
    new SlackCommandException(slackCommandExceptionCodes.internal, displayMessage, cause);
}
