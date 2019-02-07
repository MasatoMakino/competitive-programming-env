process.stdin.resume();
process.stdin.setEncoding('utf8');

var lines = []
var reader = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
});

reader.on('line', (line) => {
    lines.push(line);
});

reader.on('close', () => {
    lines.forEach((val, index) => {
        console.log(val);
    })
});