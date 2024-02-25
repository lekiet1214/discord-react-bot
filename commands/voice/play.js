const { AudioPlayerStatus, createAudioResource, createAudioPlayer, getVoiceConnection, joinVoiceChannel } = require('@discordjs/voice');
const { SlashCommandBuilder } = require('@discordjs/builders');
// const youtubedl = require('youtube-dl-exec');
// const logger = require('progress-estimator')();
// const { createReadStream } = require('fs');
const ytdl = require('ytdl-core');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('play')
        .setDescription('Plays a song from youtube')
        .addStringOption(option =>
            option.setName('song')
                .setDescription('The youtube URL of the song to play')
                .setRequired(true)),
    async execute(interaction) {
        await interaction.deferReply();
        const songUrl = interaction.options.getString('song');
        const voiceChannel = interaction.member.voice.channel;
        if (!voiceChannel) {
            return await interaction.editReply('You need to be in a voice channel to play music!');
        }
        voiceConnection = getVoiceConnection(interaction.guildId);
        if (voiceConnection) {
            try {
                if (interaction.client.audioPlayers.get(interaction.guildId)) {
                    return await interaction.editReply('I am already playing music in this server!');
                }
            }
            catch (error) {
            }
        }
        else {
            voiceConnection = joinVoiceChannel({
                channelId: voiceChannel.id,
                guildId: interaction.guildId,
                adapterCreator: interaction.guild.voiceAdapterCreator
            });
        }

        // Junk code, reference if ytdl-core fails

        // Download the song to temp folder
        // const tempFolder = require('os').tmpdir();
        // const songInfo = youtubedl(songUrl, {
        //     noWarnings: true,
        //     noCallHome: true,
        //     preferFreeFormats: true,
        //     youtubeSkipDashManifest: true,
        //     x: true,
        //     o: `${tempFolder}/${interaction.guildId}.%(ext)s`,
        //     f: 'bestaudio'
        // });
        // const songPath = `${tempFolder}/${interaction.guildId}.opus`;
        // const audioResource = createAudioResource(createReadStream(songPath), { inputType: StreamType.Arbitrary });

        const stream = ytdl(songUrl, {
            filter: 'audioonly',
            quality: 'highestaudio',
            highWaterMark: 1 << 25
        });
        const songInfo = await ytdl.getInfo(songUrl);
        console.log(songInfo.videoDetails.lengthSeconds);
        const audioResource = createAudioResource(stream);
        const audioPlayer = createAudioPlayer();
        audioPlayer.play(audioResource);
        const audioSubscription = voiceConnection.subscribe(audioPlayer);
        interaction.client.audioPlayers.set(interaction.guildId, audioPlayer);
        audioPlayer.on(AudioPlayerStatus.Playing, async () => {
            interaction.editReply(`Playing ${songUrl}`);
        });
        if ((songInfo.videoDetails.lengthSeconds) > 21500) {
            await interaction.followUp(`The song is ${songInfo.videoDetails.lengthSeconds} seconds long, which is too long for me to play! (Max 5 hours) The song will not play completely.`);
        }
        audioPlayer.on('error', error => {
            try {
                console.error(`Error: ${error}`);
                audioPlayer.stop();
                interaction.client.audioPlayers.delete(interaction.guildId);
            }
            catch (error) {
            }
        }
        );
        audioPlayer.on(AudioPlayerStatus.Idle, () => {
            audioPlayer.stop();
            interaction.client.audioPlayers.delete(interaction.guildId);
            interaction.editReply('Music stopped!');
            return;
        });

    }
};