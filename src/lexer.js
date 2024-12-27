function lexer(input) {
    const tokens = [];
    for (let i = 0; i < input.length; i++) {
        const char = input[i];
        if ('><+-.,[]'.includes(char)) {
            tokens.push({ type: 'COMMAND', value: char });
        } else if (char.trim() === '') {
            continue;
        } else {
            throw new Error(`Invalid character '${char}' at position ${i}`);
        }
    }
    return tokens;
}

module.exports = lexer;
