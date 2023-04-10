import { CommandInteraction, SlashCommandBuilder } from 'discord.js';

import { env, messages } from '@packages/config';

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

  const message = messages.redirectReplyMessage({
    id_user: userId || 'there',
    id_channel: env.HELP_CHANNEL_ID,
  });

  await interaction.reply(message);
}
