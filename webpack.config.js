const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HTMLInlineCSSWebpackPlugin = require("html-inline-css-webpack-plugin").default;

module.exports = (env, {mode}) => {
  return {
    mode,
    entry: path.resolve(__dirname, 'src', 'index.jsx'),
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: 'bundle.js',
      libraryTarget: 'umd',
    },
    resolve: {
      extensions: ['.js', '.jsx', '.scss']
    },
    module: {
      rules: [
        {
          test: /\.module\.s[ac]ss$/,
          exclude: /node_modules/,
          loader: [
            'style-loader',
            {
              loader: 'css-loader',
              options: {
                modules: true,
                sourceMap: true
              }
            },
            {
              loader: 'sass-loader',
              options: {
                sourceMap: true
              }
            }
          ]
        },
        {
          test: /\.s[ac]ss$/,
          exclude: /\.module.(s[ac]ss)$/,
          loader: [
            'style-loader',
            'css-loader',
            {
              loader: 'sass-loader',
              options: {
                sourceMap: false
              }
            }
          ]
        },
        {
          test: /\.(js|jsx)$/,
          exclude: /node_modules/,
          loader: 'babel-loader',
          options: {
            presets: ["@babel/preset-env", "@babel/preset-react"]
          }
        },
        {
          test: /\.html$/i,
          loader: 'html-loader',
        },
      ],
      //noParse: (file) => /(template-renderer.js|index-render.js|.s[ac]css)|.css$/.test(file)
    },
    // add a custom index.html as the template
    plugins: [
      new MiniCssExtractPlugin({
        filename: '[name].css',
        chunkFilename: '[id].css'
      }),
      new HtmlWebpackPlugin({
        template: path.resolve(__dirname, 'public', 'index.html')
      }),
      new HTMLInlineCSSWebpackPlugin(),
    ].filter(Boolean)
  }
};
