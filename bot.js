const express = require('express');
const app = express();
const path = require('path');
require('dotenv').config();

const { Client, GatewayIntentBits } = require('discord.js');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildPresences
  ]
});

// Servir arquivos estáticos da pasta /public
app.use(express.static(path.join(__dirname, 'public')));

// Rota principal que serve o HTML
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'fvck.html'));
});

// API dos membros
app.get('/api/members', async (req, res) => {
  try {
    const guild = await client.guilds.fetch(process.env.GUILD_ID);
    await guild.members.fetch();

    const total = guild.memberCount;
    const online = guild.members.cache.filter(m => m.presence?.status === 'online').size;

    res.json({ total, online });
  } catch (err) {
    console.error("Erro na API:", err);
    res.status(500).json({ error: "Erro ao buscar membros" });
  }
});

// Inicia o servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});

// Login do bot
client.login(process.env.DISCORD_TOKEN);
