var App = {}
App.Mod = {}
App.Init = function () {
    App.CurrentLine={}
    App.Core = {}
    App.Info = {}
    App.Alias = {}
    App.Listeners = {}
    App.Data = {
        Running: false,
    }
    App.Mods = {}
    App.API={}
}
App.ExecuteCallback = function (name, data) {
    if (name) {
        var fn = eval(name)
        if (fn==null) {
            throw "回调[" + name + "]无法找到"
        }
        return fn(data)
    }
}

App.Bind = function (event, callback) {
    var listeners = App.Listeners[event]
    if (!listeners) {
        listeners = []
    }
    listeners.push(callback)
    App.Listeners[event] = listeners
}
App.Unbind = function (event, callback) {
    var listeners = App.Listeners[event]
    if (!listeners) {
        return
    }
    for (let i = 0; i < listeners.length; i++) {
        if (listeners[i] == callback) {
            listeners.splice(i, 1)
            return
        }
    }
}
App.UnbindAll = function (event) {
    delete (App.Listeners[event])
}
App.Raise = function (event, data) {
    var listeners = App.Listeners[event]
    if (listeners) {
        listeners.forEach(function (fn) {
            App.ExecuteCallback(fn,data)
        })
    }
}
App.Stopped = true
App.Stop = function () {
    App.Core.Sell.Reset()
    Note("中止任务")
    App.Stopped = true
    App.Raise("stop")
    App.RaiseStateEvent("stop")
}
App.Start = function () {
    App.Init()
    App.Load("param/params.js")
    App.Load("core/core.js")
    App.Load("info/info.js")
    App.Bind('GA','App.OnGA')
    
    //启动生命周期
    App.Raise("BeforeInit")
    App.Raise("Init")
    App.Raise("InitMod")
    App.Raise("Ready")
    App.Raise("AfterReady")
    App.Raise("Intro")

}
App.OnGA=function(){
    App.CurrentBlock=[]
}
App.Online=function(name, output, wildcards){
    App.CurrentLine={
        Plain:output,
        Raw:JSON.parse(DumpOutput(1))[0]
    }
    App.Raise('line',App.CurrentLine)
}
App.Load = function (name) {
    Include(name)
}

Dump = function (data, silence) {
    let output = JSON.stringify(data, null, 2)
    if (!silence) {
        world.Note(output)
    }
    return output
}
NoteJSON = function (data) {
    let output = JSON.stringify(data, null, 2)
    world.Note(output)
}
ShowJSON = Dump
Debug = function () {
    Dump(App.Data)
}
Bound = function () {
    Dump(App.Listeners)
}


