module.exports = {
  pluginOptions: {
    express: {
      shouldServeApp: true,
      serverDir: './srv',
    },
  },
  configureWebpack: {
    optimization: {
      splitChunks: false,
    },
  },
};
