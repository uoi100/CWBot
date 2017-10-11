const botSettings = require("./botsettings.json");
const Discord = require("discord.js");

const bot = new Discord.Client({disableEveryone: true});

// Standard Bot Features - Banning, Muting, Greeting, Roles
function msgStd(message)
{
	const funcStd = require("./module/msgStd.js");
	
	funcStd(bot, message);
}

// Leveling System
function msgLevel(message)
{

}

// Human Resource Manager
function msgHR(message)
{

}

// Project - Create, Join, List
function msgProject(message)
{

}

// Project
function msgRep(message)
{
	
}

bot.on("ready", async () => {
	console.log(`Bot is ready! ${bot.user.username}`);
	
	bot.generateInvite(["KICK_MEMBERS", "BAN_MEMBERS", "MANAGE_CHANNELS", "ATTACH_FILES", "READ_MESSAGE_HISTORY", "MANAGE_ROLES", "MUTE_MEMBERS", "DEAFEN_MEMBERS"]).then(link => {
		console.log(link);
	}).catch(err => {
		console.log(err.stack);
	});
	
	bot.on("message", async message => {
		if(message.author.bot) return;
		if(message.channel.type === "dm") return;
		
		let args = message.content.split(" ");
		let cmd = args[0];
		let prefix = botSettings.prefix;
		
		args = args.slice(1);
		
		if(!cmd.startsWith(prefix)) return;
		
		if(cmd === `${prefix}test`)
		{
			message.channel.send('Hello World!');
		}
		
		// Standard Features
		msgStd(message);
		
		// Leveling
		msgLevel(message);

		// Human Resource
		msgHR(message);
		
		// Project
		msgProject(message);
		
		// Rep System
		msgRep(message);
	})
});

bot.login(botSettings.token);