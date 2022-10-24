const express = require('express')
const app = express()
const { IP_DNS, MIX_DNS, ALL_DNS, domainRegex } = require('./functions.js');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set('trust proxy', true)
app.set('json spaces', 2)

app.get('/', (req, res) => { res.send('Go to <a href="https://dnschecker.rares.eu.org/">https://dnschecker.rares.eu.org/</a> for documentation!') })

app.get('/all/:url/:dns?', domainRegex, async (req, res) => {
  res.send(await ALL_DNS(req.params.url))
})

app.get('/a/:url/:dns?', domainRegex, async (req, res) => {
  res.json(await IP_DNS(req.params.url, 1))
})

app.get('/aaaa/:url/:dns?', domainRegex, async (req, res) => {
  res.json(await IP_DNS(req.params.url, 2))
})

app.get('/:type(mx|ns|soa|txt|caa|cname|naptr|ptr|srv)/:url/:dns?', domainRegex, async (req, res) => {
  res.json(await MIX_DNS(req.params.url, req.params.type.toUpperCase()))
})

app.get('/ping', (req, res) => { res.send('pong') })

app.use((req, res, next) => {
  res.status(404).json({ message: 'Ohh you are lost, read the API documentation to find your way back home :)' })
})

module.exports = app