const nodeExternals = require('webpack-node-externals');
const CopyPlugin = require('copy-webpack-plugin');
const path = require('path');


module.exports = {
    mode: 'development',
    entry: [
            './app.js',
    ],
    target: "node",



    output: {
        path: path.resolve(__dirname, 'build'),
        filename: 'bundle.js'
    },

    plugins: [
        new CopyPlugin([
        {from: './data/**', to: ''},
        {from: './javascripts/**', to: ''},
        {from: './lib/**', to: ''},
        {from: './routes/**', to: ''},
        {from: './stylesheets/**', to: ''},
        {from: './views/**', to: ''},
        {from: './*.js', to: ''},
            ])
    ],

    externals: [nodeExternals()]
};