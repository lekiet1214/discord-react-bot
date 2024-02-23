const { Collection, Events, Client } = require('discord.js');

module.exports = {
    name: Events.VoiceStateUpdate,
    once: false,
    async execute(oldState, newState) {
        if (oldState === newState) return; // This dump af, but failsafe
        
    }
};