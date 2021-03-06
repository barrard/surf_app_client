const webpack = require("webpack");
// const withCSS = require('@zeit/next-css')

// Initialize doteenv library
require("dotenv").config();

module.exports = ({
// module.exports = {
    // cssModules: true,
  webpack: config => {

    // Fixes npm packages that depend on `fs` module
    config.node = {
      fs: 'empty'
    }
    /**
     * Returns environment variables as an object
     */
    const env = Object.keys(process.env).reduce((acc, curr) => {
             acc[`process.env.${curr}`] = JSON.stringify(process.env[curr]);
             return acc;
   }, {});

    /** Allows you to create global constants which can be configured
    * at compile time, which in our case is our environment variables
    */
    config.plugins.push(new webpack.DefinePlugin(env));
    return config
  },
  async headers() {
    return [
      {
        source: '/*',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: 'true', // Matched parameters can be used in the value
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'true', // Matched parameters can be used in the value
          },
          {
            key: 'Access-Control-Allow-Credentials',
            value: 'true', // Matched parameters can be used in the value
          },
        
        ],
      },
    ]
  },
})
