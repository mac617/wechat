'use strict'

var path = require('path')
var util = require('./libs/util')
var wechat_file = path.join(__dirname, './config/wechat.txt')

var config = {
    wechat: {
        appID: 'XXXX',
        appSecret: 'XXXX',
        token: 'XXXX',
        getAccessToken: function() {
            return util.readFileSync(wechat_file)
        },
        saveAccessToken: function(data) {
            data = JSON.stringify(data)
            return util.writeFileSync(wechat_file,data)
        }
    }
}


module.exports = config