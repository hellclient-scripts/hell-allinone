(function(){
    let Proposals=function(groups,context,excluded_list){
        this.Groups=groups
        this.Context=context||{}
        this.ExcludeList=excluded_list
    }
    return Proposals;
})()