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
	{
		let hasKick = message.member.hasPermission("KICK_MEMBERS");
			
		let target = message.mentions.members.first();
		
		// Check if target exists
		if(target === undefined || target.user != args[0]){
			message.channel.send(`Invalid argument please use the following format:
			\`\`\`!kick @username reason.\`\`\``);
			return;
		}
	
		if(target.user === bot.user)
		{
			message.reply("Are you telling me to kick myself? :unamused:");
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

module.exports.msgHandle = msgHandle;