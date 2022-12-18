import { Client, GatewayIntentBits, REST, Routes } from 'discord.js';
import { commands } from './commands';
import { events } from './events';
import { env } from './config';

const { CLIENT_ID, DISCORD_TOKEN } = env;

const client = new Client({ intents: [GatewayIntentBits.Guilds] });
const rest = new REST({ version: '10' }).setToken(DISCORD_TOKEN);

// handle discord events
for (const event of events) {
  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args));
  } else {
    client.on(event.name, (...args) => event.execute(...args));
  }
}

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
