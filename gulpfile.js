'use strict';

const build = require('@microsoft/sp-build-web');

build.addSuppression(`Warning - [sass] The local CSS class 'ms-Grid' is not camelCase and will not be type-safe.`);

const webpack = require("webpack");
const getClientEnvironment = require("./process-env");

build.configureWebpack.mergeConfig({
  additionalConfiguration: cfg => {
    let pluginDefine = null;
    for (var i = 0; i < cfg.plugins.length; i++) {
      var plugin = cfg.plugins[i];
      if (plugin instanceof webpack.DefinePlugin) {
        pluginDefine = plugin;
      }
    }

    const currentEnv = getClientEnvironment().stringified;

    if (pluginDefine) {
      pluginDefine.definitions = {...pluginDefine.definitions, ...currentEnv};
    } else {
      cfg.plugins.push(new webpack.DefinePlugin(currentEnv));
    }

    return cfg;
  }
});

build.initialize(require('gulp'));
