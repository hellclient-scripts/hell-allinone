(function(App){
    let Command=function(data){
        this.Data=data
        this.ContextKey="Data"
        this.Transitions=[]
        this.Final=""
        this.Fail=""
        this.ID=this.CommandID
    }
    Command.prototype.CommandID=""
    Command.prototype.WithData=function(data){
        this.Data=data
        return this
    }
    Command.prototype.WithFinalState=function(final){
        this.Final=final
        return this
    }
    Command.prototype.WithFailState=function(fail){
        this.Fail=fail
        return this
    }
    Command.prototype.ApplyData=function(automaton){
        automaton.WithData(this.ContextKey,this.Data)
    }
    Command.prototype.Push=function(){
        let a=App.Push(this.Transitions,this.Final)
        a.WithFailState(this.Fail)
        this.ApplyData(a)
        return this
    }
    return Command
})(App)