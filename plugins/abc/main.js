const Command = require('../../util/command.js')
const Discord = require('discord.js')
const {client, getColour} = require('../../index.js')

const commands = {
    abc: new Command({
        name: 'abc',
        description: 'Returns `abc`.',
        /**
         * @param {Discord.Message} msg
         */
        fn(msg) {
            msg.channel.send(new Discord.RichEmbed()
            .setAuthor(`abc`, client.user.avatarURL)
            .setDescription(`abc`)
            .setFooter(`Used by: ${msg.author.tag}`, msg.author.avatarURL)
            .setColor(`#${getColour()}`))
        }
    })
}
module.exports = commands