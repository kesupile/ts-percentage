import { Transformer, Flags } from "./types.ts";

const src: Transformer = {
  count: () =>
    (count, filename) =>
      Promise.resolve(
        /.tsx?$/.test(filename)
          ? { ...count, success: count.success + 1 }
          : count,
      ),
};

const onlyJavascript: Transformer = {
  total: () =>
    (count, filename) =>
      Promise.resolve(
        /\.[jt]sx?$/.test(filename)
          ? { ...count, total: count.total + 1 }
          : count,
      ),
};

const operators: Record<Flags, Transformer> = {
  src,
  "only-javascript": onlyJavascript,
};

export default operators;
