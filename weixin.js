'use strict'

var config = require('./config')
var Wechat = require('./wechat/wechat')
var wechatApi = new Wechat(config.wechat)


exports.reply = function* (next) {
    var message = this.weixin

    if (message.MsgType === 'event') {
        if(message.Event === 'subscribe') {
            if (message.EventKey) {
                console.log('扫二维码进来: ' + message.EventKey + ' ' + message.ticket)
            }
            
            this.body = '哈哈，你订阅了这个号'
        }
        else if (message.Event === 'unsubscribe') {
            console.log('无情取关')
            this.body = ''
        }
        else if (message.Event === 'LOCATION') {
            this.body = '您上报的位置是  ' + message.Latitude + '/' +
            message.Longitude +'-' + message.Precision
        }
        else if (message.Event === 'CLICK') {
            this.body = '您点击了菜单:  ' + message.EventKey
        }
        else if (message.Event === 'SCAN') {
            console.log('关注后扫二维码' + message.EventKey + ' ' + message.Ticket)

            this.body = '看到你扫了一下哦'
        }
        else if (message.Event === 'VIEW') {
            this.body = '您点击了菜单中的链接 :  ' + message.EventKey
        }
    }

    else if (message.MsgType === 'text') {
        var content = message.Content
        var reply = '额，你说的 ' + message.Content + ' 太复杂了'

        if (content === '1') {
            reply = '天下第一吃大米'
        }
        else if (content === '2') {
            reply = '天下第二尺豆腐'
        }
        else if (content === '3') {
            reply = '天下第三吃傻蛋'
        }
        else if (content === '4') {
            reply = [{
                title: '技术改变世纪',
                description: '只是个描述而已',
                picUrl: './image/58.jpg',
                url: 'https://github.com/'
            }]
        }
        else if (content === '5') {
            var data = yield wechatApi.uploadMaterial('image', __dirname + '/2.jpg')

            reply = {
                type: 'image',
                mediaId: data.media_id
            }
        }
        else if (content === '6') {
            var data = yield wechatApi.uploadMaterial('video', __dirname + '/6.mp4')

            reply = {
                type: 'video',
                title: '回复视频内容',
                description: '跳舞',
                mediaId: data.media_id

            }
        }
        else if (content === '7') {
            var data = yield wechatApi.uploadMaterial('image', __dirname + '/2.jpg')

            reply = {
                type: 'music',
                title: '回复音乐内容',
                description: '放松一下',
                musicUrl: 'http://mpge.5nd.com/2015/2015-9-12/66325/1.mp3',
                thumbMediaId: data.media_id
            }
        }
        else if (content === '8') {
            var data = yield wechatApi.uploadMaterial('image', __dirname
             + '/2.jpg', {type: 'image'})

            reply = {
                type: 'image', 
                mediaId: data.media_id
            }
        }
        else if (content === '9') {
            var data = yield wechatApi.uploadMaterial('video', __dirname
             + '/6.mp4', {type: 'video',description: '{"title":"really a nine place", "introduction": "never leave here"}'})

            reply = {
                type: 'video',
                title: '回复视频内容',
                description: '跳舞',
                mediaId: data.media_id

            }
        }
        else if (content === '10') {
            var picData = yield wechatApi.uploadMaterial('video', __dirname
             + '/6.mp4', {})

            var media = {
                articles: [{
                    title: 'tututu2',
                    thumb_media_Id: picData.media_id,
                    author: 'Scott',
                    digest: '没有摘要',
                    show_cover_pic: 1,
                    content: '没有内容',
                    content_source_url: 'https://github.com'

                }]
            }

            data = yield wechatApi.uploadMaterial('news', media, {})
            data = yield wechatApi.fetchMaterial(data.media_id)

            console.log(data)

            var item = data.new_item
            var news = []

            item.forEach(function(item) {
                news.push({
                    title: item.title,
                    decription: item.digest,
                    picUrl: picData.url,
                    url: item.url
                })
            })

            reply = news
        }

        this.body = reply
    }
    yield next
}