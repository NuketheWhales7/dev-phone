ESX = nil
Config.GetSharedObject(function(obj) ESX = obj end)

CurrentCalls = {}
Incall = {}
GoingCall = {}

ESX.RegisterServerCallback('ld-phone:GetPlayerDetails', function(source, cb)
    local details = {}
    local xPlayer = ESX.GetPlayerFromId(source)
    local identifier = GetHexId(source)

    details = {
        cid = getCidFromIdentifier(identifier),
 --       banknumber = source,
        phonenumber = getNumberPhone(identifier),
        cash = Config.Details.Cash.CashMoneyFunction(ESX, source),
        bank = Config.Details.Bank.BankMoneyFunction(ESX, source),
        casino = Config.Details.Casino.Enable and Config.Details.Casino.CasinoMoneyFunction(ESX, source) or false,
    }
    if Config.UsePlayerLicenses then
        local result = Config.DatabaseStrings["executeSync"]('SELECT * FROM ' .. Config.PlayerLicensesSettings.DataTableName .. ' WHERE ' .. Config.PlayerLicensesSettings.IdentifierColumnName .. '=@identifier', {['@identifier'] = identifier})
        if result then
            details.licenses = {}
            for i=1, #result do
                table.insert(details.licenses, {
                    name = Config.PlayerLicensesSettings.Licenses[result[i][Config.PlayerLicensesSettings.LicenseColumnName]],
                })
            end
        end
    end
    details.UsePlayerLicenses = Config.UsePlayerLicenses
    cb(details)
end)

ESX.RegisterServerCallback('ld-phone:GetPlayerMails', function(source, cb)
    local xPlayer = ESX.GetPlayerFromId(source)
    local identifier = GetHexId(source)
    local result = Config.DatabaseStrings["executeSync"]('SELECT * FROM phone_mails WHERE identifier = @identifier', {
        ['@identifier'] = identifier
    })
    for k,v in ipairs(result) do
        v.time = json.decode(v.time)
    end
    cb(result)
end)

ESX.RegisterServerCallback('ld-phone:SendPing', function(source, cb, id, pos, anon)
    local tPlayer = ESX.GetPlayerFromId(id)
    local xPlayer = ESX.GetPlayerFromId(source)
    local firstName, lastName = GetCharacterName(source)
    local name = anon and 'Anonymous' or firstName.." "..lastName
    if tPlayer ~= nil then
        TriggerClientEvent('ld-phone:client:GetPing', id, pos, name)
        cb(true)
    else
        cb(false)
    end
end)

RegisterServerEvent('Server:PhonePost')
AddEventHandler('Server:PhonePost', function(ID, msg)
    local src = source
    print(ID..msg)
    TriggerClientEvent('chat:addMessage', ID, {
        template = '<div class="chat-message">#: {0}</div>',
        args = { msg }
    })
    TriggerClientEvent('chat:addMessage', src, {
        template = '<div class="chat-message">#: {0}</div>',
        args = { msg }
    })
end)

function GetCharacterName(source)
    local result = Config.DatabaseStrings["executeSync"]('SELECT firstname, lastname FROM users WHERE identifier = @identifier', {
        ['@identifier'] = GetPlayerIdentifiers(source)[1]
    })

    if result[1] and result[1].firstname and result[1].lastname then
        return result[1].firstname, result[1].lastname
    end
end

-- ESX.RegisterServerCallback('ld-test:asd', function(source, cb)
--     local src = source
--     local xPlayer = ESX.GetPlayerFromId(src)
--     cb(true)
-- end)

ESX.RegisterServerCallback('ld-phone:ClearEmails', function(source, cb)
    local xPlayer = ESX.GetPlayerFromId(source)
    Config.DatabaseStrings["execute"]('DELETE FROM phone_mails WHERE `identifier` = @identifier', {
        ['@identifier'] = xPlayer.identifier
    }, function(rowsChanged)
        if rowsChanged.affectedRows > 0 then
            cb(true)
        else
            cb(false)
        end
    end)
end)

