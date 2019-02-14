function getStdIn() {
    return new Promise(resolve => {
        process.stdin.resume();
        process.stdin.setEncoding('utf8');

        const lines = [];
        const reader = require('readline').createInterface({
            input: process.stdin,
            output: process.stdout
        });

        reader.on('line', (line) => {
            lines.push(line);
        });

        reader.on('close', () => {
            resolve(lines);
        });
    })
}

export default getStdIn;