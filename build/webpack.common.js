// "common( 公共 )" 配置文件

const path = require('path')//引入 Node.js 的 path 模块，用于处理文件路径相关的操作
const MiniCssExtractPlugin = require('mini-css-extract-plugin')//引入mini-css-extract-plugin
const HtmlWebpackPlugin = require('html-webpack-plugin')

const webpack = require('webpack')//先导入webpack

module.exports = {
   
    //JS执行入口文件
    entry: './src/index.js',
    output: {
        clean: true,
        //将所有依赖的模块合并输出到bundle.js文件
        filename: "bundle.js",
        //将输出的文件都放到dist目录下
        path: path.resolve(__dirname, '../dist')//__dirname表示当前模块所在的目录的绝对路径
    },

    //loader需要配置在module中
    module: {
        //rules是数组：用于配置规则
        rules: [
            {
                // 通过正则表达式去匹配该用 Loader去转换的 css 文件
                test: /\.css$/,
                use: [MiniCssExtractPlugin.loader,'css-loader']//MiniCssExtractPlugin.loader把css文件单独提取出来，css-loader读css文件，另外还有一个less-loader是将less文件转换为css文件
            },
            {
                test: /\.less$/,
                use: [
                  // compiles Less to CSS
                  'style-loader',
                  'css-loader',
                  'less-loader',
                ],
              },
            {
                test: /\.mp3$/,
                //这是另一种写法，与use数组的写法差不多
                loader: 'file-loader',
                options: {
                    name: 'audios/[name].[ext]',//表示文件的后缀
                  }
              
            }
        ]
    },

    //通过 plugins 属性来配置需要使用的插件列表的
    plugins: [
        new MiniCssExtractPlugin({
            //name:文件名称；contenthash:8:根据文件内容算出八位的hash(防止缓存)
            filename: '[name]_[contenthash:8].css'
        }),
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, '../index.html')
        }),
        //配置jquery
        new webpack.ProvidePlugin({
            $: 'jquery'
        })
    ]
}