'use strict';

const path = require('path');
const fs = require('fs-extra');
const glob = require('glob');
const chalk = require('chalk');

module.exports = function ( ) {
    const { root, entry, debug } = this.option;

    const error = msg => { throw `[override] ${ msg }`; };

    const log = msg => console.log( `[override] ${ msg }`  );

    if ( !root || !entry ) {
        error( 'option error.' );
    }

    if ( !fs.existsSync( root ) ) {
        error( 'root folder no exist.' );
    }

    if ( !fs.existsSync( entry ) ) {
        error( 'entry folder no exist.' );
    }

    return new Promise(( resolve, reject ) => {
        const folder = [ ];

        fs.readdirSync( entry ).forEach( ( f ) => {
            if ( f.indexOf( '$' ) == 0 ) {
                let p = f.split( '$' );

                p = p.filter( ( i ) => {
                    return i;
                } )

                folder.push( {
                    override: path.resolve( entry, f ).replace( /\\/g, '/' ),
                    origin: path.resolve( root, `./${ p.join('/') }` ).replace( /\\/g, '/' ),
                } );
            }
        } );

        const cover = ( origin, override, files, callback, index = 0 ) => {
            if ( index < files.length ) {
                const file = files[ index ];
                const distFile = file.replace( override, origin );

                debug ? log( `${ chalk.bold.underline( file.replace( entry, '' ) ) } to ${ chalk.bold.underline( distFile.replace( root, '' ) ) }` ) : void 0;

                fs.copySync( file, distFile, { overwrite: true } );

                cover( origin, override, files, callback, index + 1 );
            }
            else {
                callback( );
            }
        }

        const toStartOverride = ( index = 0 ) => {
            if ( index < folder.length ) {
                const { origin, override } = folder[ index ];

                const next = ( ) => toStartOverride( index + 1 );

                if ( !fs.existsSync( origin ) || !fs.existsSync( override ) ) {
                    debug ? log( `${ chalk.bold.underline( override.replace( entry, '' ) ) } to ${ chalk.bold.underline( origin.replace( root, '' ) ) }` ) : void 0;

                    fs.copySync( override, origin, { overwrite: true } );

                    next( );

                    return void 0;
                }

                const files = glob.sync( `${ override }/**/*` );

                cover( origin, override, files, ( ) => {
                    next();
                } )
            }
            else {
                resolve( );
            }
        }

        toStartOverride( );
    } );
};
