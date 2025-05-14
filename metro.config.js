const {getDefaultConfig} = require('@react-native/metro-config');
const {mergeConfig} = require('@react-native/metro-config');
const path = require('path');

/**
 * Metro configuration
 * https://facebook.github.io/metro/docs/configuration
 *
 * @type {import('metro-config').MetroConfig}
 */
const ffmpegPath = path.resolve(__dirname, '../ffmpeg-kit/react-native');
const fs = require('fs');

const watchFolders = fs.existsSync(ffmpegPath) ? [ffmpegPath] : [];

const config = {
  watchFolders,
  resolver: {
    extraNodeModules: {
      'react-native': path.resolve(__dirname, 'node_modules/react-native'),
    },
  },
  transformer: {
    async getTransformOptions() {
      return {
        transform: {
          inlineRequires: true,
        },
      };
    },
  },
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
