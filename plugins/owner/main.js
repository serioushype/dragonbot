const Command = require('../../util/command.js')
const {Message} = require('discord.js')
const Discord = require('discord.js')
const fs = require('fs')
const path = require('path')
const {client, getColour, getTheme} = require('../../index.js')
const Module = require('./moduleManager.js')
const config = require('../../config/config.json')

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
    }),
    plugin: new Command({
        name: 'plugin',
        description: 'Manages plugins.',
        usage: 'plugin [add/remove/list/enable/disable] <...args>',
        access: 'private',
        /**
         * 
         * @param {Discord.Message} msg 
         * @param {string[]} args 
         */
        fn(msg, args) {
            const {owner} = config
            if(msg.author.id !== owner) return
            switch(args[0]) {
                case 'add':
                    const repo = args[1]
                    const dir = args.slice(2).join(' ').replace(/[.][/]/gm, '')
                    try {
                        new Module(repo, dir)
                        msg.channel.send(new Discord.RichEmbed()
                            .setAuthor(`Plugin installed`, client.user.avatarURL)
                            .setDescription(`Plugin '${dir}' installed.`)
                            .setFooter(`Used by: ${msg.author.tag}`, msg.author.avatarURL)
                            .setColor(`#${getColour()}`))
                    } catch(e) {
                        msg.channel.send(new Discord.RichEmbed()
                            .setAuthor(`Error`, client.user.avatarURL)
                            .setDescription(e)
                            .setFooter(`Used by: ${msg.author.tag}`, msg.author.avatarURL)
                            .setColor(`#${getColour()}`))
                        console.log(`${getTheme(true)}[Git]:\x1b[0m ${e}`)
                    }
                    break
                case 'remove':
                    const plug = args.slice(1).join(' ').trim().replace(/[.][/]|.[:]/gm, '')
                    if(!fs.existsSync(path.join(__dirname, `../${plug}`)) || !fs.statSync(path.join(__dirname, `../${plug}`)).isDirectory()) return msg.channel.send(new Discord.RichEmbed()
                        .setAuthor(`Error`, client.user.avatarURL)
                        .setDescription(`That plugin doesn't exist, or it isn't a plugin.`)
                        .setFooter(`Used by: ${msg.author.tag}`, msg.author.avatarURL)
                        .setColor(`#${getColour()}`))
                    Module.deleteUnemptyDir(path.join(__dirname, `../${plug}`))
                    msg.channel.send(new Discord.RichEmbed()
                        .setAuthor(`Plugin removed`, client.user.avatarURL)
                        .setDescription(`Plugin '${plug}' was removed.`)
                        .setFooter(`Used by: ${msg.author.tag}`, msg.author.avatarURL)
                        .setColor(`#${getColour()}`))
                    break
                case 'list':
                    const dirpath = path.join(__dirname, '..')
                    const allplug = fs.readdirSync(dirpath).filter(f => fs.statSync(path.join(dirpath, f)).isDirectory())
                    const eplug = allplug.filter(p => config.plugins.includes(p))
                    const dplug = allplug.filter(p => !eplug.includes(p))
                    msg.channel.send(new Discord.RichEmbed()
                        .setAuthor(`Plugin list`, client.user.avatarURL)
                        .setDescription(`Enabled and disable plugin list.`)
                        .addField(`Enabled`, `${eplug.join(', ') || 'No plugins are enabled.'}`)
                        .addField(`Disabled`, `${dplug.join(', ') || 'No plugins are disabled.'}`)
                        .setFooter(`Used by: ${msg.author.tag}`, msg.author.avatarURL)
                        .setColor(`#${getColour()}`))
                    break
                case 'enable':
                    const _plug = args.slice(1).join(' ')
                    if(!fs.existsSync(path.join(__dirname, `../${_plug}`)) || !fs.statSync(path.join(__dirname, `../${_plug}`)).isDirectory()) return msg.channel.send(new Discord.RichEmbed()
                        .setAuthor(`Error`, client.user.avatarURL)
                        .setDescription(`That plugin doesn't exist, or it isn't a plugin.`)
                        .setFooter(`Used by: ${msg.author.tag}`, msg.author.avatarURL)
                        .setColor(`#${getColour()}`))
                    if(config.plugins.includes(_plug)) return msg.channel.send(new Discord.RichEmbed()
                        .setAuthor(`Error`, client.user.avatarURL)
                        .setDescription(`Plugin already enabled.`)
                        .setFooter(`Used by: ${msg.author.tag}`, msg.author.avatarURL)
                        .setColor(`#${getColour()}`))
                    config.plugins.push(_plug)
                    fs.writeFileSync(path.join(__dirname, '../../config/config.json'), JSON.stringify(config, null, 4), 'utf8')
                    msg.channel.send(new Discord.RichEmbed()
                        .setAuthor(`Enabled`, client.user.avatarURL)
                        .setDescription(`Plugin '${_plug}' was enabled.`)
                        .setFooter(`Used by: ${msg.author.tag}`, msg.author.avatarURL)
                        .setColor(`#${getColour()}`))
                    break
                case 'disable':
                    const $plug = args.slice(1).join(' ')
                    if(!fs.existsSync(path.join(__dirname, `../${$plug}`)) || !fs.statSync(path.join(__dirname, `../${$plug}`)).isDirectory()) return msg.channel.send(new Discord.RichEmbed()
                        .setAuthor(`Error`, client.user.avatarURL)
                        .setDescription(`That plugin doesn't exist, or it isn't a plugin.`)
                        .setFooter(`Used by: ${msg.author.tag}`, msg.author.avatarURL)
                        .setColor(`#${getColour()}`))
                    if(!config.plugins.includes($plug)) return msg.channel.send(new Discord.RichEmbed()
                        .setAuthor(`Error`, client.user.avatarURL)
                        .setDescription(`Plugin already disabled.`)
                        .setFooter(`Used by: ${msg.author.tag}`, msg.author.avatarURL)
                        .setColor(`#${getColour()}`))
                    config.plugins = config.plugins.filter(p => p !== $plug)
                    fs.writeFileSync(path.join(__dirname, '../../config/config.json'), JSON.stringify(config, null, 4), 'utf8')
                    msg.channel.send(new Discord.RichEmbed()
                        .setAuthor(`Disabled`, client.user.avatarURL)
                        .setDescription(`Plugin '${$plug}' was disabled.`)
                        .setFooter(`Used by: ${msg.author.tag}`, msg.author.avatarURL)
                        .setColor(`#${getColour()}`))
                    break
                default:
                    
                    break
            }
        }
    })
}
module.exports = commands