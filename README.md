# SupaCommunityBot

This is a community bot for the Supabase Discord server. The technology behind is Node with the help of the [discord.js](https://github.com/discordjs/discord.js) library.

Everyone is a welcome to contribute to this project. If you have any questions, don't hesitate to ask in the discussions tab.

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/en/) (v14 or higher)

### Installation

1. Clone the repo

```sh
git clone https://github.com/supabase-community/supabase-community-bot.git
```

2. Install NPM packages

*We are using [pnpm](https://pnpm.io/) as our package manager for this project. We recommend you to use it. You can install it with `npm install -g pnpm`.*

```sh
npm install # or pnpm install
```

3. Create a `.env` file in the root directory and add the following variables:

```sh
DISCORD_TOKEN="<Your Discord bot token>"
CLIENT_ID="<Your Discord bot client ID>"
```

4. Run the bot

```sh
npm run dev # or pnpm dev
```

## Contributing

Contributions are what make the open source community such an amazing place to be learn, inspire, and create. You can contribute to this project by:
  - Reporting a bug
  - Creating a pull request
  - Suggesting new features

Don't be afraid to ask questions. We are here to help you.

## License

Distributed under the MIT License. See [LICENSE](./LICENSE) for more information.