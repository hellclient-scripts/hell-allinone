(function(App){
    App.Core.Cooldown={}
    App.Core.Cooldown.Last={}
    App.Core.Cooldown.Update=function(id){
        App.Core.Cooldown.Last[id]=Now()
    }
    App.Core.Cooldown.Reset=function(id){
        delete(App.Core.Cooldown.Last[id])
    }
    App.Core.Cooldown.Ready=function(id,duration){
        let last=App.Core.Cooldown.Last[id];
        if (last){
            return After(last,duration);
        }
        return true
    }
})(App)