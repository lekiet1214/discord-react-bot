const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('say')
        .setDescription('Say something as the bot')
        .addStringOption(option =>
            option.setName('text')
                .setDescription('The text to say')
                .setRequired(true)),
    async execute(interaction) {
        if (interaction.user.id !== process.env.OWNER_ID) {
            return interaction.reply({ content: 'You are not my owner. Fuck off!!', ephemeral: true });
        }
        const text = interaction.options.getString('text');
        // Send the text to the channel without a reply
        await interaction.deferReply({ ephemeral: true })
            .then(() => {
                interaction.followUp("I'm saying: " + text + " in the channel.")
            }
            )
            .catch(console.error);

        await interaction.channel.send(text);

    }
};