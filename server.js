var express = require('express')
var app = express()
const port = process.env.PORT ||  3000;
const bodyParser = require('body-parser')
const axios = require('axios')
const qs = require('qs')
var cors = require('cors')
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.get('/api', (req, res) => {
    return res.send({
        error: false,
        message: 'Welcom to example notify',
        written_by: 'Nanine',
        published_on: '',
    })
})



app.post('/adddata', (req, res) => {
    let { accessCode } = req.body
    console.log(accessCode)
    try {
        const url = 'https://notify-api.line.me/api/notify'
        const jsonData = {
            message: `สวัสดีครับ`,
        }
        const requestOption = {
            method: 'POST',
            headers: {
                'content-type': 'application/x-www-form-urlencoded',
                Authorization: `Bearer ` + accessCode,
            },
            data: qs.stringify(jsonData),
            url,
        }
        axios(requestOption)
            .then((axiosRes) => {
                if (axiosRes.status === 200) {
                    console.log('Notification Success')
                    res.status(201).end()
                }
            })
            .catch((error) => {
                res.status(201).end()
                console.log(error.response.data)
            })
    } catch (err) {
        return res.status(400).send(err)
    }
})

app.listen(port, () => {
    console.log('Node App is running or port')
})