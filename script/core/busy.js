(function(App){
App.Data.Busy={}
world.EnableTimer("App.Core.OnBusyRetry",false)
App.Core.OnBusyEnd=function(name, output, wildcards){
    world.EnableTimer("App.Core.OnBusyRetry",false)
    if (App.Data.Busy.Callback){
        App.ExecuteCallback(app.Data.Busy.Callback,app.Data.Busy.Data)
    }
}
App.Core.OnBusyRetry=function(name){
    app.Send("bai")
}
App.CheckBusy=function(callback,data){
    world.EnableTimer("App.Core.OnBusyRetry",true)
    world.ResetTimer("App.Core.OnBusyRetry")
    app.Data.Busy={
        Callback:callback,
        Data:data,
    }
    app.Send("bai")
}
})(App)