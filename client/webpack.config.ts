import HtmlWebpackPlugin from 'html-webpack-plugin';
import path from 'path';
import webpack from 'webpack';
import type { Configuration as DevServerConfiguration } from 'webpack-dev-server';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import CopyPlugin from 'copy-webpack-plugin';
import dotenv from 'dotenv';

dotenv.config();

type Mode = 'production' | 'development';

interface EnvVariables {
    mode: Mode,
    port: number
}

export default (env: EnvVariables) => {

    const isDev = env.mode === 'development';
    const isProd = env.mode === 'production';

    const config: webpack.Configuration = {
        mode: env.mode ?? 'development',
        entry: path.resolve(__dirname, 'src', 'index.tsx'),
        output: {
            path: path.resolve(__dirname, 'build'),
            filename: '[name].[contenthash].js',
            publicPath: '/',
            clean: true
        },
        plugins: [
            new HtmlWebpackPlugin({template: path.resolve(__dirname, 'public', 'index.html')}),
            isProd && new MiniCssExtractPlugin({
                filename: 'css/[name].[contenthash:8].css',
                chunkFilename: 'css/[name].[contenthash:8].css',
            }),
            isProd && new CopyPlugin({
                patterns: [
                    //{from: "source", to: "dest" },
                ]
            }),
            new webpack.ProvidePlugin({
                process: 'process/browser',
            }),
            new webpack.DefinePlugin({
                'process.env': JSON.stringify(process.env)
            })
        ],
        module: {
            rules: [
                {
                    test: /\.(png|jpg|jpeg|gif)$/i,
                    type: 'asset/resource'
                },
                {
                    test: /\.svg$/,
                    use: [
                        {
                            loader: '@svgr/webpack',
                            options: {
                                icon: true,
                                svgoConfig: {
                                    plugins: [
                                        {
                                            name: 'convertColors',
                                            params: {
                                                currentColor: true
                                            }
                                        }
                                    ]
                                }
                            }
                        }
                    ]
                },
                {
                    test: /\.module\.s(a|c)ss$/,
                    use: [
                        isProd ? MiniCssExtractPlugin.loader : "style-loader",
                        {
                            loader: "css-loader",
                            options: {
                                modules: {
                                    localIdentName: isDev ? '[path][name]__[local]' : '[hash:base64:8]'
                                }
                            } 
                        },
                        {
                            loader: 'postcss-loader',
                            options: {
                                postcssOptions: {
                                    plugins: [
                                        require("autoprefixer")
                                    ]
                                }
                            }
                        },
                        "sass-loader"
                    ]
                },
                {
                    test: /\.s(a|c)ss$/,
                    exclude: /\.module.(s(a|c)ss)$/,
                    use: [
                        isProd ? MiniCssExtractPlugin.loader : "style-loader",
                        "css-loader",
                        {
                            loader: 'postcss-loader',
                            options: {
                                postcssOptions: {
                                    plugins: [
                                        require("autoprefixer")
                                    ]
                                }
                            }
                        },
                        "sass-loader"
                    ]
                },
                {
                    test: /\.css$/,
                    use: [
                        isProd ? MiniCssExtractPlugin.loader : "style-loader",                    
                        {
                            loader: "css-loader",
                            options: {
                                modules: {
                                    localIdentName: isDev ? '[path][name]__[local]' : '[hash:base64:8]'
                                }
                            } 
                        },
                    ]
                },                
                {
                    test: /\.tsx?$/,
                    use: 'ts-loader',
                    exclude: /node_modules/,
                },
            ]
        },
        resolve: {
            extensions: ['.tsx', '.ts', '.js'],
            fallback: {
                "path": require.resolve("path-browserify"),
                "os": require.resolve("os-browserify/browser"),
                "crypto": require.resolve("crypto-browserify"),
                "vm": require.resolve("vm-browserify"),
                "stream": require.resolve("stream-browserify"),
            }
        },
        devtool: isDev ? 'inline-source-map' : undefined,
        devServer: isDev ? {
            port: env.port ?? 3000,
            open: true,
            historyApiFallback: true,
            hot: true
        } : undefined,
    }
    return config;
}