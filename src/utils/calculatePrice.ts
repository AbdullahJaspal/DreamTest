export const calculateDiamonds = (
  priceInDollar: number,
): number | undefined => {
  if (!priceInDollar) {
    return undefined;
  }
  return Math.floor((1000 / 0.8) * priceInDollar);
};

export const calculatePrice = (diamonds: number): number | undefined => {
  if (!diamonds) {
    return undefined;
  }
  return (diamonds * 0.8) / 1000;
};
