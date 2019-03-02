const Command = require('../../util/command.js')
const Discord = require('discord.js')
const {client, getColour} = require('../../index.js')
const fs = require('fs')
const path = require('path')

const commands = {
    ping: new Command({
        name: 'ping',
        description: 'Returns `pong`.',
        /**
         * @param {Discord.Message} msg
         */
        fn(msg) {
            msg.channel.send(new Discord.RichEmbed()
            .setAuthor(`Ping`, client.user.avatarURL)
            .setDescription(`Pong!`)
            .setFooter(`Used by: ${msg.author.tag}`, msg.author.avatarURL)
            .setColor(`#${getColour()}`))
        }
    }),
    help: new Command({
        name: 'help',
        usage: 'help [command]',
        description: 'Provides command list, or shows command help.',
        /**
         * @param {Discord.Message} msg
         * @param {string[]} args
         */
        fn(msg, args) {
            const {owner, mods} = require('../../config/config.json')
            if(args.join('').trim() !== '') {
                const com = args.join('').trim().split(' ')[0]
                fs.readdirSync(path.join(__dirname, '../')).filter(f => fs.statSync(path.join(__dirname, '../', f)).isDirectory()).forEach(f => {
                    const p = path.join(__dirname, '../', f)
                    if(!fs.existsSync(path.join(p, 'module.json'))) return
                    const module = require(path.join(p, 'module.json'))
                    if(!module.main || !module.name) return
                    if(!fs.existsSync(path.join(p, module.main.toString()))) return
                    const main = require(path.join(p, module.main.toString()))
                    const k = Object.keys(main).filter(k => main[k] instanceof Command)
                    if(!k.includes(com)) return
                    const c = main[com]
                    msg.channel.send(new Discord.RichEmbed()
                    .setAuthor(c.name.substring(0, 256), client.user.avatarURL)
                    .setFooter(`Used by: ${msg.author.tag}`, msg.author.avatarURL)
                    .setColor(`#${getColour()}`)
                    .addField(`usage`, c.usage.substring(0, 2048))
                    .setDescription(c.description.substring(0, 2048)))
                })
                return
            }
            const plugs = []
            const newPlugs = []
            fs.readdirSync(path.join(__dirname, '../')).filter(f => fs.statSync(path.join(__dirname, '../', f)).isDirectory()).forEach(f => {
                const coms = []
                const desc = []
                const p = path.join(__dirname, '../', f)
                if(!fs.existsSync(path.join(p, 'module.json'))) return
                const module = require(path.join(p, 'module.json'))
                const {access = 'public'} = module
                if(!module.main || !module.name) return
                if(!require('../../config/config.json').plugins.includes(module.name)) return
                if(!(access === 'public' || msg.author.id === owner || access === 'protected' && mods.includes(msg.author.id))) return
                if(!fs.existsSync(path.join(p, module.main.toString()))) return
                const main = require(path.join(p, module.main.toString()))
                Object.keys(main).filter(k => main[k] instanceof Command).forEach(c => {
                    const co = main[c]
                    if(co.access === 'private' && msg.author.id !== owner) return
                    else if(co.access === 'protected' && msg.author.id !== owner && !mods.includes(msg.author.id)) return
                    const n = co.name.substring(0, 30) + (co.name.length > 30 ? '...' : '')
                    const u = co.usage.substring(0, 60) + (co.usage.length > 60 ? '...' : '')
                    const d = co.description.substring(0, 118 - n.length - u.length) + (co.description.length > 118 - n.length - u.length ? '...' : '')
                    desc.push(`**${n}**\n${d}\n**usage:** ${u}`)
                    coms.push(c)
                })
                if(desc.join('').split('\n').join('').length > 2000) plugs.push([module.name.toString(), coms.map(c => `\`${c.name}\``).join(', ')])
                else plugs.push([module.name.toString(), desc.join('\n')])
            })
            while(plugs.length !== 0) {
                const nArr = []
                while(nArr.length === 0 || (nArr.map(p => p[1]).join('').split('\n').join('').length + (plugs[0] ? plugs[0][1].length : 0)) < 2000 && plugs.length !== 0) {
                    nArr.push(plugs.pop())
                }
                newPlugs.push(nArr)
            }
            for(const i in newPlugs) {
                const p = newPlugs[i]
                const embed = new Discord.RichEmbed()
                    .setAuthor(`Help (${parseInt(i) + 1}/${newPlugs.length})`, client.user.avatarURL)
                    .setFooter(`Used by: ${msg.author.tag}`, msg.author.avatarURL)
                    .setColor(`#${getColour()}`)
                p.forEach(m => embed.addField(m[0], m[1].trim() !== '' ? m[1] : 'No commands in this plugin.'))
                msg.author.send(embed)
            }
            msg.channel.send(`:thumbsup: Sent it in the **DMs**.`)
        }
    }),
    colour: new Command({
        name: 'colour',
        description: 'Generates random colour.',
        usage: 'colour <colour>',
        fn(msg, args) {
            function random() {
                let r = Math.floor(Math.random() * 255) + 1
                if(r > 255) r = r - 255
                return r
            }
            const rgb = [random(), random(), random()]
            msg.channel.send(new Discord.RichEmbed()
                .setAuthor(`Colour`, client.user.avatarURL)
                .setDescription(`Colour was generated.`)
                .addField(`RGB`, `rgb(${rgb.join(', ')})`)
                .addField(`Hex`, `#${rgb.map(c => c.toString(16)).join('')}`)
                .setFooter(`Used by: ${msg.author.tag}`, msg.author.avatarURL)
                .setColor(`#${rgb.map(c => c.toString(16)).join('')}`))
        }
    }),
    '8ball': new Command({
        name: '8ball',
        description: 'Provide question and bot will answer it.',
        /**
         * @param {Discord.Message} msg
         * @param {string[]} args 
         */
        fn(msg, args) {
            if(args.join(' ').trim() === '') return msg.channel.send(new Discord.RichEmbed()
            .setAuthor(`Error`, client.user.avatarURL)
            .setDescription(`Provide a question to answer.`)
            .setFooter(`Used by: ${msg.author.tag}`, msg.author.avatarURL)
            .setColor(`#${getColour()}`))
            const answer = [`It is certain.`,
            `It is decidedly so.`,
            `Without a doubt.`,
            `Yes - definitely.`,
            `You may rely on it.`,
            `As I see it, yes.`,
            `Most likely.`,
            `Outlook good.`,
            `Yes.`,
            `Signs point to yes.`,
            `Reply hazy, try again.`,
            `Ask again later.`,
            `Better not tell you now.`,
            `Cannot predict now.`,
            `Concentrate and ask again.`,
            `Don't count on it.`,
            `My reply is no.`,
            `My sources say no.`,
            `Outlook not so good.`,
            `Very doubtful.`]
            msg.channel.send(new Discord.RichEmbed()
            .setAuthor(`8ball`, client.user.avatarURL)
            .setDescription(`:8ball: ${answer[Math.floor(Math.random() * answer.length)] || 'Of course.'}`)
            .setFooter(`Used by: ${msg.author.tag}`, msg.author.avatarURL)
            .setColor(`#${getColour()}`))
        }
    })
}
module.exports = commands