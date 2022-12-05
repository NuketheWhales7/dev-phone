ESX = nil

PhoneData = {
    CanOpen = true,
    phone_number = 0,
    IsOpen = false,
    InCall = false,
    silence = false,
    CurrentMessageNumber = 0,
    contacts = {},
    Animationanim = nil,
    Animationlib = nil,
    AnsweredCall = false,
    CallId = 0,
}

Citizen.CreateThread(function()
    while ESX == nil do
        Config.GetSharedObject(function(obj) ESX = obj end)
        Citizen.Wait(0)
    end
end)

function firstToUpper(str)
    return (str:gsub("^%l", string.upper))
end

RegisterNetEvent('ld-phone:client:Notify')
AddEventHandler('ld-phone:client:Notify', function(message, app, sender)
    fuck = exports["dev-pillboxjob"]:GetDeath()
    cuffers = exports["dev-policejob"]:GetHandcuff()
    if not fuck and not cuffers then
        if exports["dev-inventory"]:hasEnoughOfItem('mobilephone', 1, false) or exports["dev-inventory"]:hasEnoughOfItem('assphone', 1, false) or exports["dev-inventory"]:hasEnoughOfItem('boomerphone', 1, false) then
            SendNUIMessage({
                type = "notification",
                title = firstToUpper(app),
                message = message,
                svg = Config.Icons[app],
                sender = sender,
            })
        end
    end
end)

RegisterNetEvent('ld-phone:client:NotifyPicture')
AddEventHandler('ld-phone:client:NotifyPicture', function(message, app, sender, attachment)
    fuck = exports["dev-pillboxjob"]:GetDeath()
    cuffers = exports["dev-policejob"]:GetHandcuff()
    if not fuck and not cuffers then
        if exports["dev-inventory"]:hasEnoughOfItem('mobilephone', 1, false) or exports["dev-inventory"]:hasEnoughOfItem('assphone', 1, false) or exports["dev-inventory"]:hasEnoughOfItem('boomerphone', 1, false) then
            SendNUIMessage({
                type = "notification",
                title = firstToUpper(app),
                message = message,
                svg = Config.Icons[app],
                sender = sender,
                attachment = attachment,
            })
        end
    end
end)

LockKeyboard = false

RegisterNUICallback("LockKeyboard", function()
    LockKeyboard = true
    SetNuiFocusKeepInput(false)
end)

RegisterNUICallback("ReleaseKeyboard", function()
    LockKeyboard = false
    SetNuiFocusKeepInput(true)
end)

RegisterNUICallback('GetDetails', function(data, cb)
    ESX.TriggerServerCallback('ld-phone:GetPlayerDetails', function(details)
        PhoneData.phone_number = details.phonenumber
        cb(details)
    end)
end)


RegisterNetEvent("ld-phone:client:UpdateTweets")
AddEventHandler("ld-phone:client:UpdateTweets", function(message, sender, attachment)
    SendNUIMessage({type = "updateTweets"})
    if attachment then
        TriggerEvent('ld-phone:client:NotifyPicture', message, "twitter", sender, attachment)
    else
        TriggerEvent('ld-phone:client:Notify', message, "twitter", sender)
    end
end)

exports('ChangeCoque', function(coque)
    SendNUIMessage({
        type = "changeCoque",
        coque = coque
    })
end)

exports('DisablePhone', function()
    PhoneData.CanOpen = false
end)

exports('EnablePhone', function()
    PhoneData.CanOpen = true
end)



RegisterNetEvent("ld-phone:client:UpdateBankLogs")
AddEventHandler("ld-phone:client:UpdateBankLogs", function(name, amount)
    TriggerEvent('ld-phone:client:Notify', "You get $" .. amount .. " from " .. name, "wenmo", name)
end)

RegisterNetEvent("ld-phone:client:UpdateAdverts")
AddEventHandler("ld-phone:client:UpdateAdverts", function(message, sender)
    SendNUIMessage({type = "updateAdverts"})
    TriggerEvent('ld-phone:client:Notify', message, "yellowpages", sender)
end)


