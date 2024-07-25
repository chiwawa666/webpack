const path = require('path');  
const HtmlWebpackPlugin = require('html-webpack-plugin');  
  
module.exports = {  
    mode: 'development', // 开发模式  
    entry: path.resolve(__dirname, '../src/main.js'), // 入口文件  
    output: {  
        filename: '[name].[hash:8].js', // [name] 指entry属性名字, 默认为main  
        path: path.resolve(__dirname, '../dist'), // 打包后的目录  
        clean: false, // 打包前清空输出目录  
    },  
    devServer: {  
        // contentBase: path.resolve(__dirname, '../dist'), // 告诉服务器从哪里提供内容  
        hot: true, // 开启热模块替换  
        port: 3000, // 设置服务运行的端口号  
        open: true, // 启动后自动打开浏览器  
        host:'localhost'
        // 其他配置...  
    },  
    plugins: [  
        new HtmlWebpackPlugin({  
            template: path.resolve(__dirname, '../public/index.html')  
        }),  
        // 如果你需要热模块替换（HMR）支持，确保添加相应的插件（对于某些类型的模块）  
        // 例如，对于Vue或React，你可能需要其他插件来支持HMR  
    ],  
    module: {  
        rules: [  
            {  
                test: /\.css$/,  
                exclude: path.resolve(__dirname, 'node_modules'),  
                use: ['style-loader', 'css-loader', 'postcss-loader'] // 注意：这里添加了style-loader来处理CSS的注入  
            },  
            {  
                test: /\.less$/,  
                exclude: path.resolve(__dirname, 'node_modules'),  
                use: ['style-loader', 'css-loader', 'postcss-loader', 'less-loader'],  
            }  
        ]  
    }  
};