'use strict';

var compose = require('ramda').compose;

var babelHot = require('./partials/babelHot');
var defineEnv = require('./partials/defineEnv');
var entryHot = require('./partials/entryHot');
var outputDev = require('./partials/outputDev');
var sourceMapDev = require('./partials/sourceMapDev');
var baseConfig = require('./webpack.config');
var styles = require('./partials/styles');

module.exports = compose(
    styles,
    babelHot,
    defineEnv,
    entryHot,
    outputDev,
    sourceMapDev
)(baseConfig);
