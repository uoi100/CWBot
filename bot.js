const botSettings = require("./botsettings.json");
const Discord = require("discord.js");

const bot = new Discord.Client({disableEveryone: true});

// Standard Bot Features - Banning, Muting, Greeting, Roles
function msgStd(message)
{
	let args = message.content.split(" ");
	let cmd = args[0];
	let prefix = botSettings.prefix;
	
	// Remove the command from the args
	args = args.slice(1);
	
	if(cmd === `${prefix}kick`)
	{
		let hasKick = message.member.hasPermission("KICK_MEMBERS");
			
		let target = message.mentions.members.first();
		
		// Check if target exists
		if(target === undefined || target != args[0]){
			message.channel.send(`Invalid argument please use the following format:\n
				!kick @username reason.`);
			return;
		}
		
		let reason = message.content.slice(cmd.length + args[0].length + 2);
		
		if(hasKick)
		{
			target.kick(reason)
				.then(member => 
				{
					let embed = new Discord.RichEmbed()
						.setTitle("Kicked")
						.setAuthor(target.user.username, target.user.avatarURL)
						.setColor(0xFF0000)
						.setTimestamp()
						.setDescription(reason);
					
					message.channel.send({embed});
				})
				.catch(member =>
				{
					message.channel.send(`Unable to kick the user. Maybe they're above me in the hierarchy? :thinking:`)
				});
		}
		else
		{
			message.reply("You don't have the KICK_MEMBERS permission to kick someone.");
		}
	}

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