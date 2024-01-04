"use strict";
Note('加载Hell-allinone机器人')
var DebugLevel=0

var onOpen=function (){

}

var onClose=function (){

}

var onConnected=function (){

}

var onDisconnected=function (){

}

var onAssist=function(){

}

var onBroadcast=function(msg,global,channel){
    
}
var onResponse=function(type,id,data){
    
}
var onkeyup=function(key){

}
var onBuffer = function (data,bytes) {
    if (data==null){
        if (DebugLevel>0){
            Note("-")
        }
        App.Raise("GA")
        return true
    }
}
var loader = function () {
    this.Loaded = {}
    let cache = {}
    this.reader = world.ReadFile

    this.Include = function (file) {
        if (this.Loaded[file]) {
            return cache[file]
        }
        cache[file] = eval(this.reader(file), file)
        this.Loaded[file] = true
        return cache[file]
    }
}
var Modules = new loader()
var Mod = new loader()
Mod.reader = world.ReadModFile
var Include = function (file) {
    return Modules.Include(file)
}
Include("util.js")
Include("push.js")
Include("app.js")

SetPriority(0)
App.Start()
