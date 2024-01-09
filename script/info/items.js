(function (app) {
App.Info.Items={}
App.Info.Loaditems=function(data){
    data.forEach(function(line){
        if (line.trim() == "" || line.slice(0, 2) == "//") {
            return
        }
        let i= {}
        var data=line.split("::")
        i.Key=data[0]
        i.Type=data[1]
        i.Gold=data[2]-0
        i.Location=data[3]-0
        i.Data=data[4]
        App.Info.Items[i.Key]=i
    })
}
App.Info.Loaditems(world.ReadLines("data/items.txt"))
})(App)