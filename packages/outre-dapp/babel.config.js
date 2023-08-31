module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo', ['@babel/preset-env', { targets: { node: 'current' } }]],
    plugins: [
      [
        'module-resolver',
        {
          alias: {
            '@dapp/assets': './assets',
            '@dapp/blockchain': './blockchain',
            '@dapp/components': './components',
            '@dapp/features': './features',
            '@dapp/services': './services',
            '@dapp/store': './store',
            '@dapp/data': './data.js',
            '@dapp/consts': './consts.js',
            '@dapp/utils': './utils',
          },
        },
      ],
      [
        'module:react-native-dotenv',
        {
          moduleName: 'app-env',
          path: '.env',
          blacklist: null,
          whitelist: null,
          safe: false,
          allowUndefined: true,
        },
      ],
    ],
  };
};
