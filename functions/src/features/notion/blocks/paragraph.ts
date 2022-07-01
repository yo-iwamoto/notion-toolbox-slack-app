export const paragraph = (...contents: string[]) => ({
  paragraph: {
    rich_text: contents.map((content) => ({
      text: {
        content,
      },
    })),
  },
});