RegisterNUICallback('GetEmployees', function(data, cb)
    ESX.TriggerServerCallback('ld-phone:GetEmployees', function(details) 
        cb(details)
    end, data.job)
end)

RegisterNUICallback('GetEmployeeInfo', function(data, cb)
    local job = exports["isPed"]:isPed("myJob")
    ESX.TriggerServerCallback('ld-phone:GetEmployeesInfo', function(details) 
        cb(details)
    end, job)
end)

RegisterNUICallback('GetEvents', function(data, cb)
    ESX.TriggerServerCallback('ld-phone:GetEvents', function(details) 
        cb(details)
    end)
end)

RegisterNUICallback('GetCases', function(data, cb)
    ESX.TriggerServerCallback('ld-phone:GetCases', function(details) 
        cb(details)
    end)
end)


RegisterNUICallback('CreateCase', function(data, cb)
    local job = exports["isPed"]:isPed("myJob")
    if job == 'judge' then
        ESX.TriggerServerCallback('ld-phone:CreateCase', function(details) 
            local details = {text = "Case Created Succesfully."}
            cb(details)
        end,data)
    else
        local details = {text = "You are not a judge."}
         cb(details)
    end
end)

RegisterNUICallback('GetTweets', function(data, cb)
    ESX.TriggerServerCallback('ld-phone:GetTweets', function(details) 
        cb(details)
    end)
end)

RegisterNUICallback('GetAdverts', function(data, cb)
    ESX.TriggerServerCallback('ld-phone:GetAdverts', function(details) 
        cb(details)
    end)
end)

TokoVoipID = 0

RegisterNetEvent('ld-phone:client:pmavoice')
AddEventHandler('ld-phone:client:pmavoice', function(callid)
    TokoVoipID = callid
    PhoneData.Incall = true
    exports["dev-voip"]:SetCallChannel(TokoVoipID)  
    -- if Config.VoiceChatSettings.ScriptName ~= "saltychat" then
    --     Config.VoiceChatSettings.AddPlayer(callid)
    -- end
end)


RegisterNUICallback('EndCall', function(data, cb)
    PhoneData.AnsweredCall = "ignored"
    ESX.TriggerServerCallback('ld-phone:EndCall', function(details)
        cb(details)
    end)
    PhoneData.Incall = false
    exports["dev-voip"]:SetCallChannel(0)   
--    exports.tokovoip_script:removePlayerFromRadio(TokoVoipID)
    TokoVoipID = nil
    -- if Config.VoiceChatSettings.ScriptName ~= "saltychat" then 
    --     Config.VoiceChatSettings.RemovePlayer(PhoneData.CallId)
    -- end
end)

RegisterNUICallback('GetContacts', function(data, cb)
    ESX.TriggerServerCallback('ld-phone:GetPlayerContacts', function(details)
        PhoneData.contacts = details
        cb(details)
    end)
end)

RegisterNUICallback('GetRecentCalls', function(data, cb)
    ESX.TriggerServerCallback('ld-phone:GetRecentCalls', function(details)
        cb(details)
    end)
end)


RegisterNUICallback('GetCameras', function(data, cb)
    ESX.TriggerServerCallback('ld-phone:GetCameras', function(details) 
        cb(details)
    end, GetPlayerServerId(PlayerId()))
end)

RegisterNUICallback('OpenCamera', function(data, cb)
    TriggerServerEvent('server:get-data', GetPlayerServerId(PlayerId()), data.name)
end)

exports('IsOpen', function()
    return PhoneData.IsOpen
end)

exports('IsInCall', function()
    return PhoneData.InCall
end)

exports('GetPhoneNumber', function()
    return PhoneData.phone_number
end)

