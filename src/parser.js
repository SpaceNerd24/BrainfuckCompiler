function parser(tokens) {
    const stack = [];
    const parsed = [];

    for (let i = 0; i < tokens.length; i++) {
        const token = tokens[i];
        if (token.value === '[') {
            stack.push(i);
            parsed.push({ type: 'LOOP_START', index: i });
        } else if (token.value === ']') {
            if (stack.length === 0) {
                throw new Error(`Unmatched ']' at position ${i}`);
            }
            const start = stack.pop();
            parsed.push({ type: 'LOOP_END', start, end: i });
        } else {
            parsed.push(token);
        }
    }

    if (stack.length > 0) {
        throw new Error(`Unmatched '[' at position ${stack[0]}`);
    }

    return parsed;
}

module.exports = parser;
