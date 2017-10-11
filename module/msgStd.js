const botSettings = require("../botsettings.json");
const Discord = require("discord.js");

function msgHandle(bot, message)
{
	let args = message.content.split(" ");
	let cmd = args[0];
	let prefix = botSettings.prefix;
	
	// Remove the command from the args
	args = args.slice(1);
	
	if(cmd === `${prefix}kick`)
		kick(bot, message);
	if(cmd === `${prefix}ban`)
		ban(bot, message);
	
}

function kick(bot, message)
{
	let args = message.content.split(" ");
	let target = message.mentions.members.first();
	
	// Check if target exists
	if(target === undefined || target.user != args[1]){
		message.channel.send(`Invalid argument please use the following format:
		\`\`\`!kick @username reason.\`\`\``);
		return;
	}

	if(target.user === bot.user)
	{
		message.reply("Are you telling me to kick myself? :unamused:");
		return;
	}
	
	let hasKick = message.member.hasPermission("KICK_MEMBERS");
	let reason = message.content.slice(args[0].length + args[1].length + 2);
	
	if(hasKick)
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
	else
		message.reply("You don't have the KICK_MEMBERS permission to kick someone.");
	
}

function ban(bot, message)
{
	let args = message.content.split(" ");
	let target = message.mentions.members.first();
	
	// Check if target exists
	if(target === undefined || target.user != args[1]){
		message.channel.send(`Invalid argument please use the following format:
		\`\`\`!ban @username reason.\`\`\``);
		return;
	}

	if(target.user === bot.user)
	{
		message.reply("Are you telling me to ban myself? :unamused:");
		return;
	}
	
	let days = args[2];
	
	if(days % 1 != 0)
	{
		message.channel.send("Invalid day, please use whole numbers");
		return;
	}
	else if (days < 0 ){
		message.channel.send("Please use numbers equal to or larger than 0");
		return;
	}
	
	let hasBan = message.member.hasPermission("BAN_MEMBERS");
	let reason = message.content.slice(args[0].length + args[1].length + 2);
	
	if(hasBan)
		target.ban(reason, days)
			.then(member => 
			{
				let embed = new Discord.RichEmbed()
					.setTitle("Banned")
					.setAuthor(target.user.username, target.user.avatarURL)
					.setColor(0xFF0000)
					.setTimestamp()
					.setDescription(reason);
				
				message.channel.send({embed});
			})
			.catch(member =>
			{
				message.channel.send(`Unable to ban the user. Maybe they're above me in the hierarchy? :thinking:`)
			});
	else
		message.reply("You don't have the BAN_MEMBERS permission to ban someone.");
	
}

module.exports = msgHandle;