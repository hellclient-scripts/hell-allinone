(function(App){
    let Command = Include("include/command.js")
    let State=function(data){
        Command.call(this,data)
    }
    State.prototype = Object.create(Command.prototype)
    State.prototype.CommandID="state"
    State.prototype.Push=function(){
        let a=App.Push([this.Data],this.Final)
        a.WithFailState(this.Fail)
        return this
    }
    return State
}(App))