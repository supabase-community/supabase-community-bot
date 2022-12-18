import { BaseInteraction } from 'discord.js';
import { commands } from '../commands';

export const name = `interactionCreate`;
export const once = false;
export async function execute(interaction: BaseInteraction) {
  if (interaction.isChatInputCommand()) {
    console.log(
      `[interaction]: ${interaction.user.tag} in #${interaction?.channel?.id} triggered an interaction command: ${interaction.commandName}.`
    );

    commands
      .find(command => command.data.name === interaction.commandName)
      ?.execute(interaction);
  }
}
