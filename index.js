const express = require('express')
const backendApp = express()

backendApp.get('/', (req, res) => {
    res.status(200).send('<h1>Hello Backend!!</h1>')
})

port = 8080
backendApp.listen(port, () => {
    console.log(`Backend rodando na porta ${port}...`)
})
