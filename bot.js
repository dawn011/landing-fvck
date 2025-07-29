require('dotenv').config(); // Isso deve vir no topo

const express = require('express');
const path = require('path');
const { Client, GatewayIntentBits } = require('discord.js');
const cors = require('cors');

const app = express();
app.use(cors());

// Servir página e arquivos
app.use(express.static(path.join(__dirname)));

app.get('/fvck', (req, res) => {
  res.sendFile(path.join(__dirname, 'fvck.html'));
});

// === Criar o client (tem que vir antes do login!) ===
const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildPresences],
});

// Agora pode fazer login com o token
client.login(process.env.DISCORD_TOKEN);

// Quando o bot estiver pronto
client.once('ready', () => {
  console.log(`Bot conectado como ${client.user.tag}`);
});

// Rota da API
app.get('/api/members', async (req, res) => {
  try {
    const guild = await client.guilds.fetch('1355654827882844230');
    const members = await guild.members.fetch();

    const total = members.size;
    const online = members.filter(m => m.presence && m.presence.status !== 'offline').size;

    res.json({ total, online });
  } catch (err) {
    console.error("Erro ao buscar membros:", err);
    res.status(500).json({ total: 0, online: 0 });
  }
});

// Start do servidor
app.listen(3000, () => {
  console.log('Servidor rodando em http://localhost:3000/fvck');
});
