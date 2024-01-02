(function (App) {
    let RoomObject = Include("include/roomobject.js")
    let Room = Include("include/room.js")
    App.Core.Room={}
    App.Core.Room.Current=new Room();
    App.Core.Room.Dump=function(){
        Note(App.Core.Room.Current.ToString());
    }
    App.Core.Room.LinesAfterName=[]
    App.Core.Room.WaitingGA=false
    App.Core.Room.NameLine=null;
    App.Core.Room.Online=function(line){
        if (App.Core.Room.WaitingGA){
            return
        }
        if (line.Plain.length<10){
            if (line.Raw.Words.length==1&&line.Raw.Words[0].Color=='Cyan'&&line.Raw.Words[0].Background==''){
                App.Core.Room.NameLine=line
                App.Core.Room.LinesAfterName=[]
                return
            }
        }
        if (App.Core.Room.NameLine){
            App.Core.Room.LinesAfterName.push(line)
        }
    }
    App.Bind('line','App.Core.Room.Online')
    App.Core.Room.PropressExits=function(exits){
        if (App.Core.Room.NameLine==null){
            return
        }
        App.Core.Room.WaitingGA=true;
        App.Core.Room.Current=new Room()
        App.Core.Room.Current.
            WithName(App.Core.Room.NameLine.Plain).
            WithExits(exits.sort()).
            WithNameRaw(App.Core.Room.NameLine.Raw).
            WithDesc(App.Core.Room.LinesAfterName.slice(0,-1))
    }
    var reExit = new RegExp("[a-z]*[^、 和。]", "g");
    //^    这里(唯一的出口是|明显的出口是|没有任何明显的出路)(.*)
    App.Core.Room.OnExits=function(name, output, wildcards){
        App.Core.Room.PropressExits(wildcards[1].match(reExit))
    }
    App.Core.Room.OnGA=function(){
        if (App.Core.Room.WaitingGA){
            App.Core.Room.WaitingGA=false
            App.Raise('core.room.onRoomEnd')
            App.RaiseStateEvent('core.room.onRoomEnd')
        }
    }
    App.Bind('GA','App.Core.Room.OnGA')
    //^    ([^()]+)\(([a-zA-Z ]+)\)((\s*<.+>)*(\s*\[.+\])*)$
    App.Core.Room.OnObj=function(name, output, wildcards){
        if (App.Core.Room.WaitingGA){
            obj=new RoomObject().WithID(wildcards[1]).WithLabel(wildcards[0]).WithRaw(App.CurrentLine.Raw)
            App.Core.Room.Current.MergeObject(obj)
        }
    }
    //Debug时用于打印当前房间内容
    App.DumpRoom=App.Core.Room.Dump
})(App)