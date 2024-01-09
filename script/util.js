var SubDumpLine=function(start,end){
    return SubDump(JSON.parse(DumpOutput(1))[0],start,end)
}
var SubDump=function(dump,start,end){
    return JSON.stringify(SplitDump(dump).slice(start,end))
}
var SplitDump=function(dump){
    let result=[]
    let words=dump.Words
    for (var i=0;i<words.length;i++){
        let word=words[i]
        for (var charindex=0;charindex<word.Text.length;charindex++){
            result.push(
                {
                    "Text":word.Text[charindex],
                    "Color": word.Color,
                    "Background": word.Background,
                    "Bold": word.Bold,
                    "Underlined": word.Underlined,
                    "Blinking": word.Blinking,
                    "Inverse": word.Inverse,
                  }
              )
        }
    }
    return result
}
var RandomInt=function(max){
    if (max<1){
        throw "random error"
    }
    return Math.floor(Math.random()*max)
}
var RandomList=function(list){
    let index=RandomInt(list.length)
    return list[index]
}
var RandomKey=function(map){
   return RandomList(Object.keys(map))
}
var RandomSort=function(list){
    let result=[]
    while(list.length>0){
        result.push(list.splice(RandomInt(list.length),1))
    }
    return result
}
var Now=function(){
    return (new Date()).getTime()
}
var After=function(time,duration){
    if (!time){
        return true
    }
    if (duration){
        time=time+duration
    }
    return Now()>time
}
var Before=function(time,duration){
    if (!time){
        return false
    }
    if (duration){
        time=time+duration
    }
    return Now()<time
}
var CNumber={
    re:new RegExp("(((零|一|二|三|四|五|六|七|八|九|十|百|千|万)*)(支|顶|块|朵|面|匹|位|支|颗|个|把|只|粒|壶|张|枚|件|柄|根|块|文|两|碗|滴|岁|条|包|片)){0,1}(.*)"),
    list:"零一二三四五六七八九",
    Convert:function(str){
        var result=0
        var target=str.split("")
        var wan=1
        var unit=1
        while (target.length>0){
            var char=target.splice(-1)
            if (char=="十"){
                    unit=10*wan
                    if (target.length==0){
                        result+=unit
                    }else if(CNumber.list.indexOf(target[target.length-1])<0){
                        result+=unit
                    }
            }else if (char=="百"){
                    unit=100*wan
            }else if (char=="千"){
                    unit=1000*wan
            }else if (char=="万"){
                    unit=1000*wan
                    wan=10000
            }else{
                    var val=CNumber.list.indexOf(char)
                    result+=val*unit
            }
        }
        return result
    },
    Split:function(str){
        var result=str.match(CNumber.re)
        var count=result[2]?result[2]:"一"
        var unit=result[4]?result[4]:""
        var item=result[5]
        return{
            Count:CNumber.Convert(count),
            Unit:unit,
            Item:item
        }
    }
}

var Directive
(function(){
    let re=/^(\S*)( (.*)){0,1}$/
    Directive=function(str){
        let result=str.match(re)
        if (result==null){
            this.Command=str
            this.Data=""
            return
        }
        this.Command=result[1]||""
        this.Data=result[3]||""
    }
})()

var Pipe
(function(){
    let re=/^([^|]*)(\|(.*)){0,1}$/
    Pipe=function(str){
        let result=str.match(re)
        if (result==null){
            this.Command=str
            this.Next=""
            return
        }
        this.Command=result[1]||""
        this.Next=result[3]||""
    }
})()

var CloneArray=function (data,skipempty) {
    let result=[]
    for(let i=0;i<data.length;i++){
        if (!skipempty || data[i]){
            result.push(data[i])
        }
    }
    return result
}

var Recorder=function(){
    Recorder=function(){
        this.output="[]"
    }
    Recorder.prototype.Catch=function(length,offset){
        this.output=DumpOutput(length,offset)
        this.Preview()
    }
    Recorder.prototype.Preview=function(){
        Note("预览：")
        Note(OutputToText(this.output))
    }
    Recorder.prototype.Replay=function(){
        let output=ConcatOutput(PrintOutput("==== 开始模拟输出 ===="),this.output)
        output=ConcatOutput(output,PrintOutput("==== 结束模拟输出 ===="))
        SimulateOutput(output)
    }

    Recorder.prototype.Save=function(name){
        MakeHomeFolder("dumps")
        WriteHomeFile("dumps/"+name+".json",this.output)
        Note("保存成功："+"dumps/"+name+".json")
    }
    Recorder.prototype.Load=function(name){
        let output=ReadHomeFile("dumps/"+name+".json")
        Note("加载成功："+"dumps/"+name+".json")
        this.output=output
    }

    Recorder.prototype.Play=function(name){
        this.Load(name)
        this.Replay()
    }
    return new Recorder()
}()

var FormatNumber=function(data){
    let result=""
    if (data<0){
        result="-"
        data=-data
    }
    if (data>1000000000){
        result+=(data/1000000000).toFixed(2)+"B"
    }else if (data>1000000){
        result+=(data/1000000).toFixed(2)+"M"
    }else if (data>1000){
        result+=(data/1000).toFixed(2)+"K"
    }else{
        result+=data.toFixed(2)
    }
    return result
}

var ToNumber=function(data,defaultvalue){
    let num=data-0
    return isNaN(num)?defaultvalue:num
}