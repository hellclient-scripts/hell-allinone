(function(){
    let RoomObject=function(){
        this.Label=''
        this.ID=''
        this.Raw=null
    }
    RoomObject.prototype.WithLabel=function(label){
        this.Label=label
        return this
    }
    RoomObject.prototype.WithID=function(id){
        this.ID=id
        return this
    }
    RoomObject.prototype.WithRaw=function(raw){
        this.Raw=raw
        return this;
    }
    return RoomObject;
})()