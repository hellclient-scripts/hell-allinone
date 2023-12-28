(function(){
    let Automaton=function(states,final){
        //最终结束状态，如果是函数，会调用函数并等待next/fail
        this.FinalState=final
        this.Context={}
        this.Transitions=states?states:[]
        //
        this.FailState=""
        this.State=""
        this.Loop=""
    }
    Automaton.prototype.SetCurrentState=function(state){
        this.State=state
    }
    Automaton.prototype.WithFinalState=function(final){
        //最终失败状态，如果是函数，会调用函数并等待next/fail
        this.FinalState=final
        return this
    }
    Automaton.prototype.WithLoop=function(loop){
        this.Loop=loop
        return this
    }
    Automaton.prototype.WithFailState=function(final){
        this.FailState=final
        return this
    }
    Automaton.prototype.WithTransitions=function(states){
        this.Transitions=states?states:[]
        return this
    }
    Automaton.prototype.Insert=function(states){
        let s=states?states:[]
        this.Transitions=s.concat(this.Transitions)
    }
    Automaton.prototype.Append=function(states){
        let s=states?states:[]
        this.Transitions=this.Transitions.concat(s)
    }
    Automaton.prototype.WithData=function(key,value){
        this.Context[key]=value
        return this
    }
    return Automaton
})()