import webpack from 'webpack';
import isEmpty from 'lodash/isEmpty';
import once from 'lodash/once';

import createLogger from './share/logger';
import validateCache from './validateCache';
import { runCompiler } from './compileDll';
import { LEVEL_ERROR } from './share/const';

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

        const rebuildDll = once((compiler, callback) => {
            validateCache(settings).then(({ isPkgChanged, changedPkgName }) => {
                let config = dllConfig;
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
                    () => webpack(config)
                )).then(() => callback());
            }).catch(errLogger);
        });

        compiler.hooks.run.tapAsync("AutoRebuildDllPlugin", rebuildDll);
        compiler.hooks.watchRun.tapAsync("AutoRebuildDllPlugin", rebuildDll);
    }
}

export default AutoRebuildDllPlugin;