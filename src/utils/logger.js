/* eslint-disable no-console */
/* global console */

const logger = {
    info: (...msg) => console.log(...msg),
    error: (...msg) => console.error(...msg),
};

module.exports = logger;
