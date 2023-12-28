var push = {};
push.TPush = {}
push.TPush.Buttons = []
push.TPush.RegisterButton = function (id, label, callback) {
    push.TPush.Buttons.push({
        id: id,
        label: label,
        callback: callback
    })
}
push.TPush.APIServer = 'api.tpns.sh.tencent.com/v3/push/app';
push.TPush.Auth = function (retry, success) {

    if (!world.CheckPermissions(["http"])) {
        world.RequestPermissions(["http"], "申请HTTP权限用发送腾讯推送通知", retry)
        return
    }
    if (!world.CheckTrustedDomains(["api.tpns.sh.tencent.com"])) {
        world.RequestTrustDomains(["api.tpns.sh.tencent.com"], "申请信任腾讯云api", retry)
        return
    }
    if (success != null) {
        success();
    }
}

push.TPush.SendAndroid = function (appid, appkey, token, title, content, server, game) {
    var body = {
        "audience_type": "token",
        "token_list": [token],
        "message_type": "notify",
        "message": {
            "title": title,
            "content": content,
            "android": {
                "vibrate": 1,
                "lights": 1,
                "action": {
                    "action_type": 3,
                    "intent": "hcnotify://hellclient.jarlyyn.com/notify/" + server + "#" + game,
                }
            }
        }
    }
    api = 'https://' + appid + ':' + appkey + "@" + push.TPush.APIServer;
    push.TPush.Req = HTTP.New("POST", api)
    push.TPush.Req.SetBody(JSON.stringify(body))
    Note(JSON.stringify(body));
    Note("正在发送推送")
    push.TPush.Req.AsyncExecute('push.TPush.Callback')
}
push.TPush.Callback = function () {
    let resp = push.TPush.Req.ResponseBody();
    let data = JSON.parse(resp);
    if (data.ret_code == 0) {
        Note('推送成功')
    } else {
        Note(resp)
    }
}
push.TPush.setup = function () {
    push.TPush.Auth('push.TPush.setup()', push.TPush.setupstart)
}
push.TPush.setupstart = function () {
    Userinput.prompt("push.TPush.setupOnAccessID", "请设置AccessID", "请设置腾讯云应用的AccessID,需要在腾讯云申请一个上海区的应用", GetVariable('__plugin_tpush_notify_accessid'))
}
push.TPush.setupOnAccessID = function (name, id, code, data) {
    if (code == 0) {
        world.SetVariable('__plugin_tpush_notify_accessid', data)
        Userinput.prompt("push.TPush.setupOnSecretKey", "请设置AccessKey", "请设置腾讯云应用的SecretKey", GetVariable('__plugin_tpush_notify_secretkey'))
    }
}

push.TPush.setupOnSecretKey = function (name, id, code, data) {
    if (code == 0) {
        world.SetVariable('__plugin_tpush_notify_secretkey', data)
        Userinput.prompt("push.TPush.setupOnToken", "请设置Token", "请设置安卓手机通知设置中获取的token", GetVariable('__plugin_tpush_notify_token'))
    }
}

push.TPush.setupOnToken = function (name, id, code, data) {
    if (code == 0) {
        world.SetVariable('__plugin_tpush_notify_token', data)
        Userinput.prompt("push.TPush.setupOnServer", "请设置服务器", "请设置安卓手机服务器列表中的服务器地址", GetVariable('__plugin_tpush_notify_server'))
    }
}
push.TPush.setupOnServer = function (name, id, code, data) {
    if (code == 0) {
        world.SetVariable('__plugin_tpush_notify_server', data)
        Userinput.alert('', '设置成功', '通知设置成功')
    }
}

push.TPush.push = function (title, content) {
    if (world.GetVariable('__plugin_tpush_notify_enabled') == 't') {
        push.TPush.SendAndroid(world.GetVariable('__plugin_tpush_notify_accessid'), world.GetVariable('__plugin_tpush_notify_secretkey'), world.GetVariable('__plugin_tpush_notify_token'), title, content, world.GetVariable('__plugin_tpush_notify_server'), GetWorldID());
    }
}
push.TPush.pushmail = function (title, content) {
    if (GetVariable("__plugin_desktop_email_enabled") == 't') {
        var server=world.GetVariable('__plugin_tpush_notify_server')
        var game=GetWorldID()
        push.MailNotify(title, content,"http://hellclient.jarlyyn.com/notify/" + server + "#" + game)
    }
}
push.Notify = function (title, content) {
    push.TPush.push(title, content)

    if (GetVariable("__plugin_desktop_notify_disabled") != 't') {
        Request('desktopnotification', JSON.stringify({ Title: title, Body: content }))
    }
    push.TPush.pushmail(title, content)
}