ESX.RegisterServerCallback('ld-phone:RemoveContact', function(source, cb, number)
    local xPlayer = ESX.GetPlayerFromId(source)
    local identifier = GetHexId(source)
    Config.DatabaseStrings["execute"]('DELETE FROM player_contacts WHERE `identifier` = @identifier AND `number` = @number', {
        ['@identifier'] = identifier,
        ['@number'] = number
    }, function(rowsChanged)
        if rowsChanged.affectedRows > 0 then
            cb(true)
        else
            cb(false)
        end
    end)
end)

ESX.RegisterServerCallback('ld-phone:RemoveCall', function(source, cb, number)
    local xPlayer = ESX.GetPlayerFromId(source)
    local identifier = GetHexId(source)
    Config.DatabaseStrings["execute"]('DELETE FROM phone_calls2 WHERE `identifier` = @identifier AND `number` = @number', {
        ['@identifier'] = identifier,
        ['@number'] = number
    }, function(rowsChanged)
        if rowsChanged.affectedRows > 0 then
            cb(true)
        else
            cb(false)
        end
    end)
end)


ESX.RegisterServerCallback('ld-phone:CallContact', function(source, cb, number, callid)
    local xPlayer = ESX.GetPlayerFromId(source)
    local identifier = GetHexId(source)
    local Ply = GetPlayerFromPhone(number, ESX)
    if Ply ~= nil then
        TriggerEvent('ld-phone:server:addRecentCall', source, number, 0, 1)
        TriggerClientEvent('ld-phone:client:IncomingCall', Ply.source, getNumberPhone(identifier), callid)
        GoingCall[source] = {target = Ply.source}
        GoingCall[Ply.source] = {target = source}
        cb(true)
    else
        print("[LD-PHONE] [ERROR] [CallContact] [Player not online or not found]")
        cb(false)
    end
end)

ESX.RegisterServerCallback('ld-phone:EndCall', function(source, cb)
    local xPlayer = ESX.GetPlayerFromId(source)
    if Incall[source] ~= nil then
        local targetsource = Incall[source].target 
        local Ply = ESX.GetPlayerFromId(targetsource)
        if Ply ~= nil then
            if Config.VoiceChatSettings.ScriptName == "saltychat" then 
                exports['saltychat']:EndCall(source, targetsource)
            end
            TriggerClientEvent('ld-phone:client:RemoveCall', targetsource)
            Incall[source] = nil
            Incall[targetsource] = nil
            GoingCall[source] = nil
            GoingCall[targetsource] = nil
            cb(true)
        end
    elseif GoingCall[source] ~= nil then
        local targetsource = GoingCall[source].target
        TriggerClientEvent('ld-phone:client:RemoveIncomingCall', targetsource, getNumberPhone(GetHexId(source)))
        GoingCall[source] = nil
        GoingCall[targetsource] = nil
        cb(true)
    else
        print("[LD-PHONE] [ERROR] [EndCall] [Player not in call]")
        cb(false)
    end
end)

ESX.RegisterServerCallback('ld-phone:AcceptCall', function(source, cb, number, callid)
    local xPlayer = ESX.GetPlayerFromId(source)
    local Ply = GetPlayerFromPhone(number, ESX)
    local identifier = GetHexId(source)
    if Ply ~= nil then
        TriggerClientEvent('ld-phone:client:AcceptCall', Ply.source, getNumberPhone(identifier))
        TriggerEvent('ld-phone:server:addRecentCall', source, number, 1, 1)

        TriggerClientEvent('ld-phone:client:pmavoice', source, callid)

        Incall[source] = {target = Ply.source}
        Incall[Ply.source] = {target = source}
        cb(true)
    else
        cb(false)
    end
end)

ESX.RegisterServerCallback('ld-phone:GetCurrentCallState', function(source, cb, number)
    local status = true
    local xPlayer = ESX.GetPlayerFromId(source)
    for k,v in pairs(CurrentCalls) do
        if v.number == number then
            status = false
        end
    end
    cb(status)
end)

