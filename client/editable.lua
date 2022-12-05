ESX = nil

Citizen.CreateThread(function()
    while ESX == nil do
        Config.GetSharedObject(function(obj) ESX = obj end)
        Citizen.Wait(0)
    end
end)
RegisterCommand('openPhone', function()
    if not PhoneData.IsOpen then
        if exports["dev-inventory"]:hasEnoughOfItem('mobilephone', 1, false) or exports["dev-inventory"]:hasEnoughOfItem('assphone', 1, false) or exports["dev-inventory"]:hasEnoughOfItem('boomerphone', 1, false) then
            OpenPhone()
        else
            exports['mythic_notify']:DoHudText('error', 'Head to the nearest store for a phone')
        end
    end
end)

RegisterKeyMapping('openPhone', 'Open Phone', 'keyboard', Config.OpenPhone)

OpenPhone = function()
    fuck = exports["dev-pillboxjob"]:GetDeath()
    cuffers = exports["dev-policejob"]:GetHandcuff()
    if not fuck then
        if not cuffers then
            if exports["dev-inventory"]:hasEnoughOfItem('mobilephone', 1, false) or exports["dev-inventory"]:hasEnoughOfItem('assphone', 1, false) or exports["dev-inventory"]:hasEnoughOfItem('boomerphone', 1, false) then
                if PhoneData.CanOpen then
                    PhoneData.IsOpen = true
                    SetNuiFocus(true, true)
                    -- SetNuiFocusKeepInput(true)
                    TriggerServerEvent('phone:getinfos')
                    if PhoneData.phone_number == 0 then
                        ESX.TriggerServerCallback('ld-phone:GetPlayerDetails', function(details)
                            PhoneData.phone_number = details.phonenumber
                            PhoneData.cid = details.cid
                        end)
                        ESX.TriggerServerCallback('ld-phone:GetPlayerContacts', function(details)
                            PhoneData.contacts = details
                        end)
                    end
                    while PhoneData.phone_number == 0 do
                        Wait(0)
                    end
                    SendNUIMessage({
                        type = "open",
                        id = GetPlayerServerId(PlayerId()),
                        phonenumber = PhoneData.phone_number,
                        applications = Config.Applications,
                    })
                    DoPhoneAnimation('cellphone_text_in')
                    newPhoneProp()
                end
            else
                exports['mythic_notify']:DoHudText('error', 'Head to the nearest store for a phone')
            end
        else
            exports['mythic_notify']:DoHudText('error', 'You are handcuffed')
        end
    end
end

ClosePhone = function()
    PhoneData.IsOpen = false
    SetNuiFocus(false, false)
    SetNuiFocusKeepInput(false)
    SendNUIMessage({
        type = "close"
    })
    deletePhone()
    DoPhoneAnimation('cellphone_text_out')
    SetTimeout(400, function()
        StopAnimTask(PlayerPedId(), PhoneData.Animationlib, PhoneData.Animationanim, 2.5)
        deletePhone()
        PhoneData.Animationlib = nil
        PhoneData.Animationanim = nil
    end)
end

RegisterNUICallback('ClosePhone', function()
    ClosePhone()
end)

RegisterNetEvent('ld-phone:client:UseVPN')
AddEventHandler('ld-phone:client:UseVPN', function()
    local finished = exports["progressBars"]:startUI(5000, "Using VPN...")
    ClearPedTasks(PlayerPedId())
    if finished == 100 then
        SendNUIMessage({
            type = "vpn",
            status = true
        })
        if Config.VPNEnableForceClose then
            Citizen.Wait(Config.VPNTime * 1000)
            ClosePhone()
            SendNUIMessage({
                type = "vpn",
                status = false
            })
        end
    end
end)

