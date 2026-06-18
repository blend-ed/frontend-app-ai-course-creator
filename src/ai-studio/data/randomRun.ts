const RUN_SUFFIXES = ['A', 'B', 'C', 'D', 'E', 'F'];

export const randomCourseNumber = (): string => {
  const n = Math.floor(1000 + Math.random() * 9000);
  return `AI${n}`;
};

export const randomCourseRun = (): string => {
  const year = new Date().getUTCFullYear();
  const letter = RUN_SUFFIXES[Math.floor(Math.random() * RUN_SUFFIXES.length)];
  return `${year}_${letter}`;
};
