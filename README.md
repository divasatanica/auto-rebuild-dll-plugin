# @vergiss/Auto Rebuild DLL Plugin

A Webpack Plugin for automatically rebuild dll libraries after they had been upgraded


#### Usage

Now it got only two config item:

1. dllConfig: Object    the configuration used for webpack building dll
2. debug: Boolean       need debug message output or not

The config you used while building dll with webpack can directly be used as this `dllConfig`'s value.

Here's the Example:

```js
/**
 *  webpack.dll.config.js 
 */
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


```js
/**
 *  webpack.config.js
 */
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

With this plugin, you can just remove the `DllReferencePlugin` in the config.
I'll push an example directory later.

#### TODO

Now we just judge whether the dependencies had been upgraded by its `package.json` version identifier and it's not accurate enough. The identifier like `\^1.2.3` means a version range instead of an exact version so we have to look for a better way.

Watch mode is not supported now (maybe supported later), because we consider using this plugin in building not in developing period.