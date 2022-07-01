const EOL = '\n';

export const messageUtil = {
  /**
   * メッセージ内で展開できる形式のメンションを返す
   *
   * @param userId command.user_id
   * @returns string
   */
  userMention: (userId: string) => `<@${userId}>`,

  /**
   * 太字のデコレーション
   *
   * @param text string
   * @returns string
   */
  boldText: (text: string) => `*${text}*`,

  /**
   * 引数を改行で接続する
   *
   * @param texts string[]
   * @returns string
   */
  multiline: (texts: string[]) => texts.join(EOL),
};
