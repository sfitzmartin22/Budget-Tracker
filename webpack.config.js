const WebpackManifest = require('webpack-pwa-manifest');
const path = require('path');

const config = {
    entry: "./publiic/index.js",
    output: {
        path: __dirname + "/public/dist",
        filename: "bundle.js"
    },

    mode: "production",
    plugins: [
    new WebpackManifest({
      
      filename: "manifest.json",
      inject: false,
      fingerprints: false,

      name: "Budget Tracker",
      short_name: "Budget App",
      theme_color: "#ffffff",
      background_color: "#ffffff",
      start_url: "/",
      display: "standalone",

      icons: [
        {
          src: path.resolve(
            __dirname,
            "public/icons/icon-512x512.png"
            ),
          // the plugin will generate an image for each size
          // included in the size array
          size: [192, 512]
        }
      ]
    })
  ]
};

module.exports = config;
