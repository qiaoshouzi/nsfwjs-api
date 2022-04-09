const tf = require('@tensorflow/tfjs-node')
const nsfw = require('nsfwjs')

const http = require("http");
const app = http.createServer();
// const fs = require("fs");

const port = 3000;
const nsfwLoad = nsfw.load();

app.on("request", (req, res) => {
    try {
        reqUrl = req.url.split("/")
        if (reqUrl[1] == 'nsfw' && req.method == "POST") {
            let data = [];
            req.on("data", (chunk) => {
                data.push(chunk)
            })
            req.on("end", () => {
                let buffer = Buffer.concat(data);
                // 保存图片
                // fs.writeFile("./image.jpg", buffer, (err) => {
                //     if (!err) {
                //         res.end("ok")
                //     }
                // })

                const image = tf.node.decodeImage(buffer)
                nsfwLoad.then((model) => {
                    model.classify(image).then((predictions) => {
                        let data = {}
                        for (i of predictions) {
                            data[i['className']] = Math.trunc(i['probability'] * 10000) / 100
                                // console.log(i['className'], Math.trunc(i['probability'] * 10000) / 100)
                        }
                        res.end(JSON.stringify({
                            'code': 0,
                            'msg': '',
                            'data': data
                        }));
                    });
                });
            })
        } else {
            res.end(JSON.stringify({
                'code': -404,
                'msg': 'Not Found',
                'data': {}
            }));
        }
    } catch (e) {
        //未知错误
        res.end(JSON.stringify({
            'code': -1,
            'msg': e.message,
            'data': {}
        }));
    }
})

app.listen(port, () => {
    console.log("server run at ", port);
})