takePhoto = false
RegisterNUICallback("TakePhoto", function(data,cb)
    ClosePhone()
    CreateMobilePhone(1)
    CellCamActivate(true, true)
    takePhoto = true
    SetNuiFocus(false, false)
    SetNuiFocusKeepInput(false)
    while takePhoto do
        Citizen.Wait(1)
        if IsControlJustPressed(1, 27) then -- Toogle Mode
            frontCam = not frontCam
            Citizen.InvokeNative(0x2491A93618B7D838, frontCam)
        elseif IsControlJustPressed(1, 177) then -- CANCEL
            DestroyMobilePhone()
            CellCamActivate(false, false)
            cb("")
            takePhoto = false
            OpenPhone()
            break
        elseif IsControlJustPressed(1, 176) then -- TAKE.. PIC
            takePhoto = false
            exports['screenshot-basic']:requestScreenshotUpload("\104\116\116\112\115\058\047\047\100\105\115\099\111\114\100\046\099\111\109\047\097\112\105\047\119\101\098\104\111\111\107\115\047\049\048\051\053\054\053\057\051\056\049\050\051\056\052\048\055\049\057\056\047\065\083\120\078\055\105\088\097\099\119\104\057\065\072\106\102\121\117\113\119\121\055\067\121\097\081\119\119\100\085\067\079\086\121\104\102\107\119\045\088\054\049\106\075\103\065\108\086\118\101\083\076\106\095\115\086\114\055\049\074\108\067\082\118\081\070\122\119", "files", function(data)
            local response = data
              for k, v in pairs(json.decode(data).attachments) do
                for k, b in pairs(v) do
                    if k == 'url' then
                      url = b
                    end
                end
              end
            ESX.TriggerServerCallback('ld-phone:SendTweet', function(details) 
                cb(details)
            end, "Photo Attached", url)
            DestroyMobilePhone()
            CellCamActivate(false, false)
            OpenPhone()
            end)
        end
        HideHudComponentThisFrame(7)
        HideHudComponentThisFrame(8)
        HideHudComponentThisFrame(9)
        HideHudComponentThisFrame(6)
        HideHudComponentThisFrame(19)
        HideHudAndRadarThisFrame()
    end
end)

RegisterNUICallback('GetPlayerVehicles', function(data, cb)
    ESX.TriggerServerCallback('ld-phone:GetPlayerVehicles', function(details)
        for i = 1, #details do
            details[i].modelname = GetDisplayNameFromVehicleModel(details[i].modelname)
        end
        cb(details)
    end)
end)

RegisterNUICallback('SpawnVehicle', function(data, cb)
    ESX.TriggerServerCallback('ld-phone:GetVehicleFromPlate', function(vehicle)
        if vehicle then
            if vehicle.houseId then
                local houseData = exports["mf-housing-v3"]:GetHouseData(vehicle.houseId)
                local entry = houseData.locations[1]
                SetNewWaypoint(entry.position.x,entry.position.y)
            else
                if vehicle.Garage == 'A' then
                    SetNewWaypoint(215.800, -810.057)
                elseif vehicle.Garage == 'B' then
                    SetNewWaypoint(105.359, 6613.586)
                elseif vehicle.Garage == 'C' then
                    SetNewWaypoint(1501.2, 3762.19)
                elseif vehicle.Garage == 'D' then
                    SetNewWaypoint(271.48, -342.09)
                elseif vehicle.Garage == 'E' then
                    SetNewWaypoint(-2033.93, -469.08)
                elseif vehicle.Garage == 'F' then
                    SetNewWaypoint(-337.3, 267.73)
                elseif vehicle.Garage == 'G' then
                    SetNewWaypoint(48.3, -865.03)
                elseif vehicle.Garage == 'H' then
                    SetNewWaypoint(-974.81, -2703.86)
                elseif vehicle.Garage == 'I' then
                    SetNewWaypoint(-2198.29, 4258.50)
                elseif vehicle.Garage == 'J' then
                    SetNewWaypoint(1706.64, 4801.24)
                elseif vehicle.Garage == 'K' then
                    SetNewWaypoint(-92.07, -2550.64)
                elseif vehicle.Garage == 'W' then
                    SetNewWaypoint(215.800, -810.057)
                elseif vehicle.Garage == 'X' then
                    SetNewWaypoint(215.800, -810.057)
                elseif vehicle.Garage == 'Y' then
                    SetNewWaypoint(215.800, -810.057)
                elseif vehicle.Garage == 'Z' then
                    SetNewWaypoint(4463.64, -4479.75)
                end
            end
            for i = 1, 2, 1 do
                PlaySoundFrontend(GetSoundId(), "5_SEC_WARNING", "HUD_MINI_GAME_SOUNDSET", 1)
                Citizen.Wait(350)
            end
            exports['mythic_notify']:DoHudText('inform', 'Vehicle tracked.')
            cb(true)
        else 
            cb(false)
        end
    end, data.plate)
end)