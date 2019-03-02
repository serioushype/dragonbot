const Command = require('../../util/command.js')
const {Message} = require('discord.js')
const Discord = require('discord.js')
const fs = require('fs')
const path = require('path')
const {client, getColour, getTheme} = require('../../index.js')

const commands = {
    config: new Command({
        name: 'config',
        description: 'Changes configs of guild.',
        usage: 'config <type> [Args]',
        access: 'protected',
        /**
         * @param {Message} msg
         * @param {string[]} args
         */
        fn(msg, args) {
            const config = require('../../config/config.json')
            const {owner, mods} = config
            if(msg.author.id !== owner && !mods.includes(msg.author.id)) return
            switch(args[0]) {
                case 'prefix':
                    if(args.slice(1).join(' ').trim() === '') return msg.channel.send(new Discord.RichEmbed()
                        .setAuthor(`Error`, client.user.avatarURL)
                        .setFooter(`Used by: ${msg.author.tag}`, msg.author.avatarURL)
                        .setColor(`#${getColour()}`)
                        .setDescription(`:x: Prefix must contain at least one character, besides whitespace.`))
                    
                    config.prefix = args.slice(1).join(' ').substring(0, 20)
                    fs.writeFileSync(path.join(__dirname, '../../config/config.json'), JSON.stringify(config, null, 4), 'utf8')
                    msg.channel.send(new Discord.RichEmbed()
                        .setAuthor(`Config changed`, client.user.avatarURL)
                        .setFooter(`Used by: ${msg.author.tag}`, msg.author.avatarURL)
                        .setColor(`#${getColour()}`)
                        .setDescription(`:white_check_mark: Prefix was changed to '${config.prefix}'.`))
                    break
                case 'addMod':
                    if(msg.author.id !== owner) return
                    if(!/[0-9]+/.test(args.slice(1).join(' '))) return msg.channel.send(new Discord.RichEmbed()
                        .setAuthor(`Error`, client.user.avatarURL)
                        .setFooter(`Used by: ${msg.author.tag}`, msg.author.avatarURL)
                        .setColor(`#${getColour()}`)
                        .setDescription(`:x: Please input ID, or mention user, to add a bot mod.`))
                    const modId = args.slice(1).join(' ').match(/[0-9]+/)[0]
                    config.mods.push(modId)
                    fs.writeFileSync(path.join(__dirname, '../../config/config.json'), JSON.stringify(config, null, 4), 'utf8')
                    msg.channel.send(new Discord.RichEmbed()
                        .setAuthor(`Config changed`, client.user.avatarURL)
                        .setFooter(`Used by: ${msg.author.tag}`, msg.author.avatarURL)
                        .setColor(`#${getColour()}`)
                        .setDescription(`:white_check_mark: Added mod with ID '${modId}'.`))
                    break
                case 'remMod':
                    if(msg.author.id !== owner) return
                    if(!/[0-9]+/.test(args.slice(1).join(' '))) return msg.channel.send(new Discord.RichEmbed()
                        .setAuthor(`Error`, client.user.avatarURL)
                        .setFooter(`Used by: ${msg.author.tag}`, msg.author.avatarURL)
                        .setColor(`#${getColour()}`)
                        .setDescription(`:x: Please input ID, or mention user, to add a bot mod.`))
                    const modId0 = args.slice(1).join(' ').match(/[0-9]+/)[0]
                    if(!config.mods.includes(modId0)) return msg.channel.send(new Discord.RichEmbed()
                        .setAuthor(`Error`, client.user.avatarURL)
                        .setFooter(`Used by: ${msg.author.tag}`, msg.author.avatarURL)
                        .setColor(`#${getColour()}`)
                        .setDescription(`That user is not in the list.`))
                    config.mods = config.mods.filter(m => m !== modId0)
                    fs.writeFileSync(path.join(__dirname, '../../config/config.json'), JSON.stringify(config, null, 4), 'utf8')
                    msg.channel.send(new Discord.RichEmbed()
                        .setAuthor(`Config changed`, client.user.avatarURL)
                        .setFooter(`Used by: ${msg.author.tag}`, msg.author.avatarURL)
                        .setColor(`#${getColour()}`)
                        .setDescription(`:white_check_mark: Removed mod with ID '${modId0}'.`))
                    break
                case 'theme':
                    const theme = args.slice(1).join('')
                    if(!['red', 'green', 'yellow', 'blue', 'purple', 'cyan'].includes(theme.toLowerCase())) return msg.channel.send(new Discord.RichEmbed()
                    .setAuthor(`Error`, client.user.avatarURL)
                    .setFooter(`Used by: ${msg.author.tag}`, msg.author.avatarURL)
                    .setColor(`#${getColour()}`)
                    .setDescription(`:x: Please type either red, green, yellow, blue, purple, or cyan.`)) 
                    config.colour = theme.toLowerCase()
                    fs.writeFileSync(path.join(__dirname, '../../config/config.json'), JSON.stringify(config, null, 4), 'utf8')
                    msg.channel.send(new Discord.RichEmbed()
                        .setAuthor(`Config changed`, client.user.avatarURL)
                        .setFooter(`Used by: ${msg.author.tag}`, msg.author.avatarURL)
                        .setColor(`#${getColour()}`)
                        .setDescription(`:white_check_mark: Theme set to ${theme.toLowerCase()}.`))
                    console.log(`${getTheme(true)}[Config]:\x1b[0m Changed theme to ${config.colour}.`)
                    break
                case 'owner':
                    if(msg.author.id !== owner) return
                    if(!/[0-9]+/.test(args.slice(1).join(' '))) return msg.channel.send(new Discord.RichEmbed()
                        .setAuthor(`Error`, client.user.avatarURL)
                        .setFooter(`Used by: ${msg.author.tag}`, msg.author.avatarURL)
                        .setColor(`#${getColour()}`)
                        .setDescription(`:x: Please input ID, or mention user, to set bot owner.`))
                    const botOwner = args.slice(1).join(' ').match(/[0-9]+/)[0]
                    console.log(`${getTheme(true)}[Config]:\x1b[0m Changed bot owner.\n - ${getTheme()}From:\x1b[0m ${config.owner}\n - ${getTheme()}To:\x1b[0m ${botOwner}`)
                    config.owner = botOwner 
                    fs.writeFileSync(path.join(__dirname, '../../config/config.json'), JSON.stringify(config, null, 4), 'utf8')
                    msg.channel.send(new Discord.RichEmbed()
                        .setAuthor(`Config changed`, client.user.avatarURL)
                        .setFooter(`Used by: ${msg.author.tag}`, msg.author.avatarURL)
                        .setColor(`#${getColour()}`)
                        .setDescription(`:white_check_mark: Changed bot owner to '${botOwner}'.`))
                    break
                case 'token':
                    if(msg.author.id !== owner) return
                    if(args.slice(1).join(' ').trim() === '') return msg.channel.send(new Discord.RichEmbed()
                        .setAuthor(`Error`, client.user.avatarURL)
                        .setFooter(`Used by: ${msg.author.tag}`, msg.author.avatarURL)
                        .setColor(`#${getColour()}`)
                        .setDescription(`:x: Please input bot token.`))
                    const token = args.slice(1).join(' ')
                    console.log(`${getTheme(true)}[Config]:\x1b[0m Changed token.\n - ${getTheme()}From:\x1b[0m ${config.token}\n - ${getTheme()}To:\x1b[0m ${token}`)
                    config.token = token
                    fs.writeFileSync(path.join(__dirname, '../../config/config.json'), JSON.stringify(config, null, 4), 'utf8')
                    msg.channel.send(new Discord.RichEmbed()
                        .setAuthor(`Config changed`, client.user.avatarURL)
                        .setFooter(`Used by: ${msg.author.tag}`, msg.author.avatarURL)
                        .setColor(`#${getColour()}`)
                        .setDescription(`:white_check_mark: Changed token of the bot.`))
                    msg.delete()
                    break
                default:
                    msg.channel.send(new Discord.RichEmbed()
                        .setAuthor(`Config list`, client.user.avatarURL)
                        .setFooter(`Used by: ${msg.author.tag}`, msg.author.avatarURL)
                        .setColor(`#${getColour()}`)
                        .setDescription(`Changes configurations of the bot.\n**Mods:** ${config.mods.map(m => client.users.some(u => u.id === m) ? client.users.find(u => u.id === m).username + ' (' + m + ')' : '(' +  m + ')').join(', ') || 'No mods.'}\n**Prefix:** ${config.prefix || 'No prefix.'}`)
                        .addField(`prefix`, `Changes global default prefix.\n**usage:** config prefix [prefix]`)
                        .addField(`addMod`, `Adds Bot Moderator which can change configurations of bot and do other stuff.\n**usage:** config addMod [id]`)
                        .addField(`remMod`, `Removes bot moderator.\n**usage:** config addMod [id]`)
                        .addField(`theme`, `Changes bot's theme.\n**usage:** config theme {red | green | yellow | blue | purple | cyan}`)
                        .addField(`owner`, `Changes bot's owner id.\n**usage:** config owner [id]`)
                        .addField(`token`, `Changes bot's token.\n**usage:** config token [token]`))
                    break
            }
        }
    })
}
module.exports = commands