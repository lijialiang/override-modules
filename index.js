'use strict';

const start = require('./lib/start');

const override = { };

override.option = {
    debug: false,
    root: void 0,
    entry: void 0,
}

override.config = ( option ) => {
    override.option = Object.assign( override.option, option );
}

override.start = start;

module.exports = override;
