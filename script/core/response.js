(function(app){
    app.Core.OnResponse=function(name, output, wildcards){
        let type=wildcards[0]
        let cmd=wildcards[1]
        let data=wildcards[3]
        if (cmd){
            app.Raise("Response."+type+"."+cmd,data)
        }
    }
    app.ResponseCmd=function(type,name,value){
        let cmd="set no_more "+type + "-"+name
        if (value){
            cmd=cmd+"=" +value
        }
        return cmd
    }
    app.Response=function(type,name,value){
        app.Send(app.ResponseCmd(type,name,value))
    }
})(App)