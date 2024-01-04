(function(App){
    //^设定环境变数：no_more = "([^-]+)\-([^=]+)(=(.*)){0,1}"$
    App.Core.OnResponse=function(name, output, wildcards){
        let type=wildcards[0]
        let cmd=wildcards[1]
        let data=wildcards[3]
        if (cmd){
            App.Raise("Response."+type+"."+cmd,data)
        }
    }
    App.ResponseCmd=function(type,name,value){
        let cmd="set no_more "+type + "-"+name
        if (value){
            cmd=cmd+"=" +value
        }
        return cmd
    }
    App.Response=function(type,name,value){
        App.Send(App.ResponseCmd(type,name,value))
    }
})(App)