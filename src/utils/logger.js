/* eslint-env node */

const logger = {
    info: (...msg) => console.log(...msg),
    error: (...msg) => console.error(...msg)
};

module.exports = logger;