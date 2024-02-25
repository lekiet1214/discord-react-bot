const { Collection, Events, Client } = require('discord.js');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
dotenv.config();
const { uploadJson } = require('../mongoDb');

module.exports = {
    name: Events.VoiceStateUpdate,
    once: false,
    async execute(oldState, newState) {
        if (oldState.id == process.env.CLIENT_ID) {
            voiceJson = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../data/voice.json'), 'utf8'));
            if (!(newState.channelId === null)) {
                // log guildId and channelId to json                
                voiceJson[newState.guild.id] = newState.channelId;
                fs.writeFileSync(path.resolve(__dirname, '../data/voice.json'), JSON.stringify(voiceJson, null, 2));
                uploadJson(path.resolve(__dirname, '../data/voice.json'), 'voice');
            }
            else {
                if (newState.channelId === null) {
                    // remove guildId and channelId from json
                    try {
                        delete voiceJson[oldState.guild.id];
                        fs.writeFileSync(path.resolve(__dirname, '../data/voice.json'), JSON.stringify(voiceJson, null, 2));
                        uploadJson(path.resolve(__dirname, '../data/voice.json'), 'voice');
                        newState.client.audioPlayers.set(oldState.guild.id, null);
                        if (newState.client.audioPlayers.get(oldState.guild.id)) {
                            newState.client.audioPlayers.delete(oldState.guild.id);
                        }
                    } catch (error) {
                        console.error(error);
                    }
                }
            }
        }
    }
};