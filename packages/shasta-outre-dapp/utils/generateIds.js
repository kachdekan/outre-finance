const { customAlphabet } = require('nanoid');
export const generateId = customAlphabet('1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ', 10);
