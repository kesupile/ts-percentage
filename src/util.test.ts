import { readArgs, reduceAsync } from "./util.ts";
import { assert, fail, assertEquals } from "testing-asserts";

type FakeFlags = "one" | "two" | "three";

Deno.test(
  'readArgs returns an empty object for a string of "ts-percentage"',
  () => {
    const result = readArgs<FakeFlags>(["ts-percentage"]);
    assertEquals(result, {});
  },
);

Deno.test("readArgs returns a flag with the correct shape", () => {
  const result = readArgs<FakeFlags>([
    "ts-percentage",
    "--one",
    "firstargument",
    "secondargument",
    "--two",
    "something",
    "else",
    "--three",
  ]);
  assertEquals(result, {
    one: ["firstargument", "secondargument"],
    two: ["something", "else"],
    three: [],
  });
});

Deno.test(
  "readArgs ignores anything else that does not come with a flag header",
  () => {
    const result = readArgs<FakeFlags>([
      "ts-percentage",
      "this",
      "should",
      "be",
      "ignored",
      "--two",
      "2999",
      "--three",
      "Ozark",
    ]);

    assertEquals(result, { two: ["2999"], three: ["Ozark"] });
  },
);

Deno.test("reduceAsync reduces values asynchronously", async () => {
  const concat = (prev: string, curr: string) =>
    Promise.resolve(`${prev}${curr}`);
  const arr = ["a", "c", "x", "z"];

  const result = await reduceAsync(arr, concat, "");

  assertEquals(result, "acxz");
});
