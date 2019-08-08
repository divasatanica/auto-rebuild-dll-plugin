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
            let vendorMapper = (vendorName, vendor) => vendor.reduce((acc, curr) => ({
                ...acc,
                [curr]: vendorName
            }), {});
            return {
                ...acc,
                ...vendorMapper(curr, dllConfig.entry[curr])
            };
        }, {});
    
    /**
     * Simply compare the version identifier to judge whether the dependencies
     * have been upgraded.
     * 
     * @param {Object} oldPkg the cached package.json
     * @param {Object} pkg the current package.json
     * @param {Array<String>} dependencies the dependecies that configured in dllConfig
     * @returns {{isPkgChanged: Boolean, changedPkgName: Array<String>}} validation results
     */
    const validateDependencies = (oldPkg = {}, pkg = {}, dependencies) => {
        let changedPkgName = [];
        dependencies.forEach(item => {
            infoLogger(`oldPkgItem: ${oldPkg[item]}`);
            infoLogger(`pkgItem: ${pkg[item]}`);
            infoLogger(`itemName: ${item}`);
            if (oldPkg[item] !== pkg[item]) {
                changedPkgName.push(entries[item]);
            }
        });
        return {
            isPkgChanged: changedPkgName.length > 0,
            changedPkgName: [...new Set(changedPkgName)]
        };
    };

    const catchErrorWithLogger = err => {
        errLogger(err);
        return null;
    }

    return Promise.all([
        fs.lstatAsync(dllConfig.output.path).catch(catchErrorWithLogger),
        fs.lstatAsync(path.join(cacheDir, "package.json.hash")).catch(catchErrorWithLogger),
        fs.readFileAsync(prevPkgPath).catch(catchErrorWithLogger),
        readPkg(settings.context).catch(catchErrorWithLogger)
    ]).then(([dllOutputDirExist, buildHashDirExist, prevPkgHash, pkg]) => {

        prevPkgHash = prevPkgHash || "{}";
        infoLogger(`prevPkgHash is ${prevPkgHash}`);

        const oldPkg = JSON.parse(prevPkgHash.toString());
        let isPkgChanged = true;

        // infoLogger(`oldPkgHash is ${oldPkg.dependencies}`);
        // infoLogger(`pkgHash is ${pkg.dependencies}`);

        let result = {
            isPkgChanged,
            changedPkgName: []
        };

        if (oldPkg && dllOutputDirExist) {
            result = validateDependencies(oldPkg, pkg.dependencies, Object.keys(entries));
            isPkgChanged = result.isPkgChanged;
        }

        infoLogger(`isPkgChanged ? ${isPkgChanged}`);
        infoLogger(`isDllOutputExist ? ${dllOutputDirExist}`);

        if (dllOutputDirExist && buildHashDirExist && !isPkgChanged) {
            return {
                isPkgChanged,
                changedPkgName: []
            };
        }

        let dllEntryHash = Object.keys(entries).reduce((acc, curr) => ({
            ...acc,
            [curr]: pkg.dependencies[curr]
        }), {});

        return makeDir(cacheDir).then(() => {
            fs.writeFileAsync(prevPkgPath, JSON.stringify(dllEntryHash))
        }).then(() => result);
    })
}