const fs = require('fs')
const path = require('path')
const {exec} = require('child_process')
const cwd = path.join(__dirname, `../../$mdl_new`)
const {getTheme} = require('../../index.js')

class Module {
    static deleteUnemptyDir(dir) {
        fs.readdirSync(dir).forEach(f => {
            const p = path.join(dir, f)
            if(fs.statSync(p).isDirectory()) Module.deleteUnemptyDir(p)
            else fs.unlinkSync(p)
        })
        fs.rmdirSync(dir)
    }
    cloneRepo() {
        exec(`git --help`, e => {
            if(e) throw `Git is not installed.`
        })
        fs.mkdirSync(cwd)
        exec(`git clone ${this.repo} ./`, { cwd }, e => {
            if(e) {
                console.log(`${getTheme(true)}[Git]:\x1b[0m ${err}`)
                throw e
            }
            this.moveDir()
        })
    }
    moveDir() {
        const p = path.join(cwd, this.name)
        if(!fs.existsSync(p) || !fs.statSync(p).isDirectory()) throw `Plugin '${this.name}' in '${this.repo}' either doesn't exist or is not a directory.`
        if(!fs.existsSync(path.join(p, 'module.json'))) throw `Directory '${this.name}' in '${this.repo}' is not a plugin.`
        fs.rename(p, path.join(__dirname, `../${this.name}`), e => {
            if(e) throw e.message
            Module.deleteUnemptyDir(cwd)
        })
    }
    constructor(repo, name) {
        this.name = name
        this.repo = repo
        this.cloneRepo()
    }
}
module.exports = Module