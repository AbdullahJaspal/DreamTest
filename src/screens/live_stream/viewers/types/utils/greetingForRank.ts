export const greetingForRank = (rank: number, name: string) => {
  switch (rank) {
    case 1:
      return `${name} is the Top User`;
    case 2:
      return `${name} is the Second User`;
    case 3:
      return `${name} is the Third User`;
    default:
      if (rank > 3 && rank <= 10) {
        return `${name} is in the Top 10`;
      } else if (rank > 10 && rank <= 50) {
        return `${name} is in the Top 50`;
      } else if (rank > 50 && rank <= 100) {
        return `${name} is in the Top 100`;
      } else if (rank > 100 && rank <= 200) {
        return `${name} is in the Top 200`;
      } else {
        return `${name} is a Viewer`;
      }
  }
};
