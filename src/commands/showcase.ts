import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import { client } from '../supabase';

export const data = new SlashCommandBuilder()
  .setName('showcase')
  .setDescription('Add a new project to showcase!')
  .addSubcommand(subcommand =>
    subcommand
      .setName('add')
      .setDescription('Add a new project')
      .addStringOption(option =>
        option
          .setName('name')
          .setDescription('The name of your project')
          .setMinLength(3)
          .setMaxLength(25)
          .setRequired(true)
      )
      .addStringOption(option =>
        option
          .setName('description')
          .setDescription('The description of your project')
          .setRequired(true)
      )
      .addStringOption(option =>
        option
          .setName('link')
          .setDescription('The link of your project')
          .setRequired(true)
      )
      .addStringOption(option =>
        option
          .setName('supabase_relation')
          .setDescription('How your project is using Supabase')
          .setRequired(true)
      )
      .addBooleanOption(option =>
        option
          .setName('need_contributors')
          .setDescription('Are you looking for contributors?')
          .setRequired(true)
      )
      .addStringOption(option =>
        option
          .setName('thumbnail')
          .setDescription('If you have any thumbnail')
          .setRequired(false)
      )
  )
  .addSubcommand(subcommand =>
    subcommand
      .setName('remove')
      .setDescription('Remove a project you added')
      .addStringOption(option =>
        option
          .setName('name')
          .setDescription('The name of your project')
          .setRequired(true)
      )
  )
  .addSubcommand(subcommand =>
    subcommand.setName('list').setDescription('List all projects you added')
  );

export async function execute(interaction: ChatInputCommandInteraction) {
  switch (interaction.options.getSubcommand()) {
    case 'add':
      const showcase = {
        name: interaction.options.getString('name'),
        description: interaction.options.getString('description'),
        link: interaction.options.getString('link'),
        supabase_relation: interaction.options.getString('supabase_relation'),
        need_contributors: interaction.options.getBoolean('need_contributors'),
        thumbnail: interaction.options.getString('thumbnail'),
        id_author: interaction.user.id,
      };

      try {
        new URL(showcase.link as string);
      } catch (error) {
        await interaction.reply({
          content: 'Please provide a valid URL',
          ephemeral: true,
        });
        return;
      }

      const missing_fields = Object.entries(showcase)
        .filter(([key, value]) => {
          const ignored_fields = ['thumbnail'];
          if (ignored_fields.includes(key)) return false;
          return value === '' || value == null;
        })
        .map(([key]) => key)
        .join(', ');

      if (missing_fields.length) {
        await interaction.reply({
          content: `Please fill all the required fields. Missing: ${missing_fields}`,
          ephemeral: true,
        });
        return;
      }

      const embed = await interaction.channel?.send({
        embeds: [
          {
            title: showcase.name as string,
            description: showcase.description as string,
            url: showcase.link as string,
            thumbnail: showcase.thumbnail
              ? {
                  url: showcase.thumbnail,
                }
              : undefined,
            fields: [
              {
                name: 'How my project is using Supabase',
                value: showcase.supabase_relation as string,
              },
              {
                name: 'Are you looking for contributors',
                value: showcase.need_contributors ? 'Yes' : 'No',
              },
            ],
          },
        ],
      });

      if (!embed) {
        await interaction.reply({
          content: 'Something went wrong, please try again later',
          ephemeral: true,
        });
        return;
      }

      const { error } = await client.from('showcases').insert({
        ...showcase,
        id_message: embed.id,
      });

      if (error) {
        await interaction.reply({
          content: 'Something went wrong, please try again later',
          ephemeral: true,
        });
        return;
      }

      await interaction.reply({
        content: 'Your project has been added!',
        ephemeral: true,
      });

      break;
  }
}
