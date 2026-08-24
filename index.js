import {
  Client,
  GatewayIntentBits,
  Events,
  REST,
  Routes,
  SlashCommandBuilder
} from "discord.js";
import http from "http";

const TOKEN = process.env.DISCORD_TOKEN;
const CLIENT_ID = process.env.CLIENT_ID;

if (!TOKEN) {
  console.error("ERRO: DISCORD_TOKEN não configurado.");
  process.exit(1);
}

if (!CLIENT_ID) {
  console.error("ERRO: CLIENT_ID não configurado.");
  process.exit(1);
}

// Servidor HTTP necessário para o Render
const port = process.env.PORT || 10000;

http.createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end("VOID ONLINE");
}).listen(port, "0.0.0.0", () => {
  console.log(`Servidor HTTP ativo na porta ${port}`);
});

const commands = [
  new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Verifica se o VOID está online."),

  new SlashCommandBuilder()
    .setName("void")
    .setDescription("Mostra informações sobre o VOID.")
].map(command => command.toJSON());

const rest = new REST({ version: "10" }).setToken(TOKEN);

try {
  console.log("Registrando comandos...");

  await rest.put(
    Routes.applicationCommands(CLIENT_ID),
    { body: commands }
  );

  console.log("Comandos registrados.");
} catch (error) {
  console.error("Erro ao registrar comandos:", error);
}

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds
  ]
});

client.once(Events.ClientReady, readyClient => {
  console.log(`VOID online como ${readyClient.user.tag}`);
});

client.on(Events.InteractionCreate, async interaction => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === "ping") {
    await interaction.reply("🟣 **VOID** está online.");
  }

  if (interaction.commandName === "void") {
    await interaction.reply(
      "⛧ **VOID**\n" +
      "Bot sombrio e tecnológico para Discord.\n\n" +
      "Status: **ONLINE**"
    );
  }
});

client.login(TOKEN);