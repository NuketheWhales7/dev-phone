ESX = nil
Config.GetSharedObject(function(obj) ESX = obj end)

ESX.RegisterUsableItem(Config.VPNItem, function(source)
    TriggerClientEvent('ld-phone:client:UseVPN', source)
end)

ESX.RegisterServerCallback('ld-phone:server:SendMoneyToNumber', function(source, cb, number, amount, comment)
    local src = source
    local xPlayer = ESX.GetPlayerFromId(src)
    local identifier = GetHexId(src)
--    local xTarget = GetPlayerFromPhone(number, ESX)
    local xTarget = ESX.GetPlayerFromId(number)
    amount = tonumber(amount)
    if xTarget ~= nil and xTarget ~= xPlayer  then
        local targetidentifier = GetHexId(xTarget.source)
        if Config.Details.Bank.BankMoneyFunction(ESX, source) >= amount or math.type(tonumber(amountt)) == "float" then
            xPlayer.removeAccountMoney('bank', amount)
            xTarget.addAccountMoney('bank', amount)
            cb({status = true, text = "Sent " .. amount .. "$"})
            Config.DatabaseStrings["execute"]('INSERT INTO phone_bank_logs (`identifier`, `amount`, `comment`, `type`, `name`) VALUES (@identifier, @amount, @comment, @type, @name)',{
                ['@identifier'] = identifier,
                ['@amount'] = amount,
                ['@comment'] = comment,
                ['@type'] = "send",
                ['@name'] = xTarget.getName()
            }, function(rowsChanged)
                if rowsChanged.affectedRows > 0 then
                    Config.DatabaseStrings["execute"]('INSERT INTO phone_bank_logs (`identifier`, `amount`, `comment`, `type`, `name`) VALUES (@identifier, @amount, @comment, @type, @name)',{
                        ['@identifier'] = targetidentifier,
                        ['@amount'] = amount,
                        ['@comment'] = comment,
                        ['@type'] = "receive",
                        ['@name'] = xPlayer.getName()
                    }, function(rowsChanged)
                        if rowsChanged.affectedRows > 0 then
                            TriggerClientEvent('ld-phone:client:UpdateBankLogs', xTarget.source, xPlayer.getName(), amount)
                        end
                    end)
                end
            end)
        else
            cb({status = false, text = "You don't have enough money"})
        end
    else
        cb({status = false, text = "Player not online, or not found!"})
    end
end)

function getCidFromIdentifier(ide)
    local result = Config.DatabaseStrings["executeSync"]('SELECT * FROM users WHERE identifier = @identifier', {['@identifier'] = ide})
    if result[1] ~= nil then
        return result[1].cid
    else
        return nil
    end
end

RegisterServerEvent('ld-phone:SetGarage')
AddEventHandler('ld-phone:SetGarage', function(plate, callback)
    local xPlayer = ESX.GetPlayerFromId(source)
    local identifier = GetHexId(source)
    exports['ghmattimysql']:execute('UPDATE '..PlayerVehiclesSettings.DataTableName..' SET '..PlayerVehiclesSettings.StoredColumnName..' = 0 WHERE plate = @plate', {
        ['@plate'] = plate,
    }, function(result)

    end)
end)

ESX.RegisterServerCallback('ld-phone:PayInvoice', function(source, cb, billId)
    local xPlayer = ESX.GetPlayerFromId(source)
    local identifier = GetHexId(source)
    local bill = Config.DatabaseStrings["executeSync"]('SELECT * FROM '..Config.PlayerBillingSettings.DataTableName..' WHERE '..Config.PlayerBillingSettings.IDColumnName..' =  @id', {
        ['@id'] = billId
    })
    if bill[1].amount < Config.Details.Bank.BankMoneyFunction(ESX, source) then 
        Config.DatabaseStrings["execute"]('DELETE FROM '..Config.PlayerBillingSettings.DataTableName..' WHERE '..Config.PlayerBillingSettings.IDColumnName..' = @id',{
            ['@id'] = billId
        }, function(rowsChanged)
            if rowsChanged.affectedRows > 0 then
                local tPlayer = GetPlayerFromIdentifier(bill[1].sender)
                if tPlayer ~= nil then
                    xPlayer.removeAccountMoney('bank', bill[1].amount)
                    tPlayer.addAccountMoney('bank', bill[1].amount)
                    cb({status = true, text = "Paid " .. bill[1].amount .. "$"})
                else 
                    cb({status = false, text = "Player not found"})
                end
            else
                cb({status = false, text = "Something went wrong"})
            end
        end)
    else
        cb({status = false, text = "You don't have enough money"})
    end
end)

