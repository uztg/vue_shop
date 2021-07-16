const { resolve } = require("core-js/fn/promise");

module.exports = {
  configureWebpack: {
    resolve: {
      extensions:['js','vue','json'],
      alias: {
        "views":"@/views"
      }
    }
  },
//   devServer: {
//     port: 8081,     // 端口号
// }
}

