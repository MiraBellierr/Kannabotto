# Contributing to Jasmine

The following is a set of guidelines for contributing to Jasmine repo. The bot is written in **Javascript**

## Table of contents

- [How can you contribute?](#how-can-you-contribute)
- [Style guides](#style-guides)
- [Running the bot locally](#running-the-bot-locally)
- [How does the bot work?](#how-does-the-bot-work)

## How can you contribute?

### Reporting bugs and sharing your ideas

If you have an idea or you have found a bug in the bot, you can [open an issue](https://github.com/MiraBellierr/Jasmine/issues) on GitHub. Make sure it's not already on the list.

### Contributing code

First create a fork of the [MiraBellierr/Jasmine](https://github.com/MiraBellierr/Jasmine). If you are just getting started please see [How does the bot work](#how-does-the-bot-work). This will give you basic understanding of the code of the bot. To test the bot locally see [Running the bot locally](#running-the-bot-locally).
When pushing commits and creating pull requests please follow the [Style guides](#style-guides).

Please also use a linter to make sure the code is correctly formatted:

```shell
npm install eslint
```

## Style guides

### Git commit messages

- Use the present tense. (`Use toilet paper` not `Used toilet paper`)
- Use the imperative mood. (`Flush the toilet` not `Flushes the toilet`)
- Use this format in pull request merge commits: `Name (#Pull)`. (example: `Wash hands (#16)`)

### Git branch names

- Use `kebab-case` (aka. `hyphen-case`, `dash-case`)
  - Separate words with hyphens. (`branch-name` not `BranchName` or `branch_name`)
  - Don't include characters other than letters, numbers and hyphens.
  - Use lowercase letters. (`cool-branch` not `Cool-Branch`)
- Make them descriptive. (`fix-windows-install` not `fix-bugs`)
- Keep them short. (`install-lint` not `install-eslinter-to-keep-code-clean`)

## Running the bot locally

To run the bot on your machine first install all the required dependencies using:

```shell
npm install
```

Then you will have to set up a bot on [Discord Developers Portal](https://discordapp.com/developers) and add it on your Discord server.

After that, copy the bot token from the bot settings and put it as the `TOKEN` value in `config.json` file. Required parts are `bot_prefix` and `TOKEN`.
If you wish to try meme generator commands, go to imgflip and create an account, fill your username and password in `img_username` and `img_password`.

```json
{
    "bot_prefix": "",
    "owners_id": [""],
    "TOKEN": "",
    "log_channel": "",
    "color": "",
    "img_username": "",
    "img_password": "",
    "blist": "",
    "botlistme": "",
    "botlistspace": "",
    "botsfordiscord": "",
    "discordbots": "",
    "discordbotlist": "",
    "discordlabs": "",
    "disforge": "",
    "paradisebots": "",
    "radarbotdirectory": "",
    "topgg": "",
    "voidbots": ""
}
```

## How does the bot work?

`bot.js` is the main file in the bot. It handles connecting to the Discord API via **Discord.js** using `TOKEN` as the bot token (see [Running the bot locally](#running-the-bot-locally)). It also loads all the commands end events.

### Events

All client instance events are stored in the `events` folder. They are js modules exporting function that is triggered from an event. The parameters are `client` and after that all event callback parameters. (Example: The `message` callback takes `(client, message)`).

### Commands

All commands are stored in `commands`. They export (using `module.exports`) a `run` **function** taking three arguments:

- `client` - Discord client (same as in events)
- `message` - Instance of Discord `Message` class - message triggering the command
- `args` - Array containing the rest of arguments, seperated by spaces. (Example: `!tell everyone something nice` will be `[everyone, something, nice]`). To join arguments back to a string just use `array.join(arguments)`.

### Config

`config.json` stores bot config.
