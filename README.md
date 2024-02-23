# DISCORD REACT BOT

![GitHub License](https://img.shields.io/github/license/lekiet1214/discord-react-bot)  [![Node.js CI](https://github.com/lekiet1214/discord-react-bot/actions/workflows/node.js.yml/badge.svg)](https://github.com/lekiet1214/discord-react-bot/actions/workflows/node.js.yml)

## Description

A discord bot built with discord.js and MongoDB.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)

## Prerequisites

- Node.js version 20.x installed on your system. If not, download and install it from the [official website](https://nodejs.org/dist/v20.11.1/).
- A Discord account and an application created on the [Discord Developer Portal](https://discord.com/developers/applications).
- A MongoDB database to store the bot's data. You can create a free account on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and create a new cluster to get the connection URI.

## Installation

1. **Clone or Download the Application Code**: You can either clone this Git repository or download it as a ZIP file.

   ```bash
   git clone
   ```

2. **Navigate to the Application Directory**: Open a terminal or command prompt and navigate to the directory where you have cloned or downloaded the code.

   ```bash
   cd discord-react-bot
   ```

3. **Install Dependencies**: Run the following command to install the dependencies:
   ```bash
   npm ci
   ```

## Usage

1. **Set Up Environment Variables**: Create a `.env` file in the root directory of the project and add the following environment variables:

   ```env
   DISCORD_TOKEN=YOUR DISCORD BOT TOKEN
   CLIENT_ID="1140130564565893120"
   MONGODB_URI="your mongodb uri"
   OWNER_ID="array of owner ids, seperated by commas"
   ```

2. **Run the Application**: Run the following command to start the application:

   ```bash
    npm run start
   ```

   You can refer to the `package.json` file to see the available scripts.

3. **Invite the Bot to Your Server**: Go to the [Discord Developer Portal](https://discord.com/developers/applications) and invite the bot to your server using the OAuth2 URL.

## Contributing

- Make a fork, do whatever you want to do.

## License

This project is licensed under the [MIT License](LICENSE).
