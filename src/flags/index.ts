import operators from "./operators.ts";
import curryTransformers from "./util.ts";
import { FlagLookup } from "./types.ts";

const loadOperators = (flagLookup: FlagLookup) =>
  curryTransformers(operators, flagLookup);

export default loadOperators;