ESX.RegisterServerCallback('ld-phone:GetVehicleFromPlate', function(source, cb, plate)
    local xPlayer = ESX.GetPlayerFromId(source)
    local result = Config.DatabaseStrings["executeSync"]("SELECT * FROM owned_vehicles WHERE plate = @plate", {
        ['@plate'] = plate
    })

    if result[1] ~= nil then
        if result[1].state or result[1].houseId then
            cb(result[1])
        else
            cb(false)
        end
    else
        cb(false)
    end
end)

ESX.RegisterServerCallback('ld-phone:GetPlayerVehicles', function(source, cb)
    local Vehicles = {}
    local src = source
    local xPlayer = ESX.GetPlayerFromId(src)
    local identifier = GetHexId(src)

    if xPlayer ~= nil then
        if identifier ~= nil then 
        local result = Config.DatabaseStrings["executeSync"]('SELECT * FROM '..Config.PlayerVehiclesSettings.DataTableName..' WHERE '..Config.PlayerVehiclesSettings.IdentifierColumnName..' = @identifier', {
            ['@identifier'] = xPlayer.identifier
        })

        for i = 1, #result do 
            local vehicle = json.decode(result[i][Config.PlayerVehiclesSettings.VehicleModsColumnName])
            table.insert(Vehicles, {
                plate = vehicle[Config.PlayerVehiclesSettings.VehicleModsPlateIndex],
                modelname = vehicle[Config.PlayerVehiclesSettings.VehicleModsModelIndex],
                state = result[i][Config.PlayerVehiclesSettings.StoredColumnName],
                fuel = vehicle.fuelLevel,
                Garage = result[i].Garage,
                houseId = result[i].houseId,
                engine = math.floor(vehicle.engineHealth / 10),
            })
        end
        cb(Vehicles)
        else
            print("[LD-PHONE] ERROR: Identifier is nil in GetPlayerVehicles")
            cb({})
        end
    else
        print("[LD-PHONE] ERROR: xPlayer nil in GetPlayerVehicles")
        cb({})
    end
end)


function getNumberPhone(identifier)
    local result = MySQL.Sync.fetchAll("SELECT users.phone_number FROM users WHERE users.identifier = @identifier", {
        ['@identifier'] = identifier
    })
    if result[1] ~= nil then
        return result[1].phone_number
    end
    return nil
end


function GetHexId(src)
	for k,v in ipairs(GetPlayerIdentifiers(src)) do
		if string.sub(v, 1, 5) == "steam" then
			return v
		end
	end
	
	return false
end

AddEventHandler('es:playerLoaded', function(source)
--    local identifier = GetHexId(sourcePlayer)
    local identifier = GetPlayerIdentifiers(source)[1]
    if identifier then
        getOrGeneratePhoneNumber(identifier, function(myPhoneNumber)
        end)
    end
end)

function getPlayerID(source)
    local identifiers = GetPlayerIdentifiers(source)
    local player = getIdentifiant(identifiers)
    return player
end
function getIdentifiant(id)
    for _, v in ipairs(id) do
        return v
    end
end

