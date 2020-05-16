import { Flags, FileCount } from "./flags/types.ts";
import { readArgs, reduceAsync, colours } from "./util.ts";
import loadFlags from "./flags/index.ts";
import * as path from "https://deno.land/std/path/mod.ts";

const processFlags = readArgs<Flags>(Deno.args);
const operators = loadFlags(processFlags);

if (!processFlags.src?.length) {
  console.log(new Error("No --src flag provided"));
  Deno.exit(1);
}

const readDir = (count: FileCount, dir: string): Promise<FileCount> =>
  new Promise(async (resolve, reject) => {
    const resolvedDir = path.resolve(dir);
    let directory = Deno.readDir(resolvedDir);

    try {
      for await (let entity of directory!) {
        if (entity.isFile) {
          count = (await operators.src?.count?.(count, entity.name)) ?? count;
          count = (await operators["only-javascript"]?.total?.(
            count,
            entity.name,
          )) ?? { ...count, total: count.total + 1 };
        } else {
          const nextDir = `${resolvedDir}/${entity.name}`;
          count = await readDir(count, nextDir);
        }
      }
    } catch (e) {
      reject(`Error reading directory: ${dir}`);
    }

    return resolve(count);
  });

reduceAsync(processFlags.src, readDir, { success: 0, total: 0 })
  .then(({ success, total }) => {
    console.log(colours.green("✔️ ts-percentage complete"));
    console.log(colours.yellow("TS files:"), success);
    console.log(colours.yellow("Total # of files:"), total);
    console.log(
      colours.yellow("Percentage:"),
      `${Math.floor((success * 100) / total)}%`,
    );
  })
  .catch(console.error);
