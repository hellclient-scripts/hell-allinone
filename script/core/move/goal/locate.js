(function () {
    let Find = Include('core/move/goal/find.js')
    let finder = function (target) {
        if (App.Core.Room.Current.Name) {
            let rids = Mapper.getroomid(App.Core.Room.Current.Name)
            if (rids && rids.length == 1) {
                Note('定位成功:'+rids[0])
                App.Core.Room.Current.WithID(rids[0] - 0)
            }
        }
        return App.Core.Room.Current && App.Core.Room.Current.ID != -1;
    }
    let Locate = function () {
        Find.call(this, '', finder)
    }
    Locate.prototype = Object.create(Find.prototype)
    return Locate
})()