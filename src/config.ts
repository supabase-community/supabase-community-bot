import 'dotenv/config';
import { envsafe, str } from 'envsafe';

export const env = envsafe({
  NODE_ENV: str({
    devDefault: 'development',
    choices: ['development', 'test', 'production'],
  }),
  DISCORD_TOKEN: str(),
  CLIENT_ID: str(),
});
