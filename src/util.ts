const flagRegexp = /^--(?=\w)/;

export const readArgs = <T extends string>(
  args: string[],
): Record<T, string[]> => {
  let currentFlag = "";
  const result = args.reduce((map, part) => {
    if (flagRegexp.test(part)) {
      currentFlag = part.replace(flagRegexp, "");
      map[currentFlag as T] = [];
      return map;
    }

    if (currentFlag) {
      const flag = currentFlag as T;
      map[flag] = (map[flag] || []).concat(part);
    }

    return map;
  }, {} as Record<T, string[]>);

  return result;
};

export const reduceAsync = <T, R>(
  arr: T[],
  fn: (...data: any[]) => Promise<R>,
  init: R,
): Promise<R> =>
  arr.reduce(
    (accum, item) => accum.then((res) => fn(res, item)),
    Promise.resolve(init),
  );

export const colours = {
  green: (text: string) => `\u001b[32m${text}\u001b[0m`,
  yellow: (text: string) => `\u001b[33m${text}\u001b[0m`,
};
