//Webpack 在执行构建时默认会从项目根目录下的 webpack.config.js 文件中读取配置
//==>将webpack.config.js改名为webpack.dev.js,作为开发环境

const path = require('path')//引入 Node.js 的 path 模块，用于处理文件路径相关的操作
const { merge } = require('webpack-merge')
const common = require('./webpack.common')//导入"common( 公共 )" 配置

module.exports = merge(common,{
    mode: "development",
    devServer: {
        port: 8085,//配置DevServer服务监听的端口
        hot: true,//是否启用模块热替换功能
        open: true,//用于在DevServer启动且第一次构建玩时自动用你系统上默认的浏览器去打开要开发的网页
        static: {//默认去找当前目录下的index.html
            directory: path.join(__dirname, "../")
        }
    },
})
