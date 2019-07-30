import webpack from 'webpack';
import isEmpty from 'lodash/isEmpty';

import normalizeConfig from './normalizeConfig';
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

        const rebuildDll = (compiler, callback) => {
            validateCache(settings).then(isValid => {
                if (isValid) {
                    return callback();
                }
                return Promise.resolve().then(() => runCompiler(
                    () => webpack(normalizeConfig(dllConfig))
                )).then(() => callback());
            }).catch(errLogger);
        };

        compiler.hooks.run.tapAsync("AutoRebuildDllPlugin", rebuildDll);
    }
}

export default AutoRebuildDllPlugin;