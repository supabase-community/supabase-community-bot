import {
  ChatInputCommandInteraction,
  PermissionsBitField,
  SlashCommandBuilder,
} from 'discord.js';
import {
  default_cooldowns,
  getUserTimeLeft,
  setUserCooldown,
} from '../api/cooldowns';
import { client } from '../supabase';

function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch (error) {
    return false;
  }
}

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
    subcommand
      .setName('cooldown')
      .setDescription('Set a cooldown for command execution')
      .addIntegerOption(option =>
        option
          .setName('duration')
          .setDescription(
            'The duration in seconds before you can execute the "showcase" command again'
          )
          .setRequired(false)
      )
  )
  .addSubcommand(subcommand =>
    subcommand.setName('list').setDescription('List all projects you added')
  );

export const cooldown = 3600;

export async function execute(interaction: ChatInputCommandInteraction) {
  const default_cooldown = default_cooldowns.get('showcase');

  switch (interaction.options.getSubcommand()) {
    case 'add':
      const timeLeft = getUserTimeLeft(interaction.user.id, 'showcase');

      if (timeLeft > 0) {
        await interaction.reply({
          content: `You can reuse this command in ${timeLeft} seconds`,
          ephemeral: true,
        });
        break;
      }

      const showcase = {
        name: interaction.options.getString('name'),
        description: interaction.options.getString('description'),
        link: interaction.options.getString('link'),
        supabase_relation: interaction.options.getString('supabase_relation'),
        need_contributors: interaction.options.getBoolean('need_contributors'),
        thumbnail: interaction.options.getString('thumbnail'),
        id_author: interaction.user.id,
      };

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

      if (!isValidUrl(showcase.link as string)) {
        await interaction.reply({
          content: 'Please provide a valid URL',
          ephemeral: true,
        });
        return;
      }

      if (showcase.thumbnail && !isValidUrl(showcase.thumbnail)) {
        await interaction.reply({
          content: 'Please provide a valid thumbnail URL',
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

      // @ts-ignore
      const { error: errorShowcaseInsert } = await client
        .from('showcases')
        .insert({
          ...showcase,
          id_message: embed.id,
        });

      if (errorShowcaseInsert) {
        await interaction.reply({
          content: 'Something went wrong, please try again later',
          ephemeral: true,
        });
        return;
      }

      await setUserCooldown(interaction.user.id, 'showcase');

      await interaction.reply({
        content: 'Your project has been added!',
        ephemeral: true,
      });

      break;

    case 'cooldown':
      const duration = interaction.options.getInteger('duration');

      // Equivalent to a moderator or admin role
      const hasPermission = interaction.member?.permissions.has([
        PermissionsBitField.Flags.KickMembers,
        PermissionsBitField.Flags.BanMembers,
      ]);

      if (!hasPermission) {
        await interaction.reply({
          content: 'You do not have the permission to use this command',
          ephemeral: true,
        });
        return;
      }

      if (!duration) {
        await interaction.reply({
          content: `The cooldown is currently set to ${default_cooldown} seconds`,
          ephemeral: true,
        });
        break;
      }

      const { error: errorCooldownUpsert } = await client
        .from('commands')
        .update({
          cooldown: duration,
        })
        .eq('name', 'showcase');

      if (errorCooldownUpsert) {
        await interaction.reply({
          content: 'Something went wrong, please try again later',
          ephemeral: true,
        });
        return;
      }

      await interaction.reply({
        content: `The cooldown has been set to ${duration} seconds`,
        ephemeral: true,
      });

      break;
  }
}
