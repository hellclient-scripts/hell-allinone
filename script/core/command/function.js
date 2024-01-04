(function(App){
    let Command = Include("include/command.js")
    let Function=function(data){
        Command.call(this,data)
        this.ContextKey="Function"
        this.Transitions=["core.state.command.function"]
    }
    Function.prototype = Object.create(Command.prototype)
    Function.prototype.CommandID="function"
    App.RegisterState(new (Include("state/command/function.js"))())
    return Function
}(App))