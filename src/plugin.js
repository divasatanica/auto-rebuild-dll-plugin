import webpack, { DllReferencePlugin } from 'webpack';
import isEmpty from 'lodash/isEmpty';
import once from 'lodash/once';
import path from 'path';

import createLogger from './share/logger';
import validateCache from './validateCache';
import { runCompiler } from './compileDll';
import { LEVEL_ERROR } from './share/const';
import normalizeConfig from './normalizeConfig';

class AutoRebuildDllPlugin {

    constructor (settings) {
        this._settings = settings;
    }

    apply (compiler) {
        const settings = Object.assign(compiler.options, this._settings);
        const errLogger = createLogger(/* showLog= */settings.debug, /* level= */LEVEL_ERROR);
        const dllConfig = settings.dllConfig;

        if (isEmpty(dllConfig.entry)) {
            return;
        }

        const getManifestPath = vendor => path.join(dllConfig.output.path, `${vendor}.manifest.json`);

        const attachDllReference = once(compiler => {
            Object.keys(dllConfig.entry).map(getManifestPath).forEach(item => {
                new DllReferencePlugin({
                    manifest: item
                }).apply(compiler);
            });
        });

        const rebuildDll = (compiler, callback) => {
            validateCache(settings).then(({ isPkgChanged, changedPkgName }) => {
                let config = dllConfig;
                attachDllReference(compiler);
                if (!isPkgChanged) {
                    return callback();
                }
                if (isPkgChanged && changedPkgName.length > 0) {
                    /**
                     * If isPkgChanged is true and changedPkgName array is not empty,
                     * specify the changed library to be rebuilt in webpack
                     */
                    config.entry = changedPkgName.reduce((acc, curr) => {
                        return {
                            ...acc,
                            [curr]: dllConfig.entry[curr]
                        }
                    }, {});
                }
                return Promise.resolve().then(() => runCompiler(
                    () => webpack(normalizeConfig(config))
                )).then(() => callback());
            }).catch(errLogger);
        };

        compiler.hooks.run.tapAsync("AutoRebuildDllPlugin", rebuildDll);
    }
}

export default AutoRebuildDllPlugin;