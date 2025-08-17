// const { defineConfig } = require('@vue/cli-service')
// module.exports = defineConfig({
//   transpileDependencies: true
// })
const CopyWebpackPlugin = require('copy-webpack-plugin')
const webpack = require('webpack')
const path = require('path')

let cesiumSource = './node_modules/cesium/Source'
let cesiumWorkers = '../Build/Cesium/Workers'

module.exports = {
  publicPath: "./",
  outputDir: "dist",
  lintOnSave: false,
  transpileDependencies: true,
  configureWebpack: {
    output: {
      sourcePrefix: ' '
    },
    amd: {
      toUrlUndefined: true
    },
    resolve: {
      alias: {
        'vue$': 'vue/dist/vue.esm.js',
        '@': path.resolve('src'),
        'cesium': path.resolve(__dirname, cesiumSource)
      },
      fallback: {
        "http": require.resolve("stream-http"),
        "https": require.resolve("https-browserify"),
        "zlib": require.resolve("browserify-zlib"),
        "url": require.resolve("url/"),
        "assert": require.resolve("assert/"),
        "stream": require.resolve("stream-browserify")
      }
    },
    plugins: [
      new CopyWebpackPlugin({ patterns: [{ from: path.join(cesiumSource, cesiumWorkers), to: 'Workers' }] }),
      new CopyWebpackPlugin({ patterns: [{ from: path.join(cesiumSource, 'Assets'), to: 'Assets' }] }),
      new CopyWebpackPlugin({ patterns: [{ from: path.join(cesiumSource, 'Widgets'), to: 'Widgets' }] }),
      new CopyWebpackPlugin({ patterns: [{ from: path.join(cesiumSource, 'ThirdParty/Workers'), to: 'ThirdParty/Workers' }] }),
      //new CopyWebpackPlugin({ patterns: [{ from: path.join(cesiumSource, 'Core'), to: 'Core' }] }),
      new CopyWebpackPlugin({ patterns: [{ from: path.join(cesiumSource, 'ThirdParty'), to: 'ThirdParty' }] }),
      // new CopyWebpackPlugin({ patterns: [{ from: path.join(cesiumSource, 'Scene'), to: 'Scene' }] }),
      new webpack.DefinePlugin({
        CESIUM_BASE_URL: JSON.stringify('../../')
      })
    ],
    module: {
      unknownContextCritical: /^.\/.*$/,
      unknownContextCritical: false
    }
  }
};
