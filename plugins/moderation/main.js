const Command = require('../../util/command.js')
const Discord = require('discord.js')
const {client, getColour} = require('../../index.js')
const config = require('../../config/general.json')
const fs = require('fs')
const path = require('path')

const commands = {
    ban: new Command({
        name: 'ban',
        description: 'Bans an user in the guild.',
        usage: 'ban [ID / mention]',
        /**
         * 
         * @param {Discord.Message} msg 
         * @param {string[]} args 
         */
        fn(msg, args) {
            if(!msg.member.hasPermission('BAN_MEMBERS') || !msg.guild.me.hasPermission('BAN_MEMBERS')) return msg.channel.send(new Discord.RichEmbed()
                .setAuthor(`Error`, client.user.avatarURL)
                .setDescription(`You or I don't have permission \`BAN_MEMBERS\` to do that.`)
                .setFooter(`Used by: ${msg.author.tag}`, msg.author.avatarURL)
                .setColor(`#${getColour()}`))
            if(args.join('') === '') return msg.channel.send(new Discord.RichEmbed()
                .setAuthor(`Error`, client.user.avatarURL)
                .setDescription(`:x: Provide an id or mention of the user to ban.`)
                .setFooter(`Used by: ${msg.author.tag}`, msg.author.avatarURL)
                .setColor(`#${getColour()}`))
            const user = args[0].match(/([0-9]+)/)[1]
            if(!msg.guild.members.some(u => u.id === user)) return msg.channel.send(new Discord.RichEmbed()
                .setAuthor(`Error`, client.user.avatarURL)
                .setDescription(`User \`${user}\` not found. They might have left the guild, or that user doesn't exist.`)
                .setFooter(`Used by: ${msg.author.tag}`, msg.author.avatarURL)
                .setColor(`#${getColour()}`))
            const usr = msg.guild.members.find(u => u.id === user)
            const reason = args.slice(1).join(' ') || 'No reason provided.'
            usr.ban(reason)
            msg.channel.send(new Discord.RichEmbed()
                .setAuthor(`${usr.user.tag} => Banned`, client.user.avatarURL)
                .addField(`Reason`, `${reason}`)
                .setThumbnail(usr.user.avatarURL)
                .setFooter(`Used by: ${msg.author.tag}`, msg.author.avatarURL)
                .setColor(`#${getColour()}`))
        }
    }),
    kick: new Command({
        name: 'kick',
        description: 'Kicks user from the guild.',
        usage: 'kick [ID / mention]',
        /**
         * 
         * @param {Discord.Message} msg 
         * @param {string[]} args 
         */
        fn(msg, args) {
            if(!msg.member.hasPermission('KICK_MEMBERS') || !msg.guild.me.hasPermission('KICK_MEMBERS')) return msg.channel.send(new Discord.RichEmbed()
                .setAuthor(`Error`, client.user.avatarURL)
                .setDescription(`You or I don't have permission \`KICK_MEMBERS\` to do that.`)
                .setFooter(`Used by: ${msg.author.tag}`, msg.author.avatarURL)
                .setColor(`#${getColour()}`))
            if(args.join('') === '') return msg.channel.send(new Discord.RichEmbed()
                .setAuthor(`Error`, client.user.avatarURL)
                .setDescription(`:x: Provide an id or mention of the user to kick.`)
                .setFooter(`Used by: ${msg.author.tag}`, msg.author.avatarURL)
                .setColor(`#${getColour()}`))
            const user = args[0].match(/([0-9]+)/)[1]
            if(!msg.guild.members.some(u => u.id === user)) return msg.channel.send(new Discord.RichEmbed()
                .setAuthor(`Error`, client.user.avatarURL)
                .setDescription(`User \`${user}\` not found. They might have left the guild, or that user doesn't exist.`)
                .setFooter(`Used by: ${msg.author.tag}`, msg.author.avatarURL)
                .setColor(`#${getColour()}`))
            const usr = msg.guild.members.find(u => u.id === user)
            const reason = args.slice(1).join(' ') || 'No reason provided.'
            usr.kick(reason)
            msg.channel.send(new Discord.RichEmbed()
                .setAuthor(`${usr.user.tag} => Kicked`, client.user.avatarURL)
                .addField(`Reason`, `${reason}`)
                .setThumbnail(usr.user.avatarURL)
                .setFooter(`Used by: ${msg.author.tag}`, msg.author.avatarURL)
                .setColor(`#${getColour()}`))
        }
    }),
    purge: new Command({
        name: 'purge',
        description: 'Purges 1-200 messages.',
        usage: 'purge [count]',
        /**
         * @param {Discord.Message} msg 
         * @param {string[]} args 
         */
        fn(msg, args) {
            if(!msg.member.permissionsIn(msg.channel.id).has('MANAGE_MESSAGES') || !msg.guild.me.permissionsIn(msg.channel.id).has('MANAGE_MESSAGES')) return msg.channel.send(new Discord.RichEmbed()
                .setAuthor(`Error`, client.user.avatarURL)
                .setDescription(`You or I don't have permission \`MANAGE_MESSAGES\` to do that in this channel.`)
                .setFooter(`Used by: ${msg.author.tag}`, msg.author.avatarURL)
                .setColor(`#${getColour()}`))
            const count = args.join('') ? args.join('').match(/([0-9]+)/)[1] : '10'
            const num = parseInt(count) || 10
            msg.channel.bulkDelete(num > 0 && num < 101 ? num : 10)
            msg.channel.send(new Discord.RichEmbed()
                .setAuthor(`Purged`, client.user.avatarURL)
                .setDescription(`Purged ${num} messages.`)
                .setFooter(`Used by: ${msg.author.tag}`, msg.author.avatarURL)
                .setColor(`#${getColour()}`)).then(m => setTimeout(() => m.delete(), 3000))
        }
    }),
    setPrefix: new Command({
        name: 'setPrefix',
        description: 'Sets prefix for current guild.',
        usage: 'setPrefix [prefix(20 char length)]',
        /**
         * @param {Discord.Message} msg 
         * @param {string[]} args 
         */
        fn(msg, args) {
            if(!msg.member.hasPermission('MANAGE_GUILD')) return msg.channel.send(new Discord.RichEmbed()
                .setAuthor(`Error`, client.user.avatarURL)
                .setDescription(`You don't have permission \`MANAGE_GUILD\` to do that in this channel.`)
                .setFooter(`Used by: ${msg.author.tag}`, msg.author.avatarURL)
                .setColor(`#${getColour()}`))
            const prefix = args.join(' ') || null
            if(!config[msg.guild.id]) config[msg.guild.id] = {
                prefix: null
            }
            config[msg.guild.id].prefix = prefix
            fs.writeFileSync(path.join(__dirname, `../../config/general.json`), JSON.stringify(config, null, 4), 'utf8')
            msg.channel.send(new Discord.RichEmbed()
                .setAuthor(`Prefix changed`, client.user.avatarURL)
                .setDescription(`Prefix was set to ${prefix === null ? 'Default' : '\'' + prefix + '\''}.`)
                .setFooter(`Used by: ${msg.author.tag}`, msg.author.avatarURL)
                .setColor(`#${getColour()}`))
        }
    })
}
module.exports = commands