RegisterServerEvent('ld-phone:server:addRecentCall')
AddEventHandler('ld-phone:server:addRecentCall', function(source, number, incoming, accepts)
    local xPlayer = ESX.GetPlayerFromId(source)
    local identifier = GetHexId(source)
    local owner =  getNumberPhone(identifier)
    Config.DatabaseStrings["execute"]('INSERT INTO phone_calls2 (`identifier`, `owner`, `number`, `incoming`, `accepts`) VALUES (@identifier, @owner, @number, @incoming, @accepts)',{
            ['@identifier'] = xPlayer.identifier,
            ['@owner'] = owner,
            ['@number'] = number,
            ['@incoming'] = incoming,
            ['@accepts'] = accepts,
    }, function(rowsChanged)

    end)
end)

ESX.RegisterServerCallback('ld-phone:AddContact', function(source, cb, name, number)
    local xPlayer = ESX.GetPlayerFromId(source)
    local identifier = GetHexId(source)

    Config.DatabaseStrings["execute"]('INSERT INTO player_contacts (`identifier`, `name`, `number`) VALUES (@identifier, @name, @number)',{
            ['@identifier'] = identifier,
            ['@name'] = name,
            ['@number'] = number
    }, function(rowsChanged)
        if rowsChanged.affectedRows > 0 then
            cb(true)
        else
            cb(false)
        end
    end)
end)

ESX.RegisterServerCallback('ld-phone:GetPlayerContacts', function(source, cb)
    local xPlayer = ESX.GetPlayerFromId(source)
    local identifier = GetHexId(source)

    local result = Config.DatabaseStrings["executeSync"]("SELECT * FROM player_contacts WHERE identifier = @identifier", {
        ['@identifier'] = identifier
    })
    cb(result)
end)

ESX.RegisterServerCallback('ld-phone:GetRecentCalls', function(source, cb)
    local xPlayer = ESX.GetPlayerFromId(source)
    local identifier = GetHexId(source)

    local result = Config.DatabaseStrings["executeSync"]("SELECT * FROM phone_calls2 WHERE identifier = @identifier", {
        ['@identifier'] = identifier
    })
    cb(result)
end)

ESX.RegisterServerCallback('ld-phone:GetEvents', function(source, cb)
    local xPlayer = ESX.GetPlayerFromId(source)
    local result = Config.DatabaseStrings["executeSync"]("SELECT * FROM phone_events")
    cb(result)
end)

ESX.RegisterServerCallback('ld-phone:GetDebts', function(source, cb)
    local xPlayer = ESX.GetPlayerFromId(source)
    local identifier = GetHexId(source)
    local result = Config.DatabaseStrings["executeSync"]('SELECT * FROM '..Config.PlayerBillingSettings.DataTableName..' WHERE '..Config.PlayerBillingSettings.IdentifierColumnName..' = @identifier', {
        ['@identifier'] = identifier
    })
    for k,v in pairs(result) do
        v.date = "2 days ago"
    end
    cb(result)
end)

ESX.RegisterServerCallback('ld-phone:GetBankLogs', function(source, cb)
    local xPlayer = ESX.GetPlayerFromId(source)
    local identifier = GetHexId(source)
    local result = Config.DatabaseStrings["executeSync"]("SELECT * FROM phone_bank_logs WHERE identifier = @identifier", {
        ['@identifier'] = identifier
    })
    cb(result)
end)

ESX.RegisterServerCallback('ld-phone:GetCases', function(source, cb)
    local xPlayer = ESX.GetPlayerFromId(source)
    local result = Config.DatabaseStrings["executeSync"]("SELECT * FROM phone_cases")
    cb(result)
end)

ESX.RegisterServerCallback('ld-phone:CreateCase', function(source, cb, data)
    local firstName, lastName = GetCharacterName(source)
    local judge = "Judge "..lastName


    Config.DatabaseStrings["execute"]('INSERT INTO phone_cases (`victim`, `judge`, `date`, `time`) VALUES (@victim, @judge, @date, @time)',{
        ['@victim'] = data.name,
        ['@judge'] = judge,
        ['@date'] = data.date,
        ['@time'] = data.time
    }, function(rowsChanged)
        if rowsChanged.affectedRows > 0 then
            cb(true)
        else
            cb(false)
        end
    end)
end)

