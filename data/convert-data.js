#!/usr/bin/env node
const fs = require("fs-extra");
const path = require("path");
const meow = require("meow");
const csv = require("csv");

meow(`
Usage
  $ convert-data
`);

const inFilepath = path.join(__dirname, "hospitals.csv");
const outFilepath = path.resolve(__dirname, "../src/data/hospitals.json");

const go = async () => {
  const data = [];
  for await (const record of fs
    .createReadStream(inFilepath)
    .pipe(csv.parse({ columns: true }))) {
    data.push(record);
  }
  await fs.outputJson(outFilepath, data, { spaces: 2 });
};

go().catch((e) => {
  console.error(e);
  process.exit(1);
});
