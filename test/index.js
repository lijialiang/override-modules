'use strict';

const path = require('path');

const override = require('../index');

override.config({
    debug: true,
    root: path.resolve( __dirname, '../' ),
    entry: path.resolve( __dirname, './' ),
})

override.start().then(() => {
    console.log( '>>>>>>>>>>>>>>>>> success' );
});
