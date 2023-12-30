(function(){
    let Find=Include('core/move/goal/find.js')
    let finder=function(target){
        return App.Core.Room.Current&&App.Core.Room.Current.ID!=-1;
    }
    let Locate=function(){
        Find.call(this,'',finder)
        this.finder=finder
    }
    Locate.prototype = Object.create(Find.prototype)
    return Locate
})()