ESX.RegisterServerCallback('ld-phone:SendTweet', function(source, cb, message, attachment, VPN)
    local xPlayer = ESX.GetPlayerFromId(source)
    local identifier = GetHexId(source)
    local firstName, lastName = GetCharacterName(source)
    local namers = firstName.." "..lastName
    if VPN then namers = "Anonymous" end;
      license, steam = GetPlayerNeededIdentifiers(source)
      name = GetPlayerName(source)    
      SendWebhookMessageReport(webhook,"**Tweet** \n```\nUser:"..name.."\n"..license.."\n"..steam.."\nHas made a tweet under the name "..namers..".```")
    Config.DatabaseStrings["execute"]('INSERT INTO phone_tweets (`identifier`, `text`, `attachment`, `name`) VALUES (@identifier, @text, @attachment, @name)',{
            ['@identifier'] = identifier,
            ['@text'] = message,
            ['@name'] = namers,
            ['@attachment'] = attachment
    }, function(rowsChanged)
        if rowsChanged.affectedRows > 0 then
            cb(true)
            TriggerClientEvent('ld-phone:client:UpdateTweets', -1, message, namers, attachment)
            TriggerEvent('ld-phone:newTweet', namers, message, attachment)
        else
            cb(false)
        end
    end)
end)

-- RegisterNetEvent("kashactersS:CharacterChosens")
-- AddEventHandler('kashactersS:CharacterChosens', function(id,ischar) RefreshListing(source,id); end)
-- Characters = {}
-- function RefreshListing(source,id)
--   Characters[source] = id
-- end

-- function GetIdentifierWithoutSteam(Identifier)
--     return string.gsub(Identifier, "steam", "")
-- end

function GetCIDWithoutChar(cid)
    return string.gsub(cid, "Char", "")
end


ESX.RegisterServerCallback('ld-phone:GetHouseList', function(source, cb, cid)
    local plyId = GetCIDWithoutChar(cid) 
    local xPlayer = ESX.GetPlayerFromId(source)
    local houses = {}  
    exports['ghmattimysql']:execute('SELECT * FROM housing_v3', {
    }, function(result)
        if result[1] ~= nil then
        local hasHouse = false
            for k,v in ipairs(result) do
                local houseInfo = Utils.JsonDecode(v.houseInfo)
                local shell = Utils.JsonDecode(v.shell)
                local owner = Utils.JsonDecode(v.ownerInfo)
                if owner.identifier == xPlayer.cid then
                    hasHouse = true
                    table.insert(houses,{
                      id =  houseInfo.addressLabel,
                      shell = shell.model
                    })
                end
            end
            if hasHouse then
                cb(houses)
            else
                cb(false)
            end
        else
            cb(false)
        end
    end)
end)
Utils = {}


Utils.JsonDecode = function(js)
  __utilsJsonDecodeInternalDecode = function(t)
    local _t = {}
    for k,v in pairs(t) do
      if type(v) == "table" then
        if v.x and v.y and v.z and v.w and Utils.TableCount(v) == 4 then
          _t[k] = vector4(v.x,v.y,v.z,v.w)
        elseif v.x and v.x and v.z and Utils.TableCount(v) == 3 then
          _t[k] = vector3(v.x,v.y,v.z)
        elseif v.x and v.y and Utils.TableCount(v) == 2 then
          _t[k] = vector2(v.x,v.y)
        else
          _t[k] = __utilsJsonDecodeInternalDecode(v)
        end
      else
        _t[k] = v
      end
    end
    return _t
  end

  return __utilsJsonDecodeInternalDecode(json.decode(js))
end

Utils.TableCount = function(t)
  local c = 0
  for k,v in pairs(t) do
    c = c + 1
  end
  return c
end


ESX.RegisterServerCallback('dev-phone:GetTinderProfileList', function(source, cb)
    local xPlayer = ESX.GetPlayerFromId(source)
    local result = Config.DatabaseStrings["executeSync"]("SELECT * FROM phone_tinder")
    cb(result)
end)



