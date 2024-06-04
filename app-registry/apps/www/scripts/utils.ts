export const removeDuplicates = <T>(items: T[]): T[] => {
  return items
    .filter((item, index, self) => self.findIndex((c) => item === c) === index)

    .filter(Boolean);
};
