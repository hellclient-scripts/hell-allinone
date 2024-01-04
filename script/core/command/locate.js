(function(App){
    let Command = Include("include/command.js")
    let Locate=function(data){
        Command.call(this,data)
        this.ContextKey="Move"
        this.Depth=10
        this.Transitions=["core.state.command.move"]
    }
    Locate.prototype = Object.create(Command.prototype)
    Locate.prototype.CommandID="locate"
    Locate.prototype.ApplyData=function(automaton){
        let move=App.Core.Move.NewLocate(this.Depth)
        automaton.WithData(this.ContextKey,move)
    }
    return Locate
}(App))