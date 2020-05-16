import {
  TransformerLookup,
  FlagLookup,
  CurriedTransformerLookup,
  Transformer,
  Flags,
} from "./types.ts";

// Utility Types
type InferTransformerTuple<
  T extends Transformer | TransformerLookup,
  K extends keyof T = keyof T,
> = [K, T[K]];

const curryTransformers: (
  transformerLookup: TransformerLookup,
  appliedFlags: FlagLookup,
) => CurriedTransformerLookup = (transformerLookup, appliedFlags) => {
  const res = Object.keys(appliedFlags).reduce((accum, flag) => {
    const flagKey = flag as Flags;
    const transformer = transformerLookup[flagKey];

    accum[flagKey] = Object.entries(transformer).reduce(
      (nextTransformer, transformerData) => {
        const [operation, fn] = transformerData as InferTransformerTuple<
          Transformer
        >;
        nextTransformer[operation] = fn?.(appliedFlags);
        return nextTransformer;
      },
      {} as any,
    );
    return accum;
  }, {} as TransformerLookup) as CurriedTransformerLookup;

  return res;
};

export default curryTransformers;
