const Discord = require('discord.js')
const client = new Discord.Client
const fs = require('fs')
const path = require('path')
const Command = require('./util/command.js')

const disComs = []
/**
 * Requires JSON, but with an update.
 * @param {string} json 
 * @returns {{} | [] | string | number | boolean | void} object
 */
function requirej(json) {
    const p = module.parent ? module.parent.dirname : __dirname
    if(!fs.existsSync(path.join(p, json))) throw new Error(`File '${path.join(p, json)}' doesn\'t exist.`)
    return JSON.parse(fs.readFileSync(path.join(p, json), 'utf8'))
}

/**
 * Gets theme as ascii colour.
 * @param {boolean} isBold 
 */
function getTheme(isBold = false) {
    const a = ['red', 'green', 'yellow', 'blue', 'purple', 'cyan']
    const {colour} = require('./config/config.json')
    return `\x1b[${isBold ? '1;' : '0;'}3${a.includes(colour.toLowerCase()) ? a.indexOf(colour.toLowerCase()) + 1 : 7}m`
}
/**
 * Returns colour as hex.
 * @returns {string} hex
 */
function getColour() {
    const {colour} = require('./config/config.json')
    switch(colour) {
        case 'red':
            return 'f45042'
        case 'green':
            return '71f441'
        case 'yellow':
            return 'f4e541'
        case 'blue':
            return '4191f4'
        case 'purple':
            return 'a341f4'
        case 'cyan':
            return '41f49d'
        default:
            return 'aaaaaa'
    }
}
/**
 * Disables command of a module.
 * @param {string} command
 * @param {string?} plugin
 */
function disableCommand(command, plugin = '') {
    if(!(command instanceof String || typeof command === 'string')) throw new TypeError(`Unexpected type '${command.constructor.name}' for argument 0. Expected type: 'String'.`)
    else if(!(plugin instanceof String || typeof plugin === 'string')) throw new TypeError(`Unexpected type '${plugin.constructor.name}' for argument 1. Expected type: 'String'.`)
    const p = plugin.trim().split(/[\n\r]/gm).join('')
    const c = command.split(/[\n\r\t ]/gm).join('')
    if(disComs.filter(a => p === '' && a === c || a[0] === p && a[1] === c).length === 0) p === '' ? disComs.push(c) : disComs.push([p, c])
}
client.on('ready', () => {
    console.log(`${getTheme(true)}[Client]:\x1b[0m Connected to discord.\n - ${getTheme()}ID:\x1b[0m ${client.user.id}\n - ${getTheme()}Tag:\x1b[0m ${client.user.tag}\n - ${getTheme()}Invite:\x1b[0m https://discordapp.com/oauth2/authorize?client_id=${client.user.id}&permissions=8&scope=bot`)
})
client.on('disconnect', () => {
    console.log(`${getTheme(true)}[Client]:\x1b[0m Client disconnected.`)
})
client.on('message', m => {
    if(!m.guild || m.author.bot) return
    const {plugins, prefix} = require('./config/config.json')
    const general = require('./config/general.json')
    const pfx = !!general[m.guild.id] && !!general[m.guild.id].prefix !== null ? general[m.guild.id].prefix : prefix
    if(m.content.startsWith(pfx)) {
        const [command, ...args] = m.content.slice(pfx.length).split(' ')
        fs.readdirSync('./plugins').filter(f => fs.statSync(`./plugins/${f}`).isDirectory()).forEach(p => {
            const pPath = `./plugins/${p}`
            if(fs.existsSync(path.join(__dirname, pPath, 'module.json'))) {
                const module = require(path.join(__dirname, pPath, 'module.json'))
                if(!module.main) return console.log(`${getTheme(true)}[Plugin]:\x1b[0m Expected property 'main' in plugin '${p}'.`)
                if(!module.name) return console.log(`${getTheme(true)}[Plugin]:\x1b[0m Expected property 'name' in plugin '${p}'.`)
                const name = !!module.name ? module.name.toString().trim().split(/[\n\r]/gm).join('') : ''
                if(!fs.existsSync(path.join(__dirname, pPath, module.main))) return
                const req = require(path.join(__dirname, pPath, module.main))
                if(Object.keys(req).filter(k => req[k] instanceof Command).includes(command) && disComs.filter(c => c[0] !== name && c[1] !== command).length === 0 && plugins.includes(name)) req[command].execute(m, args)
            }
            else return
        })
    }
})
client.login(require('./config/config.json').token)
module.exports = {client, getColour, getTheme, disableCommand, requirej}