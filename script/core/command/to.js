(function(App){
    let Command = Include("include/command.js")
    let To=function(data){
        Command.call(this,data)
    }
    To.prototype = Object.create(Command.prototype)
    To.prototype.CommandID="to"
    To.prototype.Push=function(){
        let data=this.Data
        App.NewCommand('function',function(){
            App.Core.Move.Move(data)
        },this.Final,this.Fail).Push()
        return this
    }
    return To
}(App))