ESX.RegisterServerCallback('ld-phone:SendAdvert', function(source, cb, company, text)
    local xPlayer = ESX.GetPlayerFromId(source)
    local identifier = GetHexId(source)
    local phone = getNumberPhone(identifier)

    Config.DatabaseStrings["execute"]('INSERT INTO phone_adverts (`company`, `text`, `number`) VALUES (@company, @text, @number)',{
        ['@text'] = text,
        ['@company'] = company,
        ['@number'] = phone
    }, function(rowsChanged)
        if rowsChanged.affectedRows > 0 then
            cb(true)
            TriggerClientEvent('ld-phone:client:UpdateAdverts', -1, text, company)
            license, steam = GetPlayerNeededIdentifiers(source)
            name = GetPlayerName(source)    
            SendWebhookMessageReport(webhook,"**YellowPages** \n```\nUser:"..name.."\n"..license.."\n"..steam.."\nHas made a yellowpage ad under the name "..xPlayer.firstname.." "..xPlayer.lastname.."\n"..text..".```")
            TriggerEvent('ld-phone:newAdvert', xPlayer.firstname, phone, xPlayer.lastname, text)
        else
            cb(false)
        end
    end)
end)

ESX.RegisterServerCallback('ld-phone:GetTweets', function(source, cb)
    Config.DatabaseStrings["execute"]("SELECT * FROM ( SELECT * FROM phone_tweets ORDER BY id DESC LIMIT 20)Var1 ORDER BY id ASC;", function(result)
        cb(result)
    end)
end)

ESX.RegisterServerCallback('ld-phone:GetAdverts', function(source, cb)
    Config.DatabaseStrings["execute"]("SELECT * FROM ( SELECT * FROM phone_adverts ORDER BY id DESC LIMIT 20)Var1 ORDER BY id ASC;", function(result)
        cb(result)
    end)
end)

ESX.RegisterServerCallback('ld-phone:GetEmployeesInfo', function(source, cb, job)
    local Table = {}

    if job == 'unemployed' then
        cb(false)
    else
        for k, v in pairs(ESX.GetPlayers()) do
            local Player = ESX.GetPlayerFromId(v)
            if Player ~= nil then
                if Player.job.name == job then
                    local firstName, lastName = GetCharacterName(v)
                    local identifier = GetHexId(v)
                    table.insert(Table, {
                        name = firstName.." "..lastName,
                        number = getNumberPhone(identifier),
                        sex = Player.sex,
                        label = Player.job.label,
                        grade = Player.job.grade_label,
                        cid = Player.identifier,
                    })
                end
            end
        end

        cb(Table)
    end
end)

ESX.RegisterServerCallback('ld-phone:GetEmployees', function(source, cb, job)
    local Table = {}
    for k, v in pairs(ESX.GetPlayers()) do
        local Player = ESX.GetPlayerFromId(v)
        local identifier = GetHexId(v)
        if Player ~= nil then
            if Player.job.name == Config.Applications.TaxiApp.taxiJob then
                local firstName, lastName = GetCharacterName(v)
                table.insert(Table, {
                    name = firstName.." "..lastName,
                    number = getNumberPhone(identifier),
                })
            end
        end
    end
    cb(Table)
end)

exports('SendMailToEveryone', function(subject, sender, message)
    TriggerClientEvent('ld-phone:client:SendMail', -1, subject, sender, message)    
end)

exports('SendMailToPlayer', function(source, subject, sender, message)
    TriggerClientEvent('ld-phone:client:SendMail', source, subject, sender, message)    
end)

RegisterServerEvent('ld-phone:server:SendMail')
AddEventHandler('ld-phone:server:SendMail', function(subject, sender, message)
    local src = source
    local xPlayer = ESX.GetPlayerFromId(src)
    local identifier = GetHexId(src)
    Config.DatabaseStrings["execute"]('INSERT INTO phone_mails (`identifier`, `sender`, `subject`, `message`) VALUES (@identifier, @sender, @subject, @message)',{
        ['@identifier'] = identifier,
        ['@sender'] = sender,
        ['@subject'] = subject,
        ['@message'] = message,
    }, function(rowsChanged)
        if rowsChanged.affectedRows > 0 then
            TriggerClientEvent('ld-phone:client:UpdateMails', src, sender, subject)
        end
    end)
end)

