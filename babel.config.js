module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      'react-native-reanimated/plugin',
      [
        'module-resolver',
        {
          alias: {
            '@': './app/src',
            '@screens': './app/src/screens',
            '@components': './app/src/components',
            '@services': './app/src/services',
            '@store': './app/src/store',
            '@utils': './app/src/utils',
            '@types': './app/src/types',
            '@constants': './app/src/constants',
            '@hooks': './app/src/hooks',
            '@theme': './app/src/theme',
            '@navigation': './app/src/navigation',
            '@assets': './app/assets',
          },
        },
      ],
    ],
  };
};
