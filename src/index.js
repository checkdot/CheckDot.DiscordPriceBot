const express = require('express');
const app = express();
const port = 3000;
 
app.get('/', (req, res) => res.send('Hello World!'));
 
app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`));

const { Client } = require('discord.js')
const dotenv = require('dotenv')

const { fetchData } = require('./fetchData')
const { numberWithCommas } = require('./utils')

dotenv.config()

const client = new Client()

// eslint-disable-next-line
client.on('ready', () => console.log(`Bot successfully started as ${client.user.tag} 🤖`))

// Updates token price on bot's nickname every X amount of time
client.setInterval(async () => {
  const data = await fetchData()

  if (!data) return

  const { price, symbol, circSupply } = data

  client.guilds.cache.forEach(async (guild) => {
    const botMember = guild.me
    await botMember.setNickname(`${symbol}: $${numberWithCommas(price)}`)
  })

  client.user.setActivity(
    `MC: $${numberWithCommas(Math.round(price * circSupply))}`,
    { type: 'WATCHING' },
  )
}, (60 * 1000) * 20) // 20 minutes

client.login(process.env.DISCORD_API_TOKEN)
