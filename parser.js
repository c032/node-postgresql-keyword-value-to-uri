"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseKeywordValueConnectionString = void 0;
const REGEXP_KEY_CHAR = /[a-z_]/;
function isValidKeyChar(c) {
    return REGEXP_KEY_CHAR.test(c);
}
function readKeyword(input) {
    let key = "";
    for (let i = 0; i < input.length; i++) {
        const c = input[i];
        if (typeof c === "undefined") {
            break;
        }
        if (isValidKeyChar(c)) {
            key += c;
            continue;
        }
        const remaining = input.substring(key.length);
        return [key, remaining];
    }
    throw new Error("Invalid key.");
}
function consumeSeparator(input) {
    if (input.startsWith("=")) {
        return input.substring(1);
    }
    if (input.startsWith(" = ")) {
        return input.substring(" = ".length);
    }
    throw new Error("Invalid separator.");
}
function readValueQuoted(input) {
    if (!input.startsWith("'")) {
        throw new Error("Expected single quote.");
    }
    let escape = false;
    let value = "";
    let remaining = input.substring(1);
    for (let i = 0; i < remaining.length; i++) {
        const c = remaining[i];
        if (escape) {
            escape = false;
            // Only support escaping `'` and `\`.
            if (c !== "\\" && c !== "'") {
                throw new Error("Value tried to escape a character that was neither a single quotation mark nor a backslash.");
            }
            value += c;
            continue;
        }
        if (c === "\\") {
            escape = true;
            continue;
        }
        if (c === "'") {
            remaining = remaining.substring(value.length + 1);
            if (remaining.startsWith(" ")) {
                remaining = remaining.substring(1);
            }
            return [value, remaining];
        }
        value += c;
    }
    throw new Error("Unquoted value.");
}
function readValueUnquoted(input) {
    const parts = input.split(" ");
    const value = parts[0];
    if (typeof value === "undefined") {
        throw new Error("Invalid value.");
    }
    const remaining = parts.slice(1).join(" ");
    return [value, remaining];
}
function readValue(input) {
    if (input.startsWith("'")) {
        return readValueQuoted(input);
    }
    return readValueUnquoted(input);
}
function parseKeywordValueConnectionString(kvConnectionString) {
    const pairs = [];
    let remaining = kvConnectionString;
    let prevLength = -1;
    do {
        prevLength = remaining.length;
        let key;
        let value;
        [key, remaining] = readKeyword(remaining);
        remaining = consumeSeparator(remaining);
        [value, remaining] = readValue(remaining);
        const pair = {
            key,
            value,
        };
        pairs.push(pair);
    } while (remaining.length < prevLength && remaining !== "");
    return pairs;
}
exports.parseKeywordValueConnectionString = parseKeywordValueConnectionString;