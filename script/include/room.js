(function(){
    let Room=function(){
        this.Name=''
        this.NameRaw=null
        this.ID=-1
        this.Exits=[]
        this.Desc=[]
        this.Objects=[]
    }
    Room.prototype.WithName=function(name){
        this.Name=name
        return this
    }
    Room.prototype.WithNameRaw=function(nameraw){
        this.NameRaw=nameraw
        return this
    }
    Room.prototype.WithID=function(id){
        this.ID=id
        return this
    }
    Room.prototype.WithExits=function(exits){
        this.Exits=exits
        return this
    }
    Room.prototype.WithDesc=function(desc){
        this.Desc=desc
        return this
    }
    Room.prototype.MergeObject=function(obj){
        this.Objects.push(obj)
        return
    }
    Room.prototype.ToString=function(){
        let output=''
        output+=this.Name+'\n'
        output+=this.ID+'\n'
        output+=this.Exits.join(',')+'\n'
        for(var i=0;i<this.Objects.length;i++){
            output+=this.Objects[i].Label+"("+this.Objects[i].ID+")\n"
        }
        return output
    }
    return Room
})()