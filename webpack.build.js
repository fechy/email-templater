const fs = require('fs');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const StaticSiteGeneratorPlugin = require('static-site-generator-webpack-plugin');
const HTMLInlineCSSWebpackPlugin = require("html-inline-css-webpack-plugin").default;

const devConfig = require('./webpack.config');

module.exports = (env, {mode}) => {
  const templateHtml = fs.readFileSync('./public/template.html').toString();
  const templates = fs.readdirSync('./src/templates').filter(filename => !/index.js(x?)$/.test(filename));
  const styles = fs.readFileSync('./src/styles/template.css').toString();

  const plugins = [
    new HTMLInlineCSSWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'public', 'index.html')
    }),
    new StaticSiteGeneratorPlugin({
      crawl: true,
      locals: {
        templateHtml: templateHtml,
        templates: templates,
        styles: styles
      },
      globals: {
        window: {}
      }
    }),
  ];

  return {
    ...devConfig(env, { mode }),
    entry: path.resolve(__dirname, 'src', 'index-render.js'),
    node: {
      __dirname: false,
    },
    plugins
  }
};
