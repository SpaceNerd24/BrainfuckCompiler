const lexer = require('./lexer');
const compiler = require('./compiler');
const parser = require('./parser');

const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

function readFile(filePath) {
    try {
        return fs.readFileSync(filePath, 'utf8');
    } catch (err) {
        throw new Error(`Failed to read file at '${filePath}': ${err.message}`);
    }
}

function main() {
    const args = process.argv.slice(2);

    if (args.length < 1) {
        console.error('Please provide the path to file.');
        process.exit(1);
    }

    const filePath = args[0];

    if (!fs.existsSync(filePath)) {
        console.error(`The file '${filePath}' does not exist.`);
        process.exit(1);
    }

    if (path.extname(filePath) !== '.bf') {
        console.error('The file must have a .bf extension.');
        process.exit(1);
    }

    const bfCode = readFile(filePath);

    try {
        const tokens = lexer(bfCode);
        const parsedCode = parser(tokens);
        const jsCode = compiler(parsedCode);

        const outputFilePath = filePath.replace(path.extname(filePath), '.js');
        fs.writeFileSync(outputFilePath, jsCode);
        console.log(`Compilation complete! Compiled file is located at: '${outputFilePath}'.`);
        console.log('Executing compiled file...');

        exec(`node ${outputFilePath}`, (error, stdout, stderr) => {
            if (error) {
                console.error(`Error executing file: ${error.message}`);
                return;
            }
            if (stderr) {
                return;
            }
            console.log(`Output: ${stdout}`);
        });

    } catch (err) {
        console.error(`Error: ${err.message}`);
        process.exit(1);
    }
}

main();