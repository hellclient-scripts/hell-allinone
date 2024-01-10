(function(App){
let Action = Include("include/action.js")

App.LoadActions = function (data) {
    let lines = data.split("\n")
    let result = []
    for (var i = 0; i < lines.length; i++) {
        let line = lines[i].trim()
        if (line) {
            let action = new Action(line)
                result.push(action)
        }
    }
    return result
}
})(App)