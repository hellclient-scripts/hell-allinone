(function(app){
app.Data.Busy={}
app.Core.OnBusyEnd=function(name, output, wildcards){
    world.EnableTriggerGroup("busy",false)
    world.EnableTimer("busy_retry",false)
    if (app.Data.Busy.Callback){
        app.ExecuteCallback(app.Data.Busy.Callback,app.Data.Busy.Data)
    }
}
app.Core.OnBusyRetry=function(name){
    app.Send("tuna")
}
app.CheckBusy=function(callback,data){
    world.EnableTriggerGroup("busy",true)
    world.EnableTimer("busy_retry",true)
    world.ResetTimer("busy_retry")
    app.Data.Busy={
        Callback:callback,
        Data:data,
    }
    app.Send("tuna")
}
})(App)