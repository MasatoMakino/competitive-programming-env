//モジュールインポートの場合。
//import log from "./modules/module.js";

process.stdin.resume();
process.stdin.setEncoding('utf8');

const lines = []
const reader = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
});

reader.on('line', (line) => {
    lines.push(line);
});

reader.on('close', () => {
    lines.forEach((val, index) => {
        console.log(index, val);
    });
});