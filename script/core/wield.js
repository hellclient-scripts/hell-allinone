(function(App){
    App.Core.Wield={}
    App.Core.Wield.Settings={
        Wield:[],
        AutoUnwield:[],
        Unwield:[],
    }
    App.Core.Wield.InitSettings=function(){
        App.Core.Wield.Settings={
            Wield:[],
            AutoUnwield:[],
            Unwield:[],
        }
    }
    App.Core.Wield.Load = function () {
        let actions = App.LoadActions(GetVariable('wield'))
        App.Core.Wield.InitSettings()
        for(var i=0;i<actions.length;i++){
            let action=actions[i]
            switch(action.Command){
                case 'unwield':
                    App.Core.Wield.Settings.Unwield.push(action.Data)
                    break
                case '':
                    App.Core.Wield.Settings.Wield.push(action.Data)
                    var data=action.Data.split(" ")
                    if (data.length>1){
                        if (data[0]=='wield'){
                            data[0]='unwield'
                            App.Core.Wield.Settings.AutoUnwield.push(data.join(' '))
                        }else if(data[0]=='wear'){
                            data[0]='remove'
                            App.Core.Wield.Settings.AutoUnwield.push(data.join(' '))
                        }
                    }else{
                        if(data[0].endsWith('on')){
                            App.Core.Wield.Settings.AutoUnwield.push(data[0].slice(0,-2)+'off')
                        }
                    }
                    break
            }
        }
    }
    App.Core.Wield.WeaponOn=function(){
        App.Core.Wield.Load()
        App.Send(App.Core.Wield.Settings.Wield.join(';'))
    }
    App.Core.Wield.WeaponOff=function(){
        App.Core.Wield.Load()
        if (App.Core.Wield.Settings.Unwield.length){
            App.Send(App.Core.Wield.Settings.Unwield.join(';'))
        }else{
            App.Send(App.Core.Wield.Settings.AutoUnwield.join(';'))
        }
    }
})(App)