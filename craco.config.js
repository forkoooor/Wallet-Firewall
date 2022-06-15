module.exports = {
  webpack: {
    configure: {
      output: {
        filename: "dist/bundle.js",
      },
      optimization: {
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
