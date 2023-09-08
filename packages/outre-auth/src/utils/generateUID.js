const { customAlphabet } = require('nanoid');
const alphabet = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const generateUID = customAlphabet(alphabet, 10);

module.exports = { generateUID };