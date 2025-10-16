module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      // Temporarily disable reanimated plugin to avoid Worklets errors
      // 'react-native-reanimated/plugin',
    ],
  };
};
