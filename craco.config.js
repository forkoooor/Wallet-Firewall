module.exports = {
  webpack: {
    configure: {
      output: {
        filename: "dist/bundle.js",
      },
      optimization: {
        // minimize: false,
        runtimeChunk: false,
        splitChunks: {
          chunks(chunk) {
            return false;
          },
        },
      },
    },
  },
};
