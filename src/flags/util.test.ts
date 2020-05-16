import { assertEquals } from "testing-asserts";
import curryTransformers from "./util.ts";

const flags = { example: [] };
const mockTransformer = {
  example: {
    operation: (flags: any) =>
      (other: any) => `flags: ${flags}. other: ${other}`,
    operation2: (flags: any) =>
      (other: any) => `flags: ${flags}. other: ${other}`,
  },
  leaveItOut: {},
} as any;

const curried = curryTransformers(mockTransformer, flags as any);

//@ts-ignore
const innerMap = curried.example;

Deno.test("curryTransformers returns an object of the correct shape", () => {
  const expectedFlags = ["example"];
  const expectedOperations = ["operation", "operation2"];

  assertEquals(Object.keys(curried), expectedFlags);
  assertEquals(Object.keys(innerMap), expectedOperations);

  const allFunctions = Object.values(innerMap).every(
    (fn) => typeof fn === "function",
  );
  assertEquals(allFunctions, true);
});

Deno.test("curryTransformers correctly applies the flags", () => {
  const allReturnCorrectFunction = Object.values(innerMap).every(
    (fn: any) => fn("data") === `flags: ${flags}. other: data`,
  );

  assertEquals(allReturnCorrectFunction, true);
});
