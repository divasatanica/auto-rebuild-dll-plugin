import path from 'path';
import makeDir from 'make-dir';
import readPkg from 'read-pkg';
import fs from './share/fs';
import { cacheDir } from './path';
import createLogger from './share/logger';
import { LEVEL_ERROR, LEVEL_INFO } from './share/const';


export default settings => {
    const {
        debug = false,
        dllConfig
    } = settings;
    const errLogger = createLogger(/* showLogs= */debug, /* level= */LEVEL_ERROR);
    const infoLogger = createLogger(debug, LEVEL_INFO);
    const prevPkgPath = path.join(cacheDir, "package.json.hash"),
        entries = Object.keys(dllConfig.entry).reduce((acc, curr) => {
            return [...acc, ...dllConfig.entry[curr]];
        }, []);
    
    /**
     * Simply compare the version identifier to judge whether the dependencies
     * have been upgraded.
     * 
     * @param {Object} oldPkg the cached package.json
     * @param {Object} pkg the current package.json
     * @param {Array} dependencies the dependecies that configured in dllConfig
     */
    const validateDependencies = (oldPkg = {}, pkg = {}, dependencies) => dependencies.some(item => {
        infoLogger(`oldPkgItem: ${oldPkg[item]}`);
        infoLogger(`pkgItem: ${pkg[item]}`);
        infoLogger(`itemName: ${item}`);
        return oldPkg[item] !== pkg[item]
    });

    return Promise.all([
        fs.lstatAsync(path.join(cacheDir, "package.json.hash")).catch(errLogger),
        fs.readFileAsync(prevPkgPath).catch(err => {
            errLogger(err);
            return null;
        }),
        readPkg(settings.context).catch(err => {
            errLogger(err);
            return null;
        })
    ]).then(([buildHashDirExist, prevPkgHash, pkg]) => {

        prevPkgHash = prevPkgHash || "{}";
        infoLogger(`prevPkgHash is ${prevPkgHash}`);

        const oldPkg = JSON.parse(prevPkgHash.toString());
        let isPkgChanged = true;

        // infoLogger(`oldPkgHash is ${oldPkg.dependencies}`);
        // infoLogger(`pkgHash is ${pkg.dependencies}`);

        if (oldPkg) {
            isPkgChanged = validateDependencies(oldPkg, pkg.dependencies, entries);
        }

        infoLogger(`isPkgChanged ? ${isPkgChanged}`);

        if (buildHashDirExist && !isPkgChanged) {
            return true;
        }

        return makeDir(cacheDir).then(() => {
            fs.writeFileAsync(prevPkgPath, JSON.stringify(pkg.dependencies))
        }).then(() => false);
    })
}