//webpack.prod.js 作为生产环境打包


const { merge } = require('webpack-merge')
const common = require('./webpack.common')//导入"common( 公共 )" 配置

module.exports = merge(common,{
    mode: "production",
 })