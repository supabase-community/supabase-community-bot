import { config } from 'dotenv';
import { envsafe, str } from 'envsafe';
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';

const envPath = resolve(process.cwd(), '.env');

if (existsSync(envPath)) {
  config({ path: envPath });
} else {
  config({ path: resolve(process.cwd(), '../../.env') });
}

export const env = envsafe({
  NODE_ENV: str({
    devDefault: 'development',
    choices: ['development', 'test', 'production'],
  }),
  DISCORD_TOKEN: str(),
  CLIENT_ID: str(),
  HELP_CHANNEL_ID: str(),
});
