'use strict';

var path = require('path');
var partial = require('webpack-partial').default;

var ROOT = process.cwd();
var SRC = path.join(ROOT, 'src');

module.exports = function (config) {
    return partial(config, {
        module: {
            loaders: [
                {
                    test: /\.css/,
                    include: [SRC],
                    /*
                     * Use require.resolve to get a deterministic path
                     * and avoid webpack's magick loader resolution
                     */
                    loaders: [require.resolve('style-loader'), require.resolve('css-loader')]
                }
            ]
        }
    });
};
