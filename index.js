const { Client, Events, GatewayIntentBits, Message } = require('discord.js');
const dotenv = require('dotenv');

// load env file if it exists
dotenv.config();
userIdList = [];

if (process.env.DEBUG == 'False') {
    console.log('Debug mode is off.');
    console.log = function () { };
    console.error = function () { };
    console.warn = function () { };
    console.info = function () { };
    console.debug = function () { };
    console.trace = function () { };

}


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

            Message.react(Message.guild.emojis.cache.get('785955350598910002'))
                .then(() => { })
                .catch((err) => console.error('Failed to react with thumbs up.', err));
        }
        catch (error) {
            console.error('Failed to react with thumbs up.', error);
            try {
                // get random emoji from the guild
                const emoji = Message.guild.emojis.cache.random();
                Message.react(emoji)
                    .then(() => { })
                    .catch((err) => console.error('Failed to react with random emoji.', err));
            }
            catch (error) {
                console.error('Failed to react with random emoji.', error);
            }
        }
    }
});

client.login(process.env.DISCORD_TOKEN);