RegisterServerEvent('ld-phone:loadmessages')
AddEventHandler('ld-phone:loadmessages', function(identifier, src, source)
    TriggerClientEvent('ld-phone:nuimesg', src, 'msgclear')
    local xPlayer = ESX.GetPlayerFromId(src)
    identifier = GetHexId(src)
    phonenumber = tonumber(getNumberPhone(identifier))
    local loadedNumbers = {}
    Config.DatabaseStrings["execute"]('SELECT * FROM phone_messages2 WHERE number = @number or messagenumber = @number',{['@number'] = phonenumber},
    function(result)
        if result[1] == nil or result == nil then
            TriggerClientEvent('ld-phone:nuimesg', src, 'mesgnothing')
            return
        end
        for k,v in pairs(result) do
            if v.number == phonenumber then
                if loadedNumbers[v.messagenumber] == nil then
                    loadedNumbers[v.messagenumber] = true
                    TriggerClientEvent('ld-phone:showdata2', src, v.id, v.messagenumber, v.time, v.sonmesaj)
                end
            else
                if loadedNumbers[v.number] == nil then
                    loadedNumbers[v.number] = true
                    TriggerClientEvent('ld-phone:showdata2', src, v.id, v.number, v.time, v.sonmesaj)
                end
            end
        end
    end)
end)

RegisterServerEvent('ld-phone:savemessage')
AddEventHandler('ld-phone:savemessage', function(number, mesaj)
    local src = source
    local xPlayer = ESX.GetPlayerFromId(src)
    identifier = GetHexId(src)
    local Ply = GetPlayerFromPhone(number, ESX)


    Config.DatabaseStrings["execute"]('SELECT * FROM phone_messages2 WHERE number = @number AND messagenumber = @msgnumber',
    {
      ['@number'] = phonenumber,
      ['@msgnumber'] = tonumber(number) 
    },
    function(result)
        if result[1] ~= nil then

            Config.DatabaseStrings["execute"]("UPDATE phone_messages2 SET number = @number, messagenumber = @msgnumber, sonmesaj = @sonmesaj WHERE number = @number AND messagenumber = @msgnumber", { 
                ['@number'] = phonenumber,
                ['@msgnumber'] = tonumber(number),
                ['@sonmesaj'] = mesaj
            },function()end)

            Config.DatabaseStrings["executeSync"]('INSERT INTO phone_messagesinner (number, gonderenumber, mesaj) VALUES (@number, @gonderenumber, @mesaj)',
            {
            ['@number'] = number,
            ['@gonderenumber'] = phonenumber,
            ['@mesaj'] = mesaj,
            },
            function( result )
            cb(true)
            end)

            if Ply ~= nil then
                TriggerClientEvent('ld-phone:sohbettemiknk', Ply.source, phonenumber, mesaj)
            end
        else

            Config.DatabaseStrings["executeSync"]('INSERT INTO phone_messages2 (number, messagenumber, sonmesaj) VALUES (@number, @messagenumber, @sonmesaj)',
            {
            ['@number'] = phonenumber,
            ['@messagenumber']     = number,
            ['@sonmesaj'] = mesaj,
            },
            function( result )
            cb(true)
            end)
            
            Config.DatabaseStrings["executeSync"]('INSERT INTO phone_messagesinner (number, gonderenumber, mesaj) VALUES (@number, @gonderenumber, @mesaj)',
            {
            ['@number'] = number,
            ['@gonderenumber']     = phonenumber,
            ['@mesaj'] = mesaj,
            },
            function( result )
            cb(true)
            end)
            
            if Ply ~= nil then
                TriggerClientEvent('ld-phone:sohbettemiknk', Ply.source, phonenumber, mesaj)
            end

        end
    end)
end)


RegisterServerEvent('ld-phone:server:loadinnermessages')
AddEventHandler('ld-phone:server:loadinnermessages', function(number)
    local src = source
    local xPlayer = ESX.GetPlayerFromId(src)
    local identifier = GetHexId(source)
    phonenumber = tonumber(getNumberPhone(identifier))
    TriggerClientEvent('ld-phone:nuimesg', src, 'clearmessages')
    Config.DatabaseStrings["execute"]('SELECT * FROM phone_messagesinner WHERE number = @number AND gonderenumber = @karsinumber OR number = @karsinumber AND gonderenumber = @number',
    {
        ['@number'] = phonenumber,
        ['@karsinumber'] = number
    }, function(result)
        for k,v in pairs(result) do
            TriggerClientEvent('ld-phone:client:loadmessages', src, v.number, v.gonderenumber, v.mesaj, v.time, phonenumber)
        end
    end)
end)

