export const numbersToArray = (numbers: string) => {
  let nums: string[] = numbers.split(",");

  if (numbers.length === 1) {
    nums = numbers.replace("\r\n", "\n").replace("\r", "\n").split("\n");
  }

  return nums;
};
