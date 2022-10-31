const express = require("express")
const mongoose = require("mongoose")
const path = require("path")
const bodyParser = require('body-parser')
const User = require('./model/user')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const JWT_SECRET = 'SLKNGASLNALNosjnro684654134askn87709809767654!@@#$%&^(**&$#'

const app = express()

mongoose.connect('mongodb://localhost:27017/store', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }).then(() => { console.log("connected to database...") })
    .catch(() => console.log("unable to connect..."))


//app.use('/', express.static(path.join(__dirname, '.')));
const publicPath = express.static(path.join(__dirname, 'static'), { redirect: false });
app.use(publicPath);
app.use(bodyParser.json())

app.post('/api/crud', async(req, res) => {
    res.render(crud.html)
    res.end()
})

app.post('/api/change-password', async(req, res) => {
    const { token, newpassword: plainTextPassword } = req.body

    if (!plainTextPassword || typeof plainTextPassword !== "string") {
        return res.json({ status: 'error', error: "Invalid password" })
    }
    if (plainTextPassword.length < 5) {
        return res.json({
            status: 'error',
            error: "password should be atleast 5 characters"
        })

    }

    try {
        const user = jwt.verify(token, JWT_SECRET)
        const _id = user.id
        const password = await bcrypt.hash(plainTextPassword, 20)
        await User.updateOne({ _id }, {
            $set: { password }
        })
        res.json({ status: "ok" })
    } catch (error) {
        console.log(error)
        res.json({ status: 'error', error: ';))' })
    }


    console.log('JWT Decodede:', user)
    res.json({ status: 'ok' })
})

app.post('/api/login', async(req, res) => {
    const { username, password } = req.body

    const user = await User.findOne({ username }).lean()

    if (!user) {
        return res.json({ status: 'error', error: 'INVALID USERNAME/PASSWORD' })
    }

    if (await bcrypt.compare(password, user.password)) {

        const token = jwt.sign({
                id: user._id,
                username: user.username
            },
            JWT_SECRET
        )

        return res.json({ status: 'OK', error: 'token' })

    }
    res.json({ status: 'error', error: 'Invalid username/password' })
})


app.post('/api/register', async(req, res) => {
    // const { username, password: plainTextPassword } = req.body
    const username = req.body.username;
    const pw = req.body.password;


    if (!username) {

        return res.json({ status: 'error', error: "invalid username" })
    }


    if (!pw) {

        return res.json({ status: 'error', error: "Invalid password" })
    }
    if (pw.length < 5) {
        console.log(username);
        console.log(pw);
        return res.json({
            status: 'error',
            error: "password should be atleast 5 characters"
        })

    }

    const password = await bcrypt.hash(pw, 10)

    try {
        const response = await User.create({
            username,
            password
        })
        console.log("user created successfully! ", response)
            //res.sendFile("login.html", { root: __dirname })
    } catch (error) {
        if (error.code === 11000) {
            return res.json({ status: 'error', error: "username already in use" })
        }
        throw error
    }

    // res.json({ status: "OK" })
    //res.sendFile("login.html", { root: __dirname });
    res.setHeader('Content-Type', 'text/html');
    res.type('html');
    res.sendFile(path.join(__dirname + '/static/login.html'));
    //res.sendFile("login.html");
})


app.listen(1566, () => { console.log("app is running " + 1566) })
