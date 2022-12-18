const { ActivityType } = require(`discord-api-types/v10`);
import { Client } from 'discord.js';

export const name = `ready`;
export const once = true;
export async function execute(client: Client) {
  console.log(`[ready]: logged in as ${client.user?.tag}`);
  console.log(
    `[ready]: currently online at ${client.guilds.cache.size} servers`
  );

  // sets the bot activity
  await client.user?.setActivity({
    name: `Supabase`,
    type: ActivityType.Watching,
  });
}
