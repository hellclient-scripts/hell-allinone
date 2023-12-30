(function(App){
    let globalstatecontext=Include("state/globalstatecontext.js")
    App.Data.State=""
    App.Data.StateHistory=[]
    App.Data.StateHistoryMax=50
    App.States={}
    App.StateContext=new globalstatecontext()
    App.RegisterState=function(state){
        if (state.ID==""){
            throw "State id不可为空"
        }
        App.States[state.ID]=state
    }
    App.GetState=function(id){
        let state=App.States[id]
        if (!state){
            throw "未知的state id "+id
        }
        return state
    }
    App.LoggingState=false
    let logData=false
    App.LogState=function(withdata){
        App.LoggingState=true
        logData=withdata
    }
    App.ResetState=function(){
        App.StateContext.State==App.GetState("ready")
    }
    App.ChangeState=function(id){
        let state=App.GetState(id)
        if (App.LoggingState){
            Note("State log:change state ["+id+"]")
        }
        App.Data.StateHistory.push(id)
        App.Data.StateHistory=App.Data.StateHistory.slice(-App.Data.StateHistoryMax)
        App.StateContext.ChangeState(state)
    }
    App.CurrentState=function(){
        return App.StateContext.State
    }
    App.CurrentStateID=function(){
        let state=App.CurrentState()
        return state?state.ID:""
    }
    App.LastState=function(){
        return App.StateContext.LastState
    }
    App.RaiseStateEvent=function(event,data){
        App.StateContext.OnEvent(event,data)
    }
    App.OnStateLine=function(name,output,wildcards){
        App.RaiseStateEvent("line",output)
    }
    world.EnableTriggerGroup("stateline",false)
    App.RegisterState(new (Include("state/init.js"))())
    App.RegisterState(new (Include("state/ready.js"))())
    App.RegisterState(new (Include("state/loop.js"))())
    App.RegisterState(new (Include("state/manual.js"))())
    // App.RegisterState(new (Include("state/checkitem.js"))())
    // App.RegisterState(new (Include("state/died.js"))())
    // App.RegisterState(new (Include("state/reborn.js"))())
    App.StateInit=function(){
        App.ChangeState("init")
    }
    App.Bind("Init", "App.StateInit")
})(App)