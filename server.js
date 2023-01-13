var express = require('express')
var app = express()
const dotenv = require('dotenv')
dotenv.config()
const bodyParser = require('body-parser')
const axios = require('axios')
const qs = require('qs')
var cors = require('cors')
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
const port = process.env.PORT || 3000;

var token;

app.get('/api', (req, res) => {
    return res.send({
        error: false,
        message: 'Welcom to example notify',
        written_by: 'Nanine',
        published_on: '',
    })
})

app.get('/notifyredirect', (req, res) => {
    try{
    const { state, code } = req.query
    const {error_description} = req.query
    if(error_description){
        return res.status(400).send({message : error_description})
    }
    if(!state || !code){
        return res.status(400).send({message : 'ข้อมุลไม่ครบ'})
    }
    console.log('State :' + state + '  Code :' + code)

    const url = 'https://notify-bot.line.me/oauth/token'
    const jsonData = {
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: 'https://testnotify-production.up.railway.app/notifyredirect',
        client_id: 'ECqn7tb6U3tR68F6dSCfeE',
        client_secret: 'QYYcWgG60MwsnlBtOVUrcf2hsXDScQsFMpuUzsJEtu1',
    }

    const requestOption = {
        method: 'POST',
        headers: { 'content-type': 'application/x-www-form-urlencoded' },
        data: qs.stringify(jsonData),
        url,
    }
    axios(requestOption)
        .then(async (lineRes) => {
            if(lineRes.status === 200){
                console.log('Auth Success');
                token = lineRes.data.access_token
                return res.status(200)

            }else{
                console.log('failed')
                return res.status(400)
            }
        })
    }
    catch(err){
        return res.status(404)
    }
})



app.post('/adddata', (req, res) => {
    let { message } = req.body
    console.log('Token :' +token)
    try {
        if(!message){
            console.log('empty')
            return res.status(400).send({message : 'ข้อมุลไม่ครบ'})
        }
        const url = 'https://notify-api.line.me/api/notify'
        const jsonData = {
            message: message,
        }
        const requestOption = {
            method: 'POST',
            headers: {
                'content-type': 'application/x-www-form-urlencoded',
                Authorization: `Bearer ` + token,
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