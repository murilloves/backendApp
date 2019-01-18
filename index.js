const express = require('express')
const backendApp = express()

backendApp.get('/', (req, res) => {
    res.status(200).send('<h1>Hello Backend!!</h1>')
})

backendApp.listen(8080, () => {
    console.log('Backend rodando...')
})
