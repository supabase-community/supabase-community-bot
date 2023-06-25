import { commands } from '../commands';
import { client } from '../supabase';

export const default_cooldowns = new Map();

export const user_cooldowns = new Map();

export const channel = client
  .channel('schema-db-changes')
  .on(
    'postgres_changes',
    {
      event: 'UPDATE',
      schema: 'public',
    },
    payload => {
      default_cooldowns.set(payload.new.name, payload.new.cooldown);
    }
  )
  .subscribe();

export async function loadCooldowns() {
  const { data: commandsData, error: commandsError } = await client
    .from('commands')
    .select('name, cooldown');
  const { data: cooldownsData, error: cooldownsError } = await client
    .from('user_cooldowns')
    .select('command_name, id_user, last_used');

  if (commandsError) {
    console.error(commandsError);
    return;
  }

  if (cooldownsError) {
    console.error(cooldownsError);
    return;
  }

  const missing_cooldowns = commands.filter(command => {
    return !commandsData.find(
      commandData => commandData.name === command.data.name
    );
  });

  if (missing_cooldowns) {
    const { error } = await client.from('commands').insert(
      missing_cooldowns.map(command => ({
        name: command.data.name,
        cooldown: command.cooldown || 0,
      }))
    );
    if (error) {
      // Ignore duplicate errors
      if (error.code !== '23505') {
        console.error(error);
        return;
      }
    }
  }

  for (const command of commandsData) {
    default_cooldowns.set(command.name, command.cooldown);
    user_cooldowns.set(command.name, new Map());
  }

  for (const cooldown of cooldownsData) {
    const converted_cooldown = new Date(cooldown.last_used).getTime();
    user_cooldowns
      .get(cooldown.command_name)
      ?.set(cooldown.id_user, converted_cooldown);
  }

  console.log('Cooldowns loaded.');
}

export async function setUserCooldown(id_user: string, command_name: string) {
  const cooldown = default_cooldowns.get(command_name);
  if (!cooldown) return;
  const date = new Date();
  user_cooldowns.get(command_name)?.set(id_user, date.getTime());
  const { error } = await client.from('user_cooldowns').insert({
    command_name,
    id_user,
    last_used: date,
  });
  if (error) console.error(error);
}

export function getUserTimeLeft(id_user: string, command_name: string): number {
  const user_cooldown: number = user_cooldowns.get(command_name)?.get(id_user);
  if (!user_cooldown) return 0;
  const default_cooldown: number = default_cooldowns.get(command_name);
  const expirationTime = user_cooldown + default_cooldown * 1000;
  const timeLeft = expirationTime - new Date().getTime();
  const secondsLeft = Math.floor(timeLeft / 1000);
  return secondsLeft;
}