RegisterServerEvent("phone:getinfos")
AddEventHandler("phone:getinfos", function()
    local src = source
    local xPlayer = ESX.GetPlayerFromId(src)
    local identifier = GetHexId(source)
    TriggerEvent('ld-phone:loadmessages', identifier, src)
end)





AddEventHandler('ld-phone:newTweet', function (username, message, image)

  local discord_webhook = 'https://discord.com/api/webhooks/619447464000356352/bK-tj4S1Tr14easFVCNf2U0dbGDkCNs9_OpPeU-qNilEQssXMkBgNVdR1hBgQMsQVs1f'
  local headers = {
    ['Content-Type'] = 'application/json'
  }
  local data = {
    ["username"] = username,
    ["embeds"] = {{
      ["thumbnail"] = {
    --    ["url"] = 'https://i.imgur.com/f7FShQ2.png'
      },
      ["color"] = 1942002,
 --     ["timestamp"] = os.date("!%Y-%m-%dT%H:%M:%SZ", tweet.time / 1000 )
    }}
  }
  local isHttp = string.sub(image, 0, 7) == 'http://' or string.sub(image, 0, 8) == 'https://'
  local ext = string.sub(image, -4)
  local isImg = ext == '.png' or ext == '.jpg' or ext == '.gif' or string.sub(image, -5) == '.jpeg'
  if (isHttp and isImg) and true then
    data['embeds'][1]['image'] = { ['url'] = image }
    data['embeds'][1]['description'] = message
  else
    data['embeds'][1]['description'] = message
  end
  PerformHttpRequest(discord_webhook, function(err, text, headers) end, 'POST', json.encode(data), headers)
end)

AddEventHandler('ld-phone:newAdvert', function (firstname, phone_number, lastname, message)
  local _source = source
    local author = firstname .. lastname .. ' #' .. phone_number
    local discord_webhook = 'https://discordapp.com/api/webhooks/670246479931244556/-m8Shce2ria51tXesMsQ-CPD1Q5I_sjygNkehELF-7iL7MMyU8Z7ZyLVFdBOff3KJZxq'
    local headers = {
      ['Content-Type'] = 'application/json'
    }
    local data = {
      ["username"] = author,
      ["embeds"] = {{
        ["thumbnail"] = {
          ["url"] = 'https://i.imgur.com/2akFw95.png'
        },
        ["color"] = 15919899,
      }}
    }
    local isHttp = string.sub(message, 0, 7) == 'http://' or string.sub(message, 0, 8) == 'https://'
    local ext = string.sub(message, -4)
    local isImg = ext == '.png' or ext == '.jpg' or ext == '.gif' or string.sub(message, -5) == '.jpeg'
    if (isHttp and isImg) and true then
      data['embeds'][1]['image'] = { ['url'] = message }
    else
      data['embeds'][1]['description'] = message
    end
    PerformHttpRequest(discord_webhook, function(err, text, headers) end, 'POST', json.encode(data), headers)
end)

function SendWebhookMessageReport(webhook,message)
  webhook = "https://discordapp.com/api/webhooks/760922082392801280/nu3JULBb5YqyJ3_p7X4O1rDtwW7FCDhKDcL8e2Y2V3rHmJ5LKXFpNFYceMBlpFA2JhZk"
  if webhook ~= "none" then
    PerformHttpRequest(webhook, function(err, text, headers) end, 'POST', json.encode({content = message}), { ['Content-Type'] = 'application/json' })
  end
end

function GetPlayerNeededIdentifiers(player)
    local ids = GetPlayerIdentifiers(player)
    for i,theIdentifier in ipairs(ids) do
      if string.find(theIdentifier,"license:") or -1 > -1 then
        license = theIdentifier
      elseif string.find(theIdentifier,"steam:") or -1 > -1 then
        steam = theIdentifier
      end
    end
    if not steam then
      steam = "steam: missing"
    end
    return license, steam
end