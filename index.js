import {
  Client,
  GatewayIntentBits,
  Events,
  REST,
  Routes,
  SlashCommandBuilder
} from "discord.js";

const TOKEN = process.env.DISCORD_TOKEN;
const CLIENT_ID = process.env.CLIENT_ID;

if (!TOKEN) {
  console.error("ERRO: a variável DISCORD_TOKEN não foi configurada.");
  process.exit(1);
}

if (!CLIENT_ID) {
  console.error("ERRO: a variável CLIENT_ID não foi configurada.");
  process.exit(1);
}

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

  console.log("Comandos registrados com sucesso.");
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