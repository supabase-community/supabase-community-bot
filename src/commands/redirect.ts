import { CommandInteraction, SlashCommandBuilder } from 'discord.js';

import { config } from '../config';

export const data = new SlashCommandBuilder()
  .setName('redirect')
  .setDescription(
    'Use this command to remind a user to use the proper question channel.'
  )
  .addUserOption(option =>
    option.setName('user').setDescription('The user you want to mention')
  );

export async function execute(interaction: CommandInteraction) {
  const userId = interaction.options.getUser('user')?.id;

  let msg = config.redirectReplyMessage.replace(
    '{user}',
    userId ? `<@${userId}>` : 'there'
  );

  await interaction.reply(msg);
}
