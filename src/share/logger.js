import { LEVEL_DEBUG, LEVEL_INFO, LEVEL_WARN, LEVEL_ERROR } from './const';

/**
 * 
 * @param {Boolean} showLogs Show logs or not
 * @param {Number} level Logs Level
 * @returns {(msg: String) => String}
 */
const createLogger = (showLogs, level) => {
    const msgPrefix = ({
        [LEVEL_DEBUG]: "Debug",
        [LEVEL_WARN]: "Warn",
        [LEVEL_INFO]: "Info",
        [LEVEL_ERROR]: "Error"
    })[level] || "Info";
    if (!showLogs) {
        return msg => msg;
    }
    return msg => {
        console.log(`[${msgPrefix}] AutoRebuildDllPlugin:`, msg);
        return msg;
    }
}

export default createLogger;