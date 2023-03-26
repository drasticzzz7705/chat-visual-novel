# ChatVisualNovel - A fully customizable visual novel engine powered by ChatGPT

[![ci](https://github.com/prompt-engineering/chat-visual-novel/actions/workflows/ci.yml/badge.svg)](https://github.com/prompt-engineering/chat-visual-novel/actions/workflows/ci.yml)
![GitHub](https://img.shields.io/github/license/prompt-engineering/chat-visual-novel)
[![Discord](https://img.shields.io/discord/1082563233593966612)](https://discord.gg/FSWXq4DmEj)

English | [简体中文](./README.zh-CN.md)

Online Demo: https://chatvisualnovel.com/

Genshin Impact Doujin: https://genshin.chatvisualnovel.com/

Ace Attorney Doujin: https://ace.chatvisualnovel.com/

Join us:

[![Chat Server](https://img.shields.io/badge/chat-discord-7289da.svg)](https://discord.gg/FSWXq4DmEj)

# Deploy ChatVisualNovel on Vercel with Planetscale

Follow these steps to deploy ChatVisualNovel on Vercel with a serverless MySQL database provided by Planetscale:

1.  Clone [ChatVisualNovel](https://github.com/prompt-engineering/chat-visual-novel) from GitHub.
2.  Create a Vercel account and connect it to your GitHub account.
3.  Create a [Planetscale](https://app.planetscale.com) account.
4.  Set up your Planetscale database:
    1.  Log in to your Planetscale account with `pscale auth login`.
    2.  Create a password with `pscale password create <DATABASE_NAME> <BRANCH_NAME> <PASSWORD_NAME>`.
    3.  Push your database to Planetscale with `npx prisma db push`.
5.  Configure your Vercel environment:
    - Set `DATABASE_URL` to your Planetscale database URL.
    - Generate an encryption key with `node scripts/gen-enc.js` and set it as `ENC_KEY`.

With these steps completed, your ChatVisualNovel will be deployed on Vercel with a Planetscale serverless MySQL database.

## Local Usage

1.  Clone the [ChatVisualNovel repo](https://github.com/prompt-engineering/chat-visual-novel) from GitHub.
2.  Dependencies on Planetscale services still exist temporarily. Please register as mentioned in the previous section and configure `DATABASE_URL` in the `.env` file.
3.  Run `npm install`.
4.  Generate an encryption key using `node scripts/gen-enc.js` and configure it in the `.env` file in the format `ENC_KEY=***`. (Note: You can copy the `.env` file from env.template)
5.  You can now use the application by running `npm run dev`.

# Customization

[assets.json](src/assets/assets.json)

- When an item is marked with (i18). Either the key or value needs to be locale mapped in i18n configs.

```typescript
{
  "genres": string[],           //(Required)(i18n) Genres, used in Prompt.
  "player": {                   //(Optional) Player characters whose name will be generated by ChatGPT. Used only when there is no isPlayer: true in characters.
    "images": {
      [key: string]: string         //(Required) Each key is a mood of the character. Can have any number of moods but there must be one named neutral. All possible moods of the first character will be used in Prompt for mood selection of all characters. Value is the URL to the image of corresponding mood.
    },
    "imageSettings": {
      [key: string]: string         //(Optional) CSS override to this character's image when displayed. Take highest priority.
    }
  },
  "playerGender": string,       //(Optional)(i18n) Gender of player, used in Prompt when there is no isPlayer: true in characters.
  "girls": [{                   //(Optional) Girl characters whose names will be generated by ChatGPT. Used only when there is no isPlayer: false in characters.
    "images": {
      [key: string]: string         //(Required) Each key is a mood of the character. Can have any number of moods but there must be one named neutral. All possible moods of the first character will be used in Prompt for mood selection of all characters. Value is the URL to the image of corresponding mood.
    },
    "imageSettings": {
      [key: string]: string         //(Optional) CSS override to this character's image when displayed. Take highest priority.
    }
  }],
  "characters": {               //(Optional) Named characters.
    [key: string]: {                //(Required)(i18n) Character name, used in Prompt.
      "isPlayer": boolean,          //(Optional) When set to true, will be the player character. Please only set one character as isPlayer: true.
      "images": {
        [key: string]: string       //(Required) Each key is a mood of the character. Can have any number of moods but there must be one named neutral. All possible moods of the first character will be used in Prompt for mood selection of all characters. Value is the URL to the image of corresponding mood.
      },
      "imageSettings": {
        [key: string]: string       //(Optional) CSS override to this character's image when displayed. Take highest priority.
      }
    }
  },
  "places": {                   //(Required) Location (Background).
    [key: string]: {                //(Required)(i18n) Each key is a location. There must be at least one location. All possible locations will be used in Prompt for location selection.
      "image": string,              //(Required) URL to the image of the location.
      "bgm": string                 //(Optional) Background music of this location.
  },
  "imageSettings": {            //(Optional) Global Character image settings (CSS).
    [key: string]: string
  },
  "tts": {                      //(Optional) Online Text-to-speach service integration. Only basic GET is supported for now.
    [key: string]: {                //(Required) i18n locale, can set a default.
      "method": string,             //(Optional) GET or POST, defaults to GET.
      "url": string,                //(Required) API URL.
      "params": {                   //(Optional) URL query param map. Required when method is GET.
        "speaker": string,          //(Required) Query param name for speaker.
        "text": string,             //(Required) Query param name for text(dialogue).
        "additionalParams": string  //(Optional) Additional parameters as a string.
      }
    }
  }
}
```

## LICENSE

This code is distributed under the MIT license. See [LICENSE](./LICENSE) in this directory.
