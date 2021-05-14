module.exports = {
  plugins: [
    require('postcss-nesting'),
    require('postcss-custom-media'),
    require('postcss-easings'),
    require('postcss-gap-properties'),
    require('autoprefixer'),
  ],
};

//require('postcss-preset-env')({ stage: 1 })
