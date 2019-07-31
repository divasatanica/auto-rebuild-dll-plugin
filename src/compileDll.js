export const runCompiler = getCompiler => {
    return new Promise((resolve, reject) => {
        getCompiler().run((err, stats) => {
            if (err) {
                return reject(err);
            }
            if (stats.compilation.errors.length) {
                return reject(stats.compilation.errors);
            }

            resolve(stats);
        });
    });
}