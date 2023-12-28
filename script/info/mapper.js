(function (app) {
    let ipath = Include("include/path.js")

    let roomsfile = "data/rooms.h"
    
    App.Info.Mapper = {
        Lines: []
    }
    App.Info.Mapper.Load = function () {
        world.Note("加载地图文件 " + roomsfile)
        Mapper.reset()
        this.Lines = world.ReadLines(roomsfile)
        this.Lines.forEach(function (data) {
            if (data) {
                App.Info.Mapper.LoadLine(data)
            }
        })
    }
    let _filterdir = function (dir) {
        var re = /[。·！]/g;
        dir = dir.replace(re, "");
        if (dir.indexOf("、") != -1) {
            dir = dir.split("、");
            dir = dir[dir.length - 1];
        }
        return dir
    }
    let _split2 = function (v, sep) {
        var s = SplitN(v, sep, 2)
        if (s.length < 2) {
            s.push("")
        }
        return s
    }

    let _parsepath = function (fr, str) {
        var tag
        var tags
        var ex
        var etags
        var p = Mapper.newpath()
        var s
        var str
        p.from = fr
        s = _split2(str, "%")
        str = s[0]
        delay = s[1]
        if (delay) {
            p.delay = delay - 0
        }
        s = _split2(str, ":")
        str = s[0]
        var to = s[1]
        if (to) {
            p.to = to
        }
        s = _split2(str, ">")
        tag = s[0]
        str = s[1]
        tags = []
        while (str) {
            tags.push(tag)
            s = _split2(str, ">")
            tag = s[0]
            str = s[1]
        }
        p.tags = tags
        str = tag
        etags = []
        s = _split2(str, "<")
        ex = s[0]
        str = s[1]
        while (str) {
            etags.push(ex)
            s = _split2(str, "<")
            ex = s[0]
            str = s[1]
        }
        p.excludetags = etags
        str = ex
        p.command = str
        if (p.command.indexOf("goto") != -1) {
            p.delay = 10
        }
        if (p.command.indexOf("yell boat") != -1) {
            p.delay = 500
        }
        Mapper.addpath(fr, p)
    }
    let _loadline = function (line) {
        var result = SplitN(line, "=", 2)
        var id = result[0]
        var data = ""
        if (result.length > 1) {
            data = result[1]
        }
        Mapper.clearroom(id)
        result = SplitN(data, "|", 2)
        var name = result[0]
        var v = ""
        if (result.length > 1) {
            v = result[1]
        }
        Mapper.setroomname(id, name)
        var exitlist = SplitN(v, ",", -1)
        exitlist.forEach(function (data) {
            if (data) {
                _parsepath(id, data)
            }
        })
    }
    let _addhouseroom = function (line) {
        world.Note(line)
        App.Info.Mapper.LoadLine(line)
    }
    let _addhouse = function (line) {
        if (line) {
            var data = line.split(" ")
            if (data.length != 3) {
                world.Note("解析房屋信息失败，格式应该为 '包子铺 bzp 1558' ")
                return
            }
            var hosuename = data[0]
            var houesid = data[1]
            var houseloc = data[2]
            _addhouseroom("1933=" + hosuename + "大院|n:1934,out:" + houseloc + ",")
            _addhouseroom("1934=" + hosuename + "前庭|e:1936,push、n:1937,s:1933,w:1935,")
            _addhouseroom("1935=右卫舍|e:1934,")
            _addhouseroom("1936=左卫舍|w:1934,")
            _addhouseroom("1937=走道|n:1938,push、s:1934,")
            _addhouseroom("1938=" + hosuename + "迎客厅|n:1939,s:1937,open door、e:2533,")
            _addhouseroom("1939=议事厅|e:1941,n:1942,s:1938,w:1940,")
            _addhouseroom("1940=" + hosuename + "武厅|e:1939,")
            _addhouseroom("1941=" + hosuename + "武厅|w:1939,")
            _addhouseroom("1942=" + hosuename + "中庭|open west、w:1943,n:1944,s:1939,")
            _addhouseroom("1943=左厢房|e:1942,")
            _addhouseroom("1944=后院|e:-1,n:1947,s:1942,w:1945,")
            _addhouseroom("1945=厨房|e:1944,")
            _addhouseroom("1946=备用|e。:1949,")
            _addhouseroom("1947=后花园|e:1948,s:1944,open door、w、close door:2681,")
            _addhouseroom("1948=竹林|e:1949,w:1947,")
            _addhouseroom("1949=听涛阁|#yanjiu、w:1948,")
            var p = Mapper.newpath()
            world.Note("在位置 " + houseloc + " 添加房屋" + hosuename + "入口[" + houesid + "]")
            p.from = houseloc
            p.to = "1933"
            p.command = houesid
            Mapper.addpath(houseloc, p)
        } else {
            world.Note("变量 house 未设置")
        }
    }
    App.Info.Mapper.LoadLine = function (line) {
        _loadline(line)
    }
    App.Info.Mapper.GetPath=function (fr, tolist,fly) {
        Mapper.flashtags()
        Mapper.settag()
        let idpass = world.GetVariable("id_pass");
        if (idpass){
            let tags=idpass.split(",")
            tags.forEach(function(tag){
                Mapper.settag(tag,true)
            })
        }
        App.Raise("PathInit")
        var data = Mapper.getpath(fr, fly, tolist)
        if (!data) {
            return null
        }
        let path = new ipath()
        let commands = []
        var result = {
            Delay: 0,
            Path: path,
            Command: ""
        }
        data.forEach(function (step) {
            path.PushCommands(step.command.split(";"), step.to - 0)
            result.Delay = result.Delay + (step.delay ? step.delay : 1)
            commands.push(step.command)
        })
        result.Command = commands.join(";")
        return result
    }
    App.API.GetPath=App.Info.Mapper.GetPath
    App.Bind("Ready", "App.Info.Mapper.Load")})(App)