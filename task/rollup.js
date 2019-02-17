"use strict";
const path = require("path");
const rollup = require("rollup");
const babel = require("rollup-plugin-babel");

const srcDir = "./src";
const distDir = "./dist";
const fileName = "index.js";

const isWatch = process.argv[2] === "watch";

const inputOptions = {
  input: path.resolve(srcDir, fileName),
  plugins: [babel()]
};
const outputOptions = {
  format: "cjs",
  file: path.resolve(distDir, fileName)
};
const watchOption = Object.assign({}, inputOptions);
watchOption.output = outputOptions;

async function build(inputOptions, outputOptions) {
  const bundle = await rollup.rollup(inputOptions);
  await bundle.write(outputOptions);
}

if (!isWatch) {
  build(inputOptions, outputOptions);
} else {
  console.log("watching rollup.js...");
  const watcher = rollup.watch(watchOption);
}
