const { getDefaultConfig } = require('@expo/metro-config');

const defaultConfig = getDefaultConfig(__dirname);

defaultConfig.resolver.sourceExts.push('cjs');
defaultConfig.resolver.extraNodeModules = {
    crypto: require.resolve('crypto-browserify'),
    stream: require.resolve('stream-browserify'),
    events: require.resolve('events/'),
  },

module.exports = defaultConfig;