exports('Call', function(number)
    if PhoneData.AnsweredCall == "ignored" then PhoneData.AnsweredCall = false end;
    PhoneData.CallId = GenerateCallId(GetPlayerServerId(PlayerId()))
    ESX.TriggerServerCallback('ld-phone:CallContact', function(state) 
        cb(state)
        if state then
            DoPhoneAnimation('cellphone_text_to_call')
            RepeatCount = 0
            for i = 1, Config.CallRepeats + 1, 1 do
            if PhoneData.Incall then break end;
            if PhoneData.AnsweredCall == "ignored" then break end;
                if RepeatCount ~= Config.CallRepeats then
                    RepeatCount = RepeatCount + 1
                    if not PhoneData.silence and not PhoneData.Incall then
                        TriggerServerEvent("InteractSound_SV:PlayWithinDistance", 5, "ring2", 0.2)
                    end
                else
                    RepeatCount = 0
                end
                Wait(3000)
            end
        end
    end, data.number, PhoneData.CallId)
end)




local function GenerateCallId(caller)
    local CallId = math.ceil(((tonumber(caller) + tonumber(math.random(1,1000))) / 10 * math.random(1,5))) .. math.random(1,1000)
    return CallId
end

exports('Notify', function(title, message, sender, app)
    TriggerEvent('ld-phone:client:Notify', message, app, sender)
end)

RegisterNUICallback('AcceptCall', function(data, cb)
    ESX.TriggerServerCallback('ld-phone:AcceptCall', function(state)
        PhoneData.AnsweredCall = true
        if state then 
            DoPhoneAnimation('cellphone_text_to_call')
        end
        cb(state)
    end, data.number, PhoneData.CallId)
end)

RegisterNUICallback('RemoveContact', function(data, cb)
    ESX.TriggerServerCallback('ld-phone:RemoveContact', function(state)
        cb(state)
    end, data.number)
end)

RegisterNUICallback('RemoveCall', function(data, cb)
    ESX.TriggerServerCallback('ld-phone:RemoveCall', function(state)
        cb(state)
    end, data.number)
end)

RegisterNUICallback('ClearEmails', function(data, cb)
    ESX.TriggerServerCallback('ld-phone:ClearEmails', function(state)
        cb(state)
    end)
end)

RegisterNUICallback('UpgradeHouse', function(data, cb)
    Config.UpdateHouseTrigger(data.level, function(state)
        cb(state)
    end)
end)

RegisterNUICallback('GetHouseList', function(data, cb)
    local cid = exports["isPed"]:isPed("cid")
    ESX.TriggerServerCallback('ld-phone:GetHouseList', function(state)
        cb(state)
    end,cid)
end)

RegisterNUICallback('GetTinderProfileList', function(data, cb)
    local cid = exports["isPed"]:isPed("cid")
    ESX.TriggerServerCallback('dev-phone:GetTinderProfileList', function(state)
        cb(state)
    end,cid)
end)

RegisterNUICallback('GetTinderMatchList', function(data, cb)
    local cid = exports["isPed"]:isPed("cid")
    local state = false
    -- ESX.TriggerServerCallback('ld-phone:GetMatchList', function(state)
        cb(state)
    -- end,cid)
end)

RegisterNUICallback('CallContact', function(data, cb)
    if PhoneData.AnsweredCall == "ignored" then PhoneData.AnsweredCall = false end;
    PhoneData.CallId = GenerateCallId(GetPlayerServerId(PlayerId()))
    ESX.TriggerServerCallback('ld-phone:CallContact', function(state) 
        cb(state)
        if state then
            DoPhoneAnimation('cellphone_text_to_call')
            RepeatCount = 0
            for i = 1, Config.CallRepeats + 1, 1 do
            if PhoneData.Incall then break end;
            if PhoneData.AnsweredCall == "ignored" then break end;
                if RepeatCount ~= Config.CallRepeats then
                    RepeatCount = RepeatCount + 1
                    if not PhoneData.silence and not PhoneData.Incall then
                        TriggerServerEvent("InteractSound_SV:PlayWithinDistance", 5, "ring2", 0.2)
                    end
                else
                    RepeatCount = 0
                end
                Wait(3000)
            end
        end
    end, data.number, PhoneData.CallId)
end)


