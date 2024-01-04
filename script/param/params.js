(function(App){
    world.Note("加载系统参数");
    App.Params={
        "tick":"650",
        "cmdinterval":"50",
        "cmdlimit":"15",
        "echo":"t",
    }
    App.InitParam=function(name,val){
        App.Params[name]=val
    }
    App.GetParam=function(name){
        var val=world.GetVariable(name)
        if (val===""){
            val=App.Params[name]
            if (val===undefined){
                val= ""
            }
        }
        return val
    }
    App.GetNumberParam=function(name){
        var val=App.GetParam(name)
        if (!val){
            return 0
        }
        return val-0
    }
    App.GetBoolParam=function(name){
        var val=App.GetParam(name).toLowerCase()
        if (!val){
            return false
        }
        return val=="t"||val=="true"
    }
})(App)