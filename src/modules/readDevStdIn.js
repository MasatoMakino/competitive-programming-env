/**
 * 標準入力を受け取り行単位の配列にして返す処理。
 * AtCoder用。
 */
function readDevStdIn() {
  const input = require("fs")
    .readFileSync("/dev/stdin", "utf8")
    .split("\n");
  return input;
}
export default readDevStdIn;
