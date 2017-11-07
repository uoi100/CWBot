const botSettings = require("./botsettings.json");
const Discord = require("discord.js");
const sql = require("sqlite");
const funcStd = require("./module/msgStd.js")
sql.open("./sql.sqlite");

const bot = new Discord.Client({disableEveryone: true});

// Standard Bot Features - Banning, Muting, Greeting, Roles
function msgStd(message)
{	
	funcStd(bot, message);
}

// Leveling System
function msgLevel(message)
{
	let expPoints = message.content.length;
	
	sql.get(`SELECT * FROM exptable WHERE userId = "${message.author.id}"`)
	.then(row => {
		if(!row)
			sql.run("INSERT INTO exptable (userID, exp, level) VALUES (?, ?, ?)", [message.author.id, expPoints, 0]);
		else
		{
			sql.run(`UPDATE exptable SET exp = ${row.exp + expPoints} WHERE userID = ${message.author.id}`);
		
			let curLevel = Math.floor(0.1 * Math.sqrt(row.exp + 1));
			if(curLevel > row.level)
			{
				row.level = curLevel;
				sql.run(`UPDATE exptable SET exp = 0, level = ${row.level} WHERE userID = ${message.author.id}`);
				message.reply(`You've leveled up to level ${curLevel}!`);
			}
		}

	})
	.catch(() => {
		console.error;
		
		sql.run("CREATE TABLE IF NOT EXISTS exptable (userID TEXT, exp INTEGER, level INTEGER)")
		.then(() => {
			sql.run("INSERT INTO exptable (userID, exp, level) VALUES (?, ?, ?)", [message.author.id, expPoints, 0]);
		});
	});
	
	let args = message.content.split(" ");
	let cmd = args[0];
	let prefix = botSettings.prefix;
	
	if(!cmd.startsWith(prefix)) return;
	// Remove the command from the args
	args = args.slice(1);
	
	if(cmd === `${prefix}level`)
	{
		sql.get(`SELECT * FROM exptable WHERE userId = "${message.author.id}"`)
		.then(row =>
		{
			if(!row) return message.reply("Your current level is 0.");
			message.reply(`Your current level is ${row.level}.`);
		});
	}
	
		if(cmd === `${prefix}exp`)
	{
		sql.get(`SELECT * FROM exptable WHERE userId = "${message.author.id}"`)
		.then(row =>
		{
			if(!row) return message.reply(`Your current exp is ${expPoints}.`);
			message.reply(`Your current exp is ${row.exp + expPoints}.`);
		});
	}
	
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
});

bot.on("message", async message => {
	if(message.author.bot) return;
	if(message.channel.type === "dm") return;
	
	// Standard Features
	msgStd(message);
	
	// Leveling
	//msgLevel(message);

	// Human Resource
	//msgHR(message);
	
	// Project
	//msgProject(message);
	
	// Rep System
	//msgRep(message);
});

bot.login(botSettings.token);