# Auto Rebuild DLL Plugin

用于在使用了 `DllPlugin` 的 `Webpack` 构建项目中自动重建 `DLL` 库的插件。


#### Usage

目前配置项只有两个，

1. dllConfig: Object    用于打包 DLL 的 Webpack 配置
2. debug: Boolean       表示是否需要输出 debug 信息，用于调试插件出现的问题

配置项可以直接参考用 `Webpack` 打包 `Dll` 时的配置项，例如：

```js
module.exports = {

    mode: "production",

    entry: {
        reactVendor: ['react', 'react-dom', 'react-router', 'react-router-dom'],
        babelVendor: ['@babel/polyfill'],
        lodashVendor: ['lodash'],
        momentVendor: ['moment', 'moment-timezone']
    },

    output: {
        filename: '[name].dll.js',
        path: path.resolve(__dirname, '../dist/res/js/dll2'),
        libraryTarget: 'var',
        library: '_dll_[name]_'
    },

    plugins: [
        new webpack.DllPlugin({
            path: path.resolve(__dirname, '../dist/res/js/dll2', '[name].manifest.json'),
            name: '_dll_[name]_'
        })
    ]
}
```

将以上导出的配置项作为 dllConfig 传入：

```js
const DLLConfig = require('./webpack.dll.config.js');
{
    ...others,
    plugins: [
        ...others,
        new AutoRebuildDllPlugin({
			dllConfig: DLLConfig,
			debug: false
        })
    ]
}
```


#### TODO

- [ ] 目前基于 package.json 的版本标识符来比较依赖库是否已经更新，不够准确，需要找到一个更好的办法