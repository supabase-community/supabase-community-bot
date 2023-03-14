import { CommandInteraction, SlashCommandBuilder } from 'discord.js';

const questionsChannelId = '1006358244786196510';
const redirectReplyMessage =
  `Hello {user}! Please use the {channel} channel for questions. ` +
  'You will find it easier to get answers there!';

export const data = new SlashCommandBuilder()
  .setName('redirect')
  .setDescription(
    'Use this command to remind a user to use the proper question channel.'
  )
  .addUserOption(option =>
    option
      .setName('user')
      .setDescription('The user you want to mention')
  );

export async function execute(interaction: CommandInteraction) {
  const userId = interaction.options.getUser('user')?.id;
  
  let msg = redirectReplyMessage.replace(
    '{user}',
    userId ? `<@${userId}>` : 'there'
  );

  msg = msg.replace('{channel}', `<#${questionsChannelId}>`);

  await interaction.reply(msg);
}
