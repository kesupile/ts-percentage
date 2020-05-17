# TS-Percentage

A cli tool to calculate how many files in a specific folder are TS files.

## Contents

1. [Requirements](#requirements)
1. [Usage](#usage)
1. [Options](#options)
   - [src](#src)
   - [only-javascript](#only-javascript)

# Requirements

This tool is built for the Deno runtime. For information on installation, visit the [Deno website](https://deno.land/).

# Usage

```
deno run https://raw.githubusercontent.com/kesupile/ts-percentage/master/ts-percentage.js --src ./myrepo/src ./myrepo/test [--options]
```

This will count how many `.ts` and `.tsx` files are in the directory.

# Options

## src

The only required cli option. A list of folders to consider for the counting operation. The file path is relative to where the process is being executed.

```
deno run https://raw.githubusercontent.com/kesupile/ts-percentage/master/ts-percentage.js --src ./src
```

## only-javascript

By default `ts-percentage` iterates through all the files in the selected `src` folders and counts all the TS files in the folder. By providing the `--only-javascript` flag, the operation will exclude files that aren't JS files - i.e. only the following files will contribute to the total: `.js`,`.jsx`,`.ts`,`.tsx`.

```
deno run https://raw.githubusercontent.com/kesupile/ts-percentage/master/ts-percentage.js --src ./src --only-javascript
```