push.channels = function () {
    var list = Userinput.newlist("通知通道设置", "请选择你要开启的通知通道，邮件通知需要在hellclient的settings.toml里设置。", false)
    list.setmutli(true)
    list.append("desktop", "桌面通知")
    list.append("tpush", "腾讯推送")
    list.append("email", "邮件通知")
    let values = []
    if (GetVariable("__plugin_desktop_notify_disabled") != 't') { values.push('desktop') }
    if (GetVariable("__plugin_tpush_notify_enabled") == 't') { values.push('tpush') }
    if (GetVariable("__plugin_desktop_email_enabled") == 't') { values.push('email') }
    list.setvalues(values)
    list.publish("push.onChannels")
}
push.onChannels = function (name, id, code, data) {
    if (code == 0) {
        var list = JSON.parse(data)
        var result = {}
        for (var i = 0; i < list.length; i++) {
            result[list[i]] = true
        }
        SetVariable("__plugin_desktop_notify_disabled", result['desktop'] ? 'f' : 't')
        SetVariable("__plugin_tpush_notify_enabled", result['tpush'] ? 't' : 'f')
        SetVariable("__plugin_desktop_email_enabled", result['email'] ? 't' : 'f')
    }
}
push.show = function () {
    var list = Userinput.newlist("腾讯安卓推送设置", "", false)
    for (var i = 0; i < push.TPush.Buttons.length; i++) {
        list.append(push.TPush.Buttons[i].id, push.TPush.Buttons[i].label);
    }
    list.append('channels', '设置通知通道');
    list.append('test', '测试推送');
    list.append('set', '设置腾讯云推送');
    list.append('export', '导出腾讯云推送信息');
    list.append('import', '导入腾讯云推送信息');
    list.publish("push.onShow")

}

push.onShow = function (name, id, code, data) {
    if (code == 0) {
        for (var i = 0; i < push.TPush.Buttons.length; i++) {
            if (data == push.TPush.Buttons[i].id) {
                push.TPush.Buttons[i].callback();
                return;
            }
        }
        switch (data) {
            case 'channels':
                push.channels();
                break;
            case 'set':
                push.TPush.setup()
                break;
            case 'export':
                Userinput.alert("", "导出当前数据", 'helltpush-' + Base64Encode(JSON.stringify({
                    'enabled': world.GetVariable('__plugin_tpush_notify_enabled'),
                    'accessid': world.GetVariable('__plugin_tpush_notify_accessid'),
                    'secretkey': world.GetVariable('__plugin_tpush_notify_secretkey'),
                    'token': world.GetVariable('__plugin_tpush_notify_token'),
                    'server': world.GetVariable('__plugin_tpush_notify_server'),
                })));
                break;
            case 'import':
                push.goImport();
                break;
            case 'test':
                push.Notify('推送确认', '请确认推送是否成功送达')
                break
        }
    }
}
push.goImport = function () {
    push.TPush.Auth('push.goImport()', push.showImport)

}
push.onImport = function (name, id, code, data) {
    if (code == 0) {
        if (data.startsWith('helltpush-')) {
            data = data.slice('helltpush-'.length)
            let decoded = Base64Decode(data)
            if (decoded) {
                let datamap = JSON.parse(decoded)
                if (datamap) {
                    world.SetVariable('__plugin_tpush_notify_enabled', datamap.enabled);
                    world.SetVariable('__plugin_tpush_notify_accessid', datamap.accessid);
                    world.SetVariable('__plugin_tpush_notify_secretkey', datamap.secretkey);
                    world.SetVariable('__plugin_tpush_notify_token', datamap.token);
                    world.SetVariable('__plugin_tpush_notify_server', datamap.server);
                    Userinput.alert("", "导入成功", '输入导入成功,AccessID为' + datamap.accessid);
                    return
                }
            }
        }
        Userinput.alert("", "导入失败", '导入失败，请检查数据是否正确');
    }
}
push.showImport = function () {
    Userinput.prompt("push.onImport", "导入推送数据", "请导入helltpush-开头的推送数据", '')

}
push.MailNotify = Notify;
Notify = push.Notify;