(function(App){
    App.Core.Check={}
    App.Core.Check.PendingSend=[]
    App.Core.Check.Send=function(cmds){
        App.Core.Check.PendingSend.push(cmds)
    }
    App.Core.Check.PendingCommands=[]
    App.Core.Check.PushCommands=function(cmds){
        App.Core.Check.PendingCommands.push(cmds)
    }
    App.Core.Check.Registered=[]
    App.Core.Check.Register=function(cdname,interval,fn){
        App.Core.Check.Registered.push({
            CD:cdname,
            Interval:interval,
            Fn:fn
        })
    }
    App.Core.Check.RegisterSend=function(cdname,interval,cmds){
        App.Core.Check.Register(cdname,interval,function(){
            App.Core.Check.Send(cmds)
        });
    }
    App.Core.Check.RegisterCallback=function(cdname,interval,callback){
        App.Core.Check.Register(cdname,interval,function(){
            App.ExecuteCallback(callback)
        });
    }
    App.Core.Check.Push=function(context){
        context=context||{}
        App.Core.Check.PendingSend=[]
        App.Core.Check.PendingCommands=[]
    
        for (var i=0;i<App.Core.Check.Registered.length;i++){
            let check=App.Core.Check.Registered[i]
            if (!check.CD || App.Core.Cooldown.Ready(check.CD,check.Interval)){
                check.Fn(context)
            }
        }
        let cmds=[]
        if (App.Core.Check.PendingSend.length){
            cmds.push(App.NewCommand('do',App.Core.Check.PendingSend.join(';')))
            cmds.push(App.NewCommand('nobusy'))
        }
        App.Commands(cmds).Push()
    }
    App.Core.Check.Start=function(context){
        App.Core.Check.Push(context)
        App.Next()
    }
})(App)