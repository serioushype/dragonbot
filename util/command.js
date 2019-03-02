/**
 * Creates new command instance.
 */
class Command {
    /**
     * Creates new command instance.
     * @param {{name: string, description?: string, fn: function, usage?: string}} param0 
     */
    constructor({name, description = 'No description provided.', fn, usage = name, access = 'public'}) {
        if(!(name instanceof String || typeof name === 'string')) throw new TypeError(`Unexpected type ${name ? name.constructor.name : 'null'} for property 'name'.`)
        else if(!(usage instanceof String || typeof usage === 'string')) throw new TypeError(`Unexpected type ${usage ? usage.constructor.name : 'null'} for property 'usage'.`)
        else if(!(fn instanceof Function || typeof fn === 'function')) throw new TypeError(`Unexpected type ${fn ? fn.constructor.name : 'null'} for property 'fn'.`)
        else if(!['public', 'protected', 'private'].includes(access)) throw new TypeError(`Unexpected value ${access} for property 'access'.`)
        this.name = name
        this.description = description
        this.execute = fn
        this.usage = usage
        this.access = access
    }
}
module.exports = Command