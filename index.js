const { Client, Events, GatewayIntentBits, Message } = require('discord.js');
const dotenv = require('dotenv');

// load env file if it exists
dotenv.config();
console.log(process.env.DISCORD_TOKEN);
console.log(process.env.USER_ID_LIST);
userIdList = [];
// load the user id list from the environment
if (process.env.USER_ID_LIST) {
    userIdList = process.env.USER_ID_LIST.split(' ');
}

const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildMessageReactions],
});

client.once(Events.ClientReady, readyClient => {
    console.log(`Ready! Logged in as ${readyClient.user.tag}`);
});

client.on(Events.MessageCreate, Message => {
    // Check if the message is from a user in the user id list
    if (userIdList.includes(Message.author.id)) {
        // React with a thumbs up
        // const reactionEmoji = message.guild.emojis.cache.find(emoji => emoji.name === 'blobreach');
        try {

            Message.react(Message.guild.emojis.cache.get('1127249890083360889'))
                .then(() => console.log('Reacted with thumbs up!'))
                .catch((err) => console.error('Failed to react with thumbs up.', err));
        }
        catch (error) {
            console.error('Failed to react with thumbs up.', error);
        }
    }
});

client.login(process.env.DISCORD_TOKEN);