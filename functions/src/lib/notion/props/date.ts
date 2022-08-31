export const date = (jsDate: Date) => ({
  date: {
    start: jsDate.toISOString().split('T')[0],
  },
});
