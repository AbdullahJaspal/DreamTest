export const calculateConverisonPrice = (number: number) => {
  const discount = number * 0.3;
  const discountedPrice = number - discount;
  const finalPrice = (discountedPrice * 3) / 10000;

  return Number(finalPrice.toFixed(2));
};
