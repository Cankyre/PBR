const fs = require('fs')

function getConfig() {
    return JSON.parse(fs.readFileSync('./config/config.json'))
}

function checkWhitelist(ip, config) {
    if (config.whitelist) {
        for (i in config.trustedIPs) {
            if (config.trustedIPs[i] == ip) {
                return true
            }
        }
        return false
    } else {
        return true
    }
}

function checkBlackList(ip, config) {
    if (config.blacklist) {
        for (i in config.banIPs) {
            if (config.banIPs[i] == ip) {
                return true
            }
        }
        return false
    } else {
        return false
    }
}

module.exports.getConfig = getConfig;
module.exports.checkBlackList = checkBlackList;
module.exports.checkWhitelist = checkWhitelist;