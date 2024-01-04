(function(App){
    let Command = Include("include/command.js")
    let Commands=function(data){
        Command.call(this,data)
        this.ContextKey="Commands"
        this.Transitions=["core.state.command.commands"]
    }
    Commands.prototype = Object.create(Command.prototype)
    Commands.prototype.CommandID="commands"
    App.RegisterState(new (Include("state/command/commands.js"))())
    return Commands
}(App))