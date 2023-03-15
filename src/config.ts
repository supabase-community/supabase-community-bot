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

export const config = {
  redirectReplyMessage:
    'Hello {user}! Please use the <#1006358244786196510> channel for questions. You will find it easier to get answers there!',
};
