(function(app){
    Metronome.settick(App.GetNumberParam("tick"))
    Metronome.setinterval(App.GetNumberParam("cmdinterval"))
    var _linesre = new RegExp("[^;\n]+", "g");
    var _groupre=new RegExp("[;\n]", "g");
    var _cmdsre = re=/(?:、|·|。)/
    App.Aliases={}
    //注册回调为命令
    App.RegisterAlias=function(name,callback){
        App.Aliases[name]=callback
    }
    //将命令转换为命令组形式
    App.GroupCmds=function(str){
        if (str == "" || str == null){
            return "";
        }
        return str.replace(_groupre, "、")
    }
    App.Core.Send=function (data) {
        if (data) {
            App.Send(data)
        }
    }
    //发送命令
    App.Send=function(str,grouped){
        if (!str){
            return
        }
        if (grouped){
            str=App.GroupCmds(str)
        }
        Metronome.setbeats(App.GetNumberParam("cmdlimit"))
        var echo=App.GetBoolParam("echo")
        //本组命令
        var buf=[]
        //切分命令组
        var groups=str.match(_linesre)
        for (var i=0;i<groups.length;i++){
            var cmds=groups[i].split(_cmdsre)
            for( var j=0;j<cmds.length;j++){
                var cmd=cmds[j]
                if (cmd.length==0){
                    continue
                }
                var prefix=cmd[0]
                //判断是不是命令
                if (prefix=="#"){
                    //命令不能并在分组内
                    if (buf.length){
                        Metronome.push(buf, true, echo)
                        buf=[]
                    }
                    //切分命令，#之后第一个空格之前的为指令，第一个空格后的为数据
                    let directive=new Directive(cmd.substr(1))
                    if (App.Aliases[directive.Command]){
                        App.ExecuteCallback(App.Aliases[directive.Command],directive.Data)
                        continue
                    }
                    //未注册命令，检测是否为#20 xxx格式
                    if(!isNaN(directive)){
                        var times=directive-0
                        if (times>0){
                            for(var t=0;t<times;t++){
                                Metronome.push([data], true, echo)
                            }
                            continue
                        }
                    }
                    world.Note("未知的命令: "+directive.Command)
                    continue
                }
                buf.push(cmd)
            }
            //按组发送缓存
            if (buf.length){
                Metronome.push(buf, true, echo)
                buf=[]
            }
        }
    }

})(App)