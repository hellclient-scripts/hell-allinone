(function(){
    let Condition=function(line){
        this.Type=""
        this.Data=""
        this.Exclude=false
        if (line[0]=="!"){
            this.Exclude=true
            line=line.slice(1)
        }
        let data=SplitN(line," ",2)
        this.Type=data[0]
        this.Data=data.length>1?data[1]:""
    }
    return Condition
})()