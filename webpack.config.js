const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin'); // Импортируем плагин

module.exports = {
    entry: './src/index.js', // Основной файл JavaScript
    output: {
        filename: 'bundle.js', // Имя выходного файла
        path: path.resolve(__dirname, 'dist'), // Папка для выходных файлов
        clean: true, // Очищает папку dist перед каждой сборкой
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/index.html', // Шаблон HTML
            filename: 'index.html',       // Имя выходного файла
        }),
        new CopyWebpackPlugin({
            patterns: [
                { from: 'src/images', to: 'images' }, // Копируем изображения в dist/images
            ],
        }),
    ],
    module: {
        rules: [
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader'], // Для обработки CSS
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader', // Если вы используете Babel
                    options: {
                        presets: ['@babel/preset-env'],
                    },
                },
            },
            {
                test: /\.(png|jpe?g|gif|svg)$/i, // Для обработки изображений
                type: 'asset/resource', // Используем встроенный загрузчик Webpack 5
            },
        ],
    },
    devServer: {
        static: {
            directory: path.join(__dirname, 'dist'), // Папка для статических файлов
        },
        port: 3000, // Порт, на котором будет работать сервер
        open: true, // Автоматически открывать браузер
        hot: true, // Включить горячую замену модулей
    },
};