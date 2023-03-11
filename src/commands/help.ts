import { CommandInteraction, SlashCommandBuilder } from 'discord.js';
import { env } from '../config';

if (!env.HELP_CHANNEL_ID) {
  throw new Error("No help channel ID in env!")
}

export const data = new SlashCommandBuilder()
  .setName('help')
  .setDescription(
    'Use this command to remind a user to use the proper help channel.'
  )
  .addUserOption(option =>
    option
      .setName('user')
      .setDescription('The user you want to mention')
      .setRequired(true)
  );

export async function execute(interaction: CommandInteraction) {
  await interaction.reply(
    `Hello ${interaction.options.getUser(
      'user'
    )}! Please use the <#${env.HELP_CHANNEL_ID}> channel for questions. ` +
      'You will find it easier to get answers there!'
  );
}
