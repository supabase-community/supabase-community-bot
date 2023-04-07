import { env } from '@packages/config';
import { Client, GatewayIntentBits, REST, Routes } from 'discord.js';
import { commands } from './commands';

const { CLIENT_ID, DISCORD_TOKEN } = env;

const client = new Client({ intents: [GatewayIntentBits.Guilds] });
const rest = new REST({ version: '10' }).setToken(DISCORD_TOKEN);

client.on('ready', () => {
  console.log(`Logged in as ${client.user?.tag}!`);
});

client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;
  commands
    .find(command => command.data.name === interaction.commandName)
    ?.execute(interaction);
});

async function main() {
  try {
    console.log('Started refreshing application (/) commands.');

    await rest.put(Routes.applicationCommands(CLIENT_ID), {
      body: commands.map(command => command.data),
    });

    console.log('Successfully reloaded application (/) commands.');
  } catch (error) {
    console.error(error);
  }
  client.login(DISCORD_TOKEN);
}

main();
