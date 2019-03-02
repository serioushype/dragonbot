const {exec} = require('child_process')
const readline = require('readline')
const fs = require('fs')

function begin() {
    console.clear()
    const rl = readline.createInterface(process.stdin, process.stdout)
    const message = [
        '  _____                                ____        _   ',
        ' |  __ \\                              |  _ \\      | |  ',
        ' | |  | |_ __ __ _  __ _  ___  _ __   | |_) | ___ | |_ ',
        ' | |  | | \'__/ _` |/ _` |/ _ \\| \'_ \\  |  _ < / _ \\| __|',
        ' | |__| | | | (_| | (_| | (_) | | | | | |_) | (_) | |_ ',
        ' |_____/|_|  \\__,_|\\__, |\\___/|_| |_| |____/ \\___/ \\__|',
        '                    __/ |                              ',
        '                   |___/                               '
    ]
    console.log(`\x1b[1;31m${message.join('\n')}\x1b[0m`)
    console.log([
        `\x1b[31m[0]:\x1b[0m Start`,
        `\x1b[31m[1]:\x1b[0m Information`,
        `\x1b[31m[2]:\x1b[0m Update`,
        `\x1b[31m[3]:\x1b[0m Setup`,
        `\x1b[31m[4]:\x1b[0m Exit`
    ].join('\n'))
    rl.question('> ', o => {
        rl.close()
        switch(o) {
            case '0':
                Start()
                break
            case '1':
                Information()
                break
            case '2':
                console.log(`\x1b[1;31m[Error]:\x1b[0m Update is not yet released.`)
                break
            case '3':
                setup()
                break
            case '4':
                console.clear()
                process.exit(0)
                break
            default:
                console.log(`\x1b[1;31m[Error]:\x1b[0m Unexpected option ${o}`)
        }
    })
}
function Information() {
    console.clear()
    const rl = readline.createInterface(process.stdin, process.stdout)
    console.log([
        `Here is information about Dragon Bot, Node, OS.`,
        `If you are making an issue, please use this information.`,
        `Else, it's pretty much useless.`,
        ``,
        `\x1b[1;31m[Node v]:\x1b[0m ${process.version}`,
        `\x1b[1;31m[Dragon bot v]:\x1b[0m v${require('./package.json').version}`,
        `\x1b[1;31m[Arch]:\x1b[0m ${process.arch}`,
        `\x1b[1;31m[Platform]:\x1b[0m ${process.platform}`
    ].join('\n'))
    rl.question('\nPress enter to continue: ', () => {
        rl.close()
        begin()
    })
}
function setup() {
    const opts = {mods: [], plugins: ['general']}
    console.log(`This is setup for dragon bot. This will install some stuff necessary for Dragon bot.\n`)
    function colour() {
        const rl = readline.createInterface(process.stdin, process.stdout)
        rl.question(`Choose theme colour: (Red, Green, Yellow, Blue, Purple, Cyan) `, o => {
            rl.close()
            const m = o.split(/[\n\t\r ]/gm).join('').toLowerCase()
            if(!['red', 'green', 'yellow', 'blue', 'purple', 'cyan'].includes(m)) {
                console.log(`\x1b[1;31m[Error]:\x1b[0m Unknown colour ${o}, please choose red, green, yellow, blue, purple, cyan.`)
                colour()
            } else {
                opts.colour = m
                token()
            }
        })
    }
    function token() {
        const rl = readline.createInterface(process.stdin, process.stdout)
        rl.question(`Put token here: `, o => {
            rl.close()
            if(o.trim().length === 0) {
                console.log(`\x1b[1;31m[Error]:\x1b[0m Please input a token.`)
                token()
            } else {
                opts.token = o.trim()
                prefix()
            }
        })
    }
    function prefix() {
        const rl = readline.createInterface(process.stdin, process.stdout)
        rl.question(`Put prefix here(! for example): `, o => {
            rl.close()
            if(o.trim().length === 0) {
                console.log(`\x1b[1;31m[Error]:\x1b[0m Please input a prefix.`)
                token()
            } else {
                opts.prefix = o.trim().substring(0, 20)
                owner()
            }
        })
    }
    function owner() {
        const rl = readline.createInterface(process.stdin, process.stdout)
        rl.question(`Put your id here: `, o => {
            rl.close()
            if(o.trim().length === 0 || !/^[0-9]+$/.test(o.trim())) {
                console.log(`\x1b[1;31m[Error]:\x1b[0m Please input your id.`)
                token()
            } else {
                opts.owner = o.trim().substring(0, 20)
                init()
            }
        })
    }
    function init() {
        exec('npm i discord.js', (e, so, se) => {
            if(e) throw e
            if(!fs.existsSync('./config')) fs.mkdirSync('./config')
            fs.writeFileSync('./config/config.json', JSON.stringify(opts, null, 4), 'utf8')
            fs.writeFileSync('./config/general.json', '{}', 'utf8')
            console.log(`\x1b[1;31m[Setup]:\x1b[0m Dragon bot was setuped. Try running it now.`)
            console.log(`\x1b[1;31m[Setup]:\x1b[0m Going to main menu after 3 seconds.`)
            setTimeout(() => {
                begin()
            }, 3000)
        })
    }
    colour()
}
function Start() {
    console.clear()
    require('./index.js')
}
begin()