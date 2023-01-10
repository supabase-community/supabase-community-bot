import {
  CommandInteraction,
  SlashCommandBuilder,
  ThreadChannel,
} from 'discord.js';

export const data = new SlashCommandBuilder()
  .setName('done')
  .setDescription('Use this command to close a post and mark it as solved.');

export async function execute(interaction: CommandInteraction) {
  const isThread = interaction.channel?.isThread();
  if (!isThread) {
    return await interaction.reply({
      content: 'You can only use this command in a thread.',
      ephemeral: true,
    });
  }

  const isArchived =
    interaction.channel.archived ||
    interaction.channel.name.startsWith('[resolved]');
  if (isArchived) {
    return await interaction.reply({
      content: 'This thread is already archived.',
      ephemeral: true,
    });
  }

  const thread = interaction.channel as ThreadChannel;
  await thread.setName(`[resolved] - ${thread.name}`);
  await interaction.reply({ content: 'Done!' });
  await thread.setArchived(true);
}
