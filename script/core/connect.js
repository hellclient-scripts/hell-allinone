(function(App){
    App.Core.Connect={}
    App.Core.Connect.Login=function(){
        let id=world.GetVariable("id").trim()
        if (id){
            Send(id)
        }
        let password=world.GetVariable("password")
        if (password){
            Note("******(输入密码)")
            SendNoEcho(password)
        }
    
    }
    App.Core.Connect.OnAliasLogin=function (name, line, wildcards) {
        App.Core.Connect.Login()
    }
})(App)