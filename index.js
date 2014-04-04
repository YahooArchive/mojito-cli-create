/*
 * Copyright (c) 2011-2014, Yahoo! Inc.  All rights reserved.
 * Copyrights licensed under the New BSD License.
 * See the accompanying LICENSE file for terms.
 */

'use strict';

var nopt = require('nopt'),
    opts = nopt({
        'help' : true
    }, {
        '-h' : '--help'
    }),
    args = opts.argv.remain;

function main() {
    // Create yeoman environment object.
    var env = require('yeoman-generator')();
    env.alias(/^([^:]+)$/, '$1:all');
    env.alias(/^([^:]+)$/, '$1:app');
    env.lookup();

    // Remove the first argument which is always 'create'.
    args.splice(0, 1);

    if (args[0] === 'help') {
        // Support 'mojito create help' as the help menu.
        args[0] = 'mojito'
        opts['help'] = true;
    } else if (args.length === 0) {
        // No arguments after 'mojito create' is the equivalent of 'yo mojito'.
        args[0] = 'mojito';
    } else {
        // Arguments after 'mojito create <generator>' is the equivalent of 'yo mojito:<generator>'
        args[0] = 'mojito:' + args[0];
    }

    env.run(args, opts);
}

module.exports = main;