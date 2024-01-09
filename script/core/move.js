(function (App) {
    let Move=Include('core/move/move.js')
    let PathNavigator=Include('core/move/navigator/pathnavigator.js')
    let DfsNavigator=Include('core/move/navigator/dfsnavigator.js')
    let Walk=Include('core/move/goal/walk.js')
    let Locate=Include('core/move/goal/locate.js')
    let Path=Include('include/path.js')
    let MoveOption=Include('include/option/move.js')
    App.Core.Move={}
    App.Core.Move.ParsePath=function(path){
        return new Path(path.split(';'));
    }
    App.Core.Move.NewWalk=function(path,to){
        let move=new Move(new PathNavigator(path),new Walk(to))
        return move
    }
    App.Core.Move.NewLocate=function(){
        let move=new Move(new DfsNavigator(10),new Locate)
        return move
    }
    App.Core.Move.NewMove=function(targets,fly){
        return new MoveOption(targets,fly)
    }
    App.Core.Move.Move=function(moveoption){
        let cmds=[]
        if (App.Core.Room.Current.ID<0){
            cmds.push(App.NewCommand('locate'))
        }
        cmds.push(App.NewCommand('function',function(){
            if (App.Core.Room.Current.ID<0){
                Note('定位失败')
                App.Fail()
                return
            }
            let path=App.API.GetPath(App.Core.Room.Current.ID,moveoption.Targets,moveoption.Fly)
            if (path==null){
                Note('失败：无法获取 '+App.Core.Room.Current.ID+' 到 '+targets.join(',')+' 的路径。')
                App.Fail()
                return;
            }
            App.Core.Move.NewWalk(path.Path).Start()
        }))
        App.Commands(cmds).Push()
        App.Next()
    }
    App.Core.Move.OnArrive=function(cmd){
        let move = App.GetContext("Move")
        if (!move) {
            return
        }
        if (cmd&&cmd.Target!==null&&cmd.Target!==''){
            App.Core.Room.Current.ID=cmd.Target-0
        }
        if (App.Core.Room.Current.ID != -1) {
            Note("move: " + App.Core.Room.Current.ID + "")
        } else {
            Note("move:失去位置")
        }

    }
    App.Bind('core.move.arrive','App.Core.Move.OnArrive')


    App.Core.Move.OnGoto=function (name, line, wildcards) {
        App.Core.Move.Move(App.Core.Move.NewMove(wildcards[0].split(','),true))
    }

    App.RegisterState(new (Include("state/move/move.js"))())
    App.RegisterState(new (Include("state/move/step.js"))())

    App.RegisterState(new (Include("state/command/move.js"))())

})(App)