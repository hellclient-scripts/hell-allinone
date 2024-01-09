(function (App) {

    App.Core.InitCmd = 'set brief;set auto_drinkout;i;hp;score;cha'
    App.Core.Init = function () {
        App.Send(App.Core.InitCmd)
        App.Response("core", "init")
    }
    App.Core.OnInited = function () {
        App.Core.Inited = true
        Note("初始化成功")
        App.RaiseStateEvent("inited")
    }
    App.Bind("Response.core.init", "App.Core.OnInited")

})(App)