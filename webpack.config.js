const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');  // Import the plugin

module.exports = {
  // Entry point for the application
  entry: './src/script.js',

  // Output file configuration
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
    library: 'VideoPlayer', // Exposes VideoPlayer globally
    libraryTarget: 'umd',   // Supports both browser and other environments
    globalObject: 'this',   // Ensure 'this' is the global object (window in browser)
  },

  // Enable source maps for easier debugging
  devtool: 'source-map',

  // Module rules
  module: {
    rules: [
      {
        // Handling .json files
        test: /\.json$/,
        type: 'javascript/auto',
        use: ['json-loader'],
      },
      {
        // Handling JavaScript files (use babel-loader if you need ES6 support)
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },
      {
        // Handling SCSS files
        test: /\.scss$/,
        use: [
          'style-loader',  // Inject styles into DOM
          'css-loader',    // Translate CSS into CommonJS
          'sass-loader',   // Compile Sass to CSS
        ],
      },
    ],
  },

  // Webpack Dev Server Configuration (for local development)
  devServer: {
    static: {
      directory: path.join(__dirname, 'dist'),
    },
    compress: true,
    port: 9000,
    hot: true,
    open: true,  // Automatically open browser on start
  },

  // Plugins section
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',  // Specify the template file (optional)
      filename: 'index.html',        // Name of the output HTML file
    }),
  ],
};
