Config = {
    OpenPhone = 'p',

    InventoryName = 'dev-inventory',

    Details = {
        Casino = {
            Enable = true,
            CasinoMoneyFunction = function(Framework, source)
                local xPlayer = Framework.GetPlayerFromId(source)
                return xPlayer.getAccount('casinochips').money
            end,
        },
        Bank = {
            BankMoneyFunction = function(Framework, source)
                local xPlayer = Framework.GetPlayerFromId(source)
                return xPlayer.getAccount('bank').money
            end,
        },
        Cash = {
            CashMoneyFunction = function(Framework, source)
                local xPlayer = Framework.GetPlayerFromId(source)
                return xPlayer.getMoney()
            end,
        },
    },

    GetSharedObject = function(callback)
        TriggerEvent('dev:getSharedObject', function(obj) callback(obj) end)
    end,

    PhoneCallSound = function()
       TriggerServerEvent("InteractSound_SV:PlayWithinDistance", 5, "ring2", 0.3)
    end,

    VehicleSpawnDelay = { -- Delay while spawning a vehicle (in seconds)
        min = 10,
        max = 20
    },
    CallRepeats = 7,
    DefaultJobs = { --- EXPERIMENTAL (NOT USEABLE FOR V1 RELEASE PLEASE WAIT UPDATES)
        ["garbage"] = {
            name = "Garbage Job",
            icon = "garbage",
            value = 1,
            informs = {
                [1] = {
                    text = "Go to the foreman",
                    value = 1,
                },
                [2] = {
                    text = "Get in the sanitation vehicle",
                    value = 1,
                },
                [3] = {
                    text = "Go to the assigned zone (Little Seoul)",
                    value = 1,
                },
                [4] = {
                    text = "Collect Trash",
                    value = 15,
                },
                [5] = {
                    text = "Go to the next zone (Terminal)",
                    value = 1,
                },
                [6] = {
                    text = "Collect Trash",
                    value = 15,
                },
            },
        },
    },

    VPNJobs = { --- EXPERIMENTAL (NOT USEABLE FOR V1 RELEASE PLEASE WAIT UPDATES)
        ["criminal"] = {
            name = "Criminal",
            icon = "criminal",
            value = 5,
        },
        ["darkshop"] = {
            name = "Dark Market",
            icon = "darkshop",
            value = 4,
        },
        ["impound"] = {
            name = "Impound Worker",
            icon = "impound",
            value = 5,
        },
    },

    DatabaseStrings = {
        ["executeSync"] = function(string, table)
            table = table or {}
            return exports["ghmattimysql"]:executeSync(string, table)
        end,
        ["execute"] = function(string, table, callback)
            table = table or {}
            exports["ghmattimysql"]:execute(string, table, function(rowsChanged)
                return callback(rowsChanged)    
            end)
        end,
    },

    VoiceChatSettings = {
        ScriptName = "pma-voice",
        AddPlayer = function(callId)
            exports['pma-voice']:addPlayerToCall(callId)
        end,
        RemovePlayer = function(callId)
            exports['pma-voice']:removePlayerFromCall(callId)
        end,
    },
    ItemCheck = function(Framework, callback)
        callback(true)
    end,


    VehicleStoredTrigger = function(plate)
        TriggerServerEvent('ld-phone:SetGarage', plate)
    end,
    
    Applications = {
        TaxiApp = {
            enable = true,
            name = "Downtown Cab",
            icon = "abdt.png",
            screenLogo = "https://i.imgur.com/N8WKYwD.png",
            taxiJob = "taxi",
        },
        ShowNotAvailableApps = {
            enable = true, -- if enable = false, then the app will not be shown. (btw you make this option true not available apps will be shown but didnt be useable.) 
            apps = { -- not available apps
                'employees',
                'lsbn',
                'jobcenter',
                'crypto',
                'camera',
                'documents',
            },
        },
    },

    UseApartments = false,
    UpdateHouseTrigger = function(level, callback)
        TriggerServerEvent("apartment:serverApartmentUpgrade", level, 5000)
        callback(true)
    end,

    Icons = {
        ["twitter"] = '<svg aria-hidden="true" focusable="false" data-prefix="fab" data-icon="twitter" class="svg-inline--fa fa-twitter fa-w-16 fa-fw fa-lg " role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M459.37 151.716c.325 4.548.325 9.097.325 13.645 0 138.72-105.583 298.558-298.558 298.558-59.452 0-114.68-17.219-161.137-47.106 8.447.974 16.568 1.299 25.34 1.299 49.055 0 94.213-16.568 130.274-44.832-46.132-.975-84.792-31.188-98.112-72.772 6.498.974 12.995 1.624 19.818 1.624 9.421 0 18.843-1.3 27.614-3.573-48.081-9.747-84.143-51.98-84.143-102.985v-1.299c13.969 7.797 30.214 12.67 47.431 13.319-28.264-18.843-46.781-51.005-46.781-87.391 0-19.492 5.197-37.36 14.294-52.954 51.655 63.675 129.3 105.258 216.365 109.807-1.624-7.797-2.599-15.918-2.599-24.04 0-57.828 46.782-104.934 104.934-104.934 30.213 0 57.502 12.67 76.67 33.137 23.715-4.548 46.456-13.32 66.599-25.34-7.798 24.366-24.366 44.833-46.132 57.827 21.117-2.273 41.584-8.122 60.426-16.243-14.292 20.791-32.161 39.308-52.628 54.253z"></path></svg>',
        ["debt"] = '<svg style="color: #ff1449" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="donate" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="svg-inline--fa fa-donate fa-w-16 fa-1x"><path fill="currentColor" d="M256 416c114.9 0 208-93.1 208-208S370.9 0 256 0 48 93.1 48 208s93.1 208 208 208zM233.8 97.4V80.6c0-9.2 7.4-16.6 16.6-16.6h11.1c9.2 0 16.6 7.4 16.6 16.6v17c15.5.8 30.5 6.1 43 15.4 5.6 4.1 6.2 12.3 1.2 17.1L306 145.6c-3.8 3.7-9.5 3.8-14 1-5.4-3.4-11.4-5.1-17.8-5.1h-38.9c-9 0-16.3 8.2-16.3 18.3 0 8.2 5 15.5 12.1 17.6l62.3 18.7c25.7 7.7 43.7 32.4 43.7 60.1 0 34-26.4 61.5-59.1 62.4v16.8c0 9.2-7.4 16.6-16.6 16.6h-11.1c-9.2 0-16.6-7.4-16.6-16.6v-17c-15.5-.8-30.5-6.1-43-15.4-5.6-4.1-6.2-12.3-1.2-17.1l16.3-15.5c3.8-3.7 9.5-3.8 14-1 5.4 3.4 11.4 5.1 17.8 5.1h38.9c9 0 16.3-8.2 16.3-18.3 0-8.2-5-15.5-12.1-17.6l-62.3-18.7c-25.7-7.7-43.7-32.4-43.7-60.1.1-34 26.4-61.5 59.1-62.4zM480 352h-32.5c-19.6 26-44.6 47.7-73 64h63.8c5.3 0 9.6 3.6 9.6 8v16c0 4.4-4.3 8-9.6 8H73.6c-5.3 0-9.6-3.6-9.6-8v-16c0-4.4 4.3-8 9.6-8h63.8c-28.4-16.3-53.3-38-73-64H32c-17.7 0-32 14.3-32 32v96c0 17.7 14.3 32 32 32h448c17.7 0 32-14.3 32-32v-96c0-17.7-14.3-32-32-32z" class=""></path></svg>',
        ["wenmo"] = '<svg style="color: #ff1449" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="donate" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="svg-inline--fa fa-donate fa-w-16 fa-1x"><path fill="currentColor" d="M256 416c114.9 0 208-93.1 208-208S370.9 0 256 0 48 93.1 48 208s93.1 208 208 208zM233.8 97.4V80.6c0-9.2 7.4-16.6 16.6-16.6h11.1c9.2 0 16.6 7.4 16.6 16.6v17c15.5.8 30.5 6.1 43 15.4 5.6 4.1 6.2 12.3 1.2 17.1L306 145.6c-3.8 3.7-9.5 3.8-14 1-5.4-3.4-11.4-5.1-17.8-5.1h-38.9c-9 0-16.3 8.2-16.3 18.3 0 8.2 5 15.5 12.1 17.6l62.3 18.7c25.7 7.7 43.7 32.4 43.7 60.1 0 34-26.4 61.5-59.1 62.4v16.8c0 9.2-7.4 16.6-16.6 16.6h-11.1c-9.2 0-16.6-7.4-16.6-16.6v-17c-15.5-.8-30.5-6.1-43-15.4-5.6-4.1-6.2-12.3-1.2-17.1l16.3-15.5c3.8-3.7 9.5-3.8 14-1 5.4 3.4 11.4 5.1 17.8 5.1h38.9c9 0 16.3-8.2 16.3-18.3 0-8.2-5-15.5-12.1-17.6l-62.3-18.7c-25.7-7.7-43.7-32.4-43.7-60.1.1-34 26.4-61.5 59.1-62.4zM480 352h-32.5c-19.6 26-44.6 47.7-73 64h63.8c5.3 0 9.6 3.6 9.6 8v16c0 4.4-4.3 8-9.6 8H73.6c-5.3 0-9.6-3.6-9.6-8v-16c0-4.4 4.3-8 9.6-8h63.8c-28.4-16.3-53.3-38-73-64H32c-17.7 0-32 14.3-32 32v96c0 17.7 14.3 32 32 32h448c17.7 0 32-14.3 32-32v-96c0-17.7-14.3-32-32-32z" class=""></path></svg>',
        ["messages"] = '<svg style="color: #ff1449" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="donate" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="svg-inline--fa fa-donate fa-w-16 fa-1x"><path fill="currentColor" d="M256 416c114.9 0 208-93.1 208-208S370.9 0 256 0 48 93.1 48 208s93.1 208 208 208zM233.8 97.4V80.6c0-9.2 7.4-16.6 16.6-16.6h11.1c9.2 0 16.6 7.4 16.6 16.6v17c15.5.8 30.5 6.1 43 15.4 5.6 4.1 6.2 12.3 1.2 17.1L306 145.6c-3.8 3.7-9.5 3.8-14 1-5.4-3.4-11.4-5.1-17.8-5.1h-38.9c-9 0-16.3 8.2-16.3 18.3 0 8.2 5 15.5 12.1 17.6l62.3 18.7c25.7 7.7 43.7 32.4 43.7 60.1 0 34-26.4 61.5-59.1 62.4v16.8c0 9.2-7.4 16.6-16.6 16.6h-11.1c-9.2 0-16.6-7.4-16.6-16.6v-17c-15.5-.8-30.5-6.1-43-15.4-5.6-4.1-6.2-12.3-1.2-17.1l16.3-15.5c3.8-3.7 9.5-3.8 14-1 5.4 3.4 11.4 5.1 17.8 5.1h38.9c9 0 16.3-8.2 16.3-18.3 0-8.2-5-15.5-12.1-17.6l-62.3-18.7c-25.7-7.7-43.7-32.4-43.7-60.1.1-34 26.4-61.5 59.1-62.4zM480 352h-32.5c-19.6 26-44.6 47.7-73 64h63.8c5.3 0 9.6 3.6 9.6 8v16c0 4.4-4.3 8-9.6 8H73.6c-5.3 0-9.6-3.6-9.6-8v-16c0-4.4 4.3-8 9.6-8h63.8c-28.4-16.3-53.3-38-73-64H32c-17.7 0-32 14.3-32 32v96c0 17.7 14.3 32 32 32h448c17.7 0 32-14.3 32-32v-96c0-17.7-14.3-32-32-32z" class=""></path></svg>',
        ["yellowpages"] = '<svg style="color: #ff1449" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="donate" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="svg-inline--fa fa-donate fa-w-16 fa-1x"><path fill="currentColor" d="M256 416c114.9 0 208-93.1 208-208S370.9 0 256 0 48 93.1 48 208s93.1 208 208 208zM233.8 97.4V80.6c0-9.2 7.4-16.6 16.6-16.6h11.1c9.2 0 16.6 7.4 16.6 16.6v17c15.5.8 30.5 6.1 43 15.4 5.6 4.1 6.2 12.3 1.2 17.1L306 145.6c-3.8 3.7-9.5 3.8-14 1-5.4-3.4-11.4-5.1-17.8-5.1h-38.9c-9 0-16.3 8.2-16.3 18.3 0 8.2 5 15.5 12.1 17.6l62.3 18.7c25.7 7.7 43.7 32.4 43.7 60.1 0 34-26.4 61.5-59.1 62.4v16.8c0 9.2-7.4 16.6-16.6 16.6h-11.1c-9.2 0-16.6-7.4-16.6-16.6v-17c-15.5-.8-30.5-6.1-43-15.4-5.6-4.1-6.2-12.3-1.2-17.1l16.3-15.5c3.8-3.7 9.5-3.8 14-1 5.4 3.4 11.4 5.1 17.8 5.1h38.9c9 0 16.3-8.2 16.3-18.3 0-8.2-5-15.5-12.1-17.6l-62.3-18.7c-25.7-7.7-43.7-32.4-43.7-60.1.1-34 26.4-61.5 59.1-62.4zM480 352h-32.5c-19.6 26-44.6 47.7-73 64h63.8c5.3 0 9.6 3.6 9.6 8v16c0 4.4-4.3 8-9.6 8H73.6c-5.3 0-9.6-3.6-9.6-8v-16c0-4.4 4.3-8 9.6-8h63.8c-28.4-16.3-53.3-38-73-64H32c-17.7 0-32 14.3-32 32v96c0 17.7 14.3 32 32 32h448c17.7 0 32-14.3 32-32v-96c0-17.7-14.3-32-32-32z" class=""></path></svg>',
        ["phone"] = [[<svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="phone-alt" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="svg-inline--fa fa-phone-alt fa-w-16 fa-1x"><path fill="currentColor" d="M497.39 361.8l-112-48a24 24 0 0 0-28 6.9l-49.6 
        60.6A370.66 370.66 0 0 1 130.6 204.11l60.6-49.6a23.94 23.94 0 0 0 6.9-28l-48-112A24.16 24.16 0 0 0 122.6.61l-104 24A24 24 0 0 0 0 48c0 256.5 207.9 464 
        464 464a24 24 0 0 0 23.4-18.6l24-104a24.29 24.29 0 0 0-14.01-27.6z" class=""></path></svg>]]
    },


    PlayerBillingSettings = {
        DataTableName = "billing",
        IdentifierColumnName = "identifier",
        IDColumnName = "id",
    },

    PlayerVehiclesSettings = {
        DataTableName = "owned_vehicles",
        IdentifierColumnName = "owner",
        StoredColumnName = "state",
        VehicleModsColumnName = "vehicle",
        VehicleModsPlateIndex = "plate",
        VehicleModsModelIndex = "model",
        --local vehicle = json.decode(result[i][Config.PlayerVehiclesSettings.VehicleModsColumnName])
        --local plate = vehicle[Config.PlayerVehiclesSettings.VehicleModsPlateIndex] (this is example of how to get plate from vehicle in default settings.)
    },

    UsePlayerLicenses = true, -- Use license system in details
    PlayerLicensesSettings = {
        DataTableName = "user_licenses", -- Name of the table in the database
        IdentifierColumnName = "owner", -- Name of the identifier column in the database
        LicenseColumnName = "type", -- Name of the license column in the database
        Licenses = {
            ["dmv"] = "DMV License",
            ["drive_bike"] = "Driving License (Bike)",
            ["drive_truck"] = "Driving License (Truck)",
            ["drive"] = "Driving License (Car)",
            ["Bar"] = "Bar Exam",
            ["Business"] = "Business License",
            ["boat"] = "Boating License",
            ["drift"] = "Drift License",
            ["fishing"] = "Fishing License",
            ["helicopter"] = "Helicopter License",
            ["plane"] = "Plane License",
            ["hunting"] = "Hunting License",
            ["simp"] = "Simping License",
            ["weapon"] = "weapon License",
            ["weapon2"] = "weapon2 License",
            ["weapon3"] = "weapon3 License",
            ["weed_medical"] = "Medical License",
            ["weed_processing"] = "Processing License",
        },
    },

    PingTime = 30, -- Time in seconds
    VPNItem = "vpnxj",
    VPNEnableForceClose = true, -- If you don't want it to turn off when the time is up set this to false
    VPNTime = 120, -- Time in seconds
}

--[[
                                               .         .                                             
         .8.          8 8888                  ,8.       ,8.          8 8888888888    8888888888',8888' 
        .888.         8 8888                 ,888.     ,888.         8 8888                 ,8',8888'  
       :88888.        8 8888                .`8888.   .`8888.        8 8888                ,8',8888'   
      . `88888.       8 8888               ,8.`8888. ,8.`8888.       8 8888               ,8',8888'    
     .8. `88888.      8 8888              ,8'8.`8888,8^8.`8888.      8 888888888888      ,8',8888'     
    .8`8. `88888.     8 8888             ,8' `8.`8888' `8.`8888.     8 8888             ,8',8888'      
   .8' `8. `88888.    8 8888            ,8'   `8.`88'   `8.`8888.    8 8888            ,8',8888'       
  .8'   `8. `88888.   8 8888           ,8'     `8.`'     `8.`8888.   8 8888           ,8',8888'        
 .888888888. `88888.  8 8888          ,8'       `8        `8.`8888.  8 8888          ,8',8888'         
.8'       `8. `88888. 8 888888888888 ,8'         `         `8.`8888. 8 888888888888 ,8',8888888888888  


#######################################################################################################]]