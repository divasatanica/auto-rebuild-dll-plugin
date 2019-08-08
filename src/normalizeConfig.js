import { DllPlugin } from 'webpack';
import path from 'path';

export default dllConfig => {
    const {
        output,
        entry
    } = dllConfig;

    if (!output || !entry) {
        throw new Error("Invalid Dll Config!");
    }

    const libraryName = output.library || "_dll_[name]_",
        outputPath = output.path;

    return {
        entry,
        output,
        plugins: [
            new DllPlugin({
                path: path.join(outputPath, "[name].manifest.json"),
                name: libraryName
            })
        ]
    }
}