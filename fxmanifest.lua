fx_version 'adamant'

game 'gta5'

ui_page 'html/ui.html'

client_scripts {
	'config.lua',
	'client/client.lua',
	'client/editable.lua',
	'client/animations.lua',
}

server_scripts {
	'@mysql-async/lib/MySQL.lua',
    'config.lua',
	'server/editable.lua',
    'server/server.lua',
}

files {
	'html/ui.html',
	'html/css/*.css',
	'html/moment.js',
	'html/script.js',
	'html/images/phone-icons/*.png',
}
