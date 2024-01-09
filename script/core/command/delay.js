(function(App){
    let Command = Include("include/command.js")
    let Delay=function(data){
        Command.call(this,data)
        this.ContextKey="Delay"
        this.Transitions=["wait"]
    }
    Delay.prototype = Object.create(Command.prototype)
    Delay.prototype.CommandID="delay"
    return Delay
}(App))