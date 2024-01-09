(function(App){
    let Command = Include("include/command.js")
    let Do=function(data){
        Command.call(this,data)
        this.ContextKey="Command"
        this.Transitions=["core.state.command.do"]
    }
    Do.prototype = Object.create(Command.prototype)
    Do.prototype.CommandID="do"
    App.RegisterState(new (Include("state/command/do.js"))())
    return Do
}(App))