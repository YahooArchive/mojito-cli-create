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
    args = opts.argv.remain,
    _ = require('yeoman-generator/node_modules/lodash'),
    libpath = require('path'),
    mockery = require('mockery');

function main() {
    var generator,
        i,
        unnecessaryModules = [
            './actions/fetch',
            './actions/string',
            './actions/wiring',
            './util/common',
            './actions/user',
            'shelljs'
        ];

    opts.env = {
        create: function (name) {
            var generatorName = name.replace('mojito:', ''),
                meta = {
                    resolved: libpath.resolve(__dirname, './node_modules/generator-mojito/lib/generators/' + (generatorName === 'mojito' ? 'app' : generatorName) + '/index.js'),
                    namespace: name
                },
                Generator = require(meta.resolved);
            _.extend(Generator, meta);
            opts.resolved = meta.resolved;
            opts.name = generatorName;

            return new Generator(args.splice(1), opts);
        }
    };

    mockery.enable({
        warnOnReplace: false,
        warnOnUnregistered: false
    });

    for (i = 0; i < unnecessaryModules.length; i++) {
        mockery.registerMock(unnecessaryModules[i], function () {});
    }

    // Remove the first argument which is always 'create'.
    args.splice(0, 1);

    if (args[0] === 'help') {
        // Support 'mojito create help' as the help menu.
        args[0] = 'mojito';
        opts.help = true;
    } else if (args.length === 0) {
        // No arguments after 'mojito create' is the equivalent of 'yo mojito'.
        args[0] = 'mojito';
    } else {
        // Arguments after 'mojito create <generator>' is the equivalent of 'yo mojito:<generator>'
        args[0] = 'mojito:' + args[0];
    }

    try {
        generator = opts.env.create(args[0]);
    } catch (e) {
        console.error('Invalid create option. See \'mojito create --help\'');
        process.exit(1);
    }

    if (opts.help) {
        return console.log(generator.help());
    }
    generator.run();
}

module.exports = main;