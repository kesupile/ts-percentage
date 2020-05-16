export type Flags = "src" | "only-javascript";

export type FlagLookup = Record<Flags, string[]>;

export type PartialTransformer<T> = T extends (flags: FlagLookup) => infer R ? R
  : never;

export interface FileCount {
  success: number;
  total: number;
}

export interface Transformer {
  count?: (
    flags: FlagLookup,
  ) => (fileCount: FileCount, file: string) => Promise<FileCount>;
  total?: (
    flags: FlagLookup,
  ) => (fileCount: FileCount, file: string) => Promise<FileCount>;
}

export type TransformerLookup = Record<Flags, Transformer>;

export type MakePartialTransformer<T extends Transformer> = {
  [K in keyof T]: PartialTransformer<T[K]>;
};

export type CurriedTransformerLookup<
  T extends TransformerLookup = TransformerLookup,
> = {
  [K in keyof T]?: MakePartialTransformer<T[K]>;
};