RegisterNUICallback('CallEmployee', function(data, cb)
    if PhoneData.AnsweredCall == "ignored" then PhoneData.AnsweredCall = false end;
    PhoneData.CallId = GenerateCallId(GetPlayerServerId(PlayerId()))
    ESX.TriggerServerCallback('ld-phone:CallContact', function(state) 
        cb(state)
        if state then 
            DoPhoneAnimation('cellphone_text_to_call')
            RepeatCount = 0
            for i = 1, Config.CallRepeats + 1, 1 do
            if PhoneData.Incall then break end;
            if PhoneData.AnsweredCall == "ignored" then break end;
                if RepeatCount ~= Config.CallRepeats then
                    RepeatCount = RepeatCount + 1
                    if not PhoneData.silence and not PhoneData.Incall then
                        TriggerServerEvent("InteractSound_SV:PlayWithinDistance", 5, "ring2", 0.2)
                    end
                else
                    RepeatCount = 0
                end
                Wait(3000)
            end
        end
    end, data.number, PhoneData.CallId)
end)

RegisterNUICallback('GetDebts', function(data,cb)
    ESX.TriggerServerCallback('ld-phone:GetDebts', function(details)
        cb(details)
    end)
end)

RegisterNetEvent('ld-phone:client:GetPing')
AddEventHandler('ld-phone:client:GetPing', function(pos, name)
    if pos ~= nil or name ~= nil then
        local blip = AddBlipForCoord(pos.x, pos.y, pos.z)
        SetBlipSprite(blip, 280)
        SetBlipColour(blip, 0)
        SetBlipAsShortRange(blip, true)
        SetBlipDisplay(blip, 4)
        SetBlipShowCone(blip, true)
        BeginTextCommandSetBlipName("STRING")
        AddTextComponentString('Ping [~g~' .. name .. '~s~]')
        EndTextCommandSetBlipName(blip)
        Citizen.Wait(Config.PingTime * 1000)
        RemoveBlip(blip)
    end
end)

RegisterNUICallback('SendPing', function(data, cb)
    local playerPos = GetEntityCoords(PlayerPedId()) 
    ESX.TriggerServerCallback('ld-phone:SendPing', function(state)
        cb(state)
    end, data.id, playerPos, data.anon)
end)

RegisterNUICallback('GetPlayerMails', function(data,cb)
    ESX.TriggerServerCallback('ld-phone:GetPlayerMails', function(details)
        cb(details)
    end)
end)

RegisterNUICallback('GetBankLogs', function(data,cb)
    ESX.TriggerServerCallback('ld-phone:GetBankLogs', function(details)
        cb(details)
    end)
end)

RegisterNUICallback('ToggleSound', function(data,cb)
    PhoneData.silence = not PhoneData.silence
end)

RegisterNetEvent('ld-phone:client:IncomingCall')
AddEventHandler('ld-phone:client:IncomingCall', function(number, callid)
    fuck = exports["dev-pillboxjob"]:GetDeath()
    cuffers = exports["dev-policejob"]:GetHandcuff()
    if not fuck and not cuffers then
        if exports["dev-inventory"]:hasEnoughOfItem('mobilephone', 1, false) or exports["dev-inventory"]:hasEnoughOfItem('assphone', 1, false) or exports["dev-inventory"]:hasEnoughOfItem('boomerphone', 1, false) then
            PhoneData.CallId = callid
            if PhoneData.AnsweredCall == "ignored" then
                PhoneData.AnsweredCall = false
            end
            local name = nil
            local ped = PlayerPedId()
            local playerPos = GetEntityCoords(ped)
            for k, v in pairs(PhoneData.contacts) do
                if tonumber(v.number) == tonumber(number) then
                    name = v.name
                    break
                end
            end
            SendNUIMessage({
                type = "incomingcall",
                number = number,
                name = name
            })
            RepeatCount = 0
            for i = 1, Config.CallRepeats + 1, 1 do
                if RepeatCount ~= Config.CallRepeats then
                    if PhoneData.AnsweredCall == false then
                        RepeatCount = RepeatCount + 1
                        if not PhoneData.silence then
                            Config.PhoneCallSound()
                        end
                    elseif PhoneData.AnsweredCall == "ignored" then
                        SendNUIMessage({
                            type = "addignored",
                            number = name == nil and number or name,
                        })
                        TriggerServerEvent('ld-phone:server:addRecentCall', GetPlayerServerId(PlayerId()), number, 1, 0)
                        break
                    end
                    Wait(3000)
                else
                    RepeatCount = 0
                end
            end
        end
    end
end)

