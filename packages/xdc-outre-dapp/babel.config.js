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
            '@dapp/components': './components',
            '@dapp/config': './config',
            '@dapp/contracts': './contracts',
            '@dapp/features': './features',
            '@dapp/services': './services',
            '@dapp/store': './store',
            '@dapp/utils': './utils',
          },
        },
      ],
      [
        'module:react-native-dotenv',
        {
          moduleName: 'app-env',
          path: '.dev.env',
          blacklist: null,
          whitelist: null,
          safe: false,
          allowUndefined: true,
        },
      ],
    ],
  };
};