function getOrGeneratePhoneNumber(identifier, cb)
    print(identifier)
    local myPhoneNumber = getNumberPhone(identifier)
    if myPhoneNumber == nil then
        repeat
            myPhoneNumber = getPhoneRandomNumber(identifier)
            local id = GetPlayerFromPhone(myPhoneNumber, ESX)
            print(id)
        until id == nil
        print(myPhoneNumber, "[LD-PHONE] [INFORM] [A user created new number.]")
        exports['ghmattimysql']:execute('UPDATE users SET phone_number = @phone WHERE identifier = @identifier', {
            ['@identifier'] = identifier,
            ['@phone'] = myPhoneNumber
        })
        cb(myPhoneNumber)
    else
        cb(myPhoneNumber)
    end
end

-- function getOrGeneratePhoneNumber (sourcePlayer, identifier, cb)
--     local sourcePlayer = sourcePlayer
--     local identifier = identifier
--     local myPhoneNumber = getNumberPhone(identifier)
--     if myPhoneNumber == '0' or myPhoneNumber == nil then
--         repeat
--             myPhoneNumber = getPhoneRandomNumber()
--             local id = getIdentifierByPhoneNumber(myPhoneNumber)
--         until id == nil
--         MySQL.Async.insert("UPDATE users SET phone_number = @myPhoneNumber WHERE identifier = @identifier", { 
--             ['@myPhoneNumber'] = myPhoneNumber,
--             ['@identifier'] = identifier
--         }, function ()
--             cb(myPhoneNumber)
--         end)
--     else
--         cb(myPhoneNumber)
--     end
-- end

function getPhoneRandomNumber()
    local numBase0 = math.random(10,99)
    local numBase1 = math.random(100,999)
    local numBase2 = math.random(1000,9999)
    local num = "5"..numBase0..numBase1..numBase2
    return num
end

-- function getPhoneRandomNumber(identifier)
--     local numBase0 = 5
--     local numBase1 = math.random(30, 59)
--     local numBase2 = math.random(111, 999)
--     local numBase3 = math.random(1111, 9999)
--     local num = string.format(numBase0 .. "" .. numBase1 .. "" .. numBase2 .. "" .. numBase3)
--     print(identifier)
--     print(num, "[LD-PHONE] [INFORM] [A user created new number.]")
--     exports['ghmattimysql']:execute('UPDATE users SET phone_number = @phone WHERE identifier = @identifier', {
--         ['@identifier'] = identifier,
--         ['@phone'] = num
--     })
--     return num
-- end

function GetPlayerFromIdentifier(ide)
    local xPlayers = ESX.GetPlayers()
    for i=1, #xPlayers, 1 do
        local xPlayer = ESX.GetPlayerFromId(xPlayers[i])
        local iden = GetHexId(xPlayers[i])
        if iden == ide then
            return xPlayer
        end
    end
end

function GetPlayerFromPhone(phone, ESX)
    local result = Config.DatabaseStrings["executeSync"]('SELECT * FROM users WHERE phone_number = @phone', {
        ['@phone'] = phone
    })
    Citizen.Wait(300)
    if result[1] then
        local xPlayers = ESX.GetPlayers()
        for i=1, #xPlayers, 1 do
            local xPlayer = ESX.GetPlayerFromId(xPlayers[i])
            if xPlayer ~= nil then
                if result[1].identifier == xPlayer.identifier then
                    print("[LD-PHONE] Found player with phone " .. phone .. " and identifier " .. xPlayer.identifier)
                    return xPlayer
                end
            else
                print("[LD-PHONE] ERROR: xPlayer nil in GetPlayerFromPhone")
            end
        end
    else
        print("[LD-PHONE] ERROR: Target Identifier is nil in GetPlayerFromPhone")
    end

    return nil
end

function generateIBAN()
    local numBase0 = math.random(100, 999)
    local num = string.format(numBase0)
    local newIban = "LD"..num
    print(newIban, "[LD-PHONE] [INFORM] [A user created new iban.]")
    return newIban
end

function getIBAN(identifier)
    local result = Config.DatabaseStrings["executeSync"]("SELECT users.iban FROM users WHERE users.identifier = @identifier", {
        ['@identifier'] = identifier
    })
    if result[1] ~= nil then
        return result[1].iban
    end
    return nil
end