RegisterNetEvent('ld-phone:client:AcceptCall')
AddEventHandler('ld-phone:client:AcceptCall', function(number)
    for k, v in pairs(PhoneData.contacts) do
        if tonumber(v.number) == tonumber(number) then
            name = v.name
            break
        end
    end
    SendNUIMessage({
        type = "incall",
        number = number,
        name = name
    })
    -- if Config.VoiceChatSettings.ScriptName ~= "saltychat" then 
    --     Config.VoiceChatSettings.AddPlayer(PhoneData.CallId)
    -- end
    PhoneData.Incall = true
    exports["dev-voip"]:SetCallChannel(PhoneData.CallId)
end)

RegisterCommand('phonefix', function(source, args, raw)
    ClosePhone()
    TriggerEvent('ld-phone:client:RemoveCall')
end)

TriggerEvent('chat:addSuggestion', '/p#', 'Sends phone number to nearest Person.')

RegisterCommand('p#', function(source, args, raw)
local player, distance = ESX.Game.GetClosestPlayer()
    if distance ~= -1 and distance <= 3.0 then
        if PhoneData.phone_number == 0 then
            exports['mythic_notify']:DoHudText('error', 'Take your phone out with P')
        else
        TriggerServerEvent('Server:PhonePost', GetPlayerServerId(player), PhoneData.phone_number)
        end
    else
        exports['mythic_notify']:DoHudText('error', 'no one is nearby')
    end
end)

RegisterNetEvent('ld-phone:client:RemoveCall')
AddEventHandler('ld-phone:client:RemoveCall', function()
    PhoneData.Incall = false
    SendNUIMessage({
        type = "endcall",
    })
    -- if Config.VoiceChatSettings.ScriptName ~= "saltychat" then 
    --     Config.VoiceChatSettings.RemovePlayer(PhoneData.CallId)
    -- end
    exports["dev-voip"]:SetCallChannel(0)
end)

RegisterNetEvent('ld-phone:client:RemoveIncomingCall')
AddEventHandler('ld-phone:client:RemoveIncomingCall', function(number)
    PhoneData.Incall = false
    SendNUIMessage({
        type = "removeincoming",
    })
    for k, v in pairs(PhoneData.contacts) do
        if tonumber(v.number) == tonumber(number) then
            name = v.name
            break
        end
    end
    PhoneData.AnsweredCall = "ignored"
    exports["dev-voip"]:SetCallChannel(0)
    TriggerServerEvent('ld-phone:server:addRecentCall', GetPlayerServerId(PlayerId()), number, 1, 0)
end)

RegisterNUICallback('SendTweet', function(data, cb)
    local tweet = data.message
    local check2 = tweet:lower()    
    if check2:find('nigger') or check2:find('niggers') or check2:find('niger') or check2:find('n1g3r') or check2:find('n1gg3r') or check2:find('nig3r')  or check2:find('n1ger') or check2:find('nigg3r') or check2:find('faggot') or check2:find('beaner') then
            carNames = "Racism"
            TriggerServerEvent('AntiCheat:racist',tweet)
            return
    end
    if check2:find('nigga') or check2:find('niggas') then
            carNames = "Typing Nigga"
            TriggerServerEvent('AntiCheat:racist2',carNames )
            return
    end

    ESX.TriggerServerCallback('ld-phone:SendTweet', function(details) 
        cb(details)
    end, data.message, data.attachment, data.VPN)
end)

