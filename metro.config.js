const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Add support for react-native-reanimated
config.transformer.babelTransformerPath = require.resolve('react-native-reanimated/plugin');

module.exports = config;