RegisterNUICallback('SendAdvert', function(data, cb)
    local result = data.detail
    local check2 = result:lower()    
    if check2:find('nigger') or check2:find('niggers') or check2:find('niger') or check2:find('n1g3r') or check2:find('n1gg3r') or check2:find('nig3r') or check2:find('nigg3r') or check2:find('faggot') or check2:find('beaner') then
            carNames = "Racism"
            TriggerServerEvent('AntiCheat:racist',result)
            return
    end
    if check2:find('nigga') or check2:find('niggas') then
            carNames = "Typing Nigga"
            TriggerServerEvent('AntiCheat:racist2',carNames )
            return
    end
    ESX.TriggerServerCallback('ld-phone:SendAdvert', function(details) 
        cb(details)
    end, data.name, data.detail)
end)

RegisterNUICallback('AddContact', function(data, cb)
    ESX.TriggerServerCallback('ld-phone:AddContact', function(status)
        cb(status)
    end, data.name, data.phone)
end)

RegisterNUICallback('PayInvoice', function(data, cb)
    ESX.TriggerServerCallback('esx_billing:payBill', function(callback)
        cb(callback)
    end, data.id)
end)


RegisterNetEvent('ld-phone:showdata2', function(id, callingnumber, time, sonmesaj)
    local name = nil
    for k, v in pairs(PhoneData.contacts) do
        if tonumber(v.number) == tonumber(callingnumber) then
            name = v.name
            break
        end
    end
    SendNUIMessage({
        type = "messageslog",
        id = id,
        number = callingnumber,
        name = name or callingnumber,
        time = time,
        sonmsj = sonmesaj
    })
end)


RegisterNetEvent('ld-phone:nuimesg', function(appname)
    SendNUIMessage({
        type = appname
    })
end)

RegisterNUICallback('sendmessagebut', function(data)
    if string.len(data.mesaj) > 1 then
        TriggerServerEvent('ld-phone:savemessage', data.number, data.mesaj)
        TriggerServerEvent('phone:getinfos')
    else
        TriggerEvent('ld-phone:client:Notify', "You cant send empty messages!", "messages", "Phone")
    end
end)

RegisterNUICallback('loadcontactmessages', function(number)
    PhoneData.CurrentMessageNumber = tonumber(number['number'])
    TriggerServerEvent('ld-phone:server:loadinnermessages', tonumber(number['number']))
end)

RegisterNetEvent("ld-phone:sohbettemiknk",function(number, message)
    print("test1")
    local name = nil
    for t, u in pairs(PhoneData.contacts) do
        if tonumber(u.number) == tonumber(number) then
            name = u.name
            break
        end
    end
    if PhoneData.CurrentMessageNumber == number then
        TriggerServerEvent("ld-phone:server:loadinnermessages", number)
    else
        print("test2")
        TriggerEvent('ld-phone:client:Notify', message, "messages", number )
        TriggerEvent('ld-phone:client:Notify', message, "messages", name == nil and number or name)
    end
end)

RegisterNUICallback('kapatildi', function()
    PhoneData.CurrentMessageNumber = nil
    TriggerServerEvent('phone:getinfos')
end)

RegisterNetEvent('ld-phone:client:loadmessages', function(number, gonderenumber, mesaj, time, mynumber)
    SendNUIMessage({
        type = 'showmessages',
        gonderenumber = gonderenumber,
        number2 = number,
        message = mesaj,
        time = time,
        menumbermynumber = mynumber
    })
end)

RegisterNUICallback('messagesdatas', function()
    TriggerServerEvent('phone:getinfos')
end)

RegisterNUICallback('SendMoneyToNumber', function(data, cb)
    ESX.TriggerServerCallback('ld-phone:server:SendMoneyToNumber', function(callback)
        cb(callback)        
    end, data.number, data.amount, data.comment)
end)

RegisterNetEvent('ld-phone:client:SendMail')
AddEventHandler('ld-phone:client:SendMail', function(subject, sender, message)
    TriggerServerEvent('ld-phone:server:SendMail', subject, sender, message)
end)

RegisterNetEvent('ld-phone:client:UpdateMails')
AddEventHandler('ld-phone:client:UpdateMails', function(sender, subject)
    SendNUIMessage({
        type = 'updatemails',
        sender = sender,
        subject = subject
    })
end)