const Discord = require("discord.js");
const YTDL = require ("ytdl-core");

const TOKEN = "";
const PREFIX = "debbot!"

var bot = new Discord.Client();

var servers = {};

function play(connection, message){
	var server = servers[message.guild.id];
	
	server.dispatcher = connection.playStream(YTDL(server.queue[0], {filter: "audioonly"}));
	
	server.queue.shift();
	
	server.dispatcher.on("end", function() {
		if (server.queue[0]) play(connection, message);
		else connection.disconnect();
	});
}

bot.on("ready", function() {
	console.log("Ready");
});

bot.on("message", function(message) {
	if (message.author.equals(bot.user)) return;
	
	if (!message.content.startsWith(PREFIX)) return;
	
	var args = message.content.substring(PREFIX.length).split(" ");
	
	switch (args[0]) {
		case "ping":
		   message.channel.sendMessage("Pong! :ping_pong:");
		   break;   
		case "pong":
		   message.channel.sendMessage("Ping! :ping_pong:");
		   break;  
		case "info":
		   message.channel.sendMessage("Im a bot created by Ishi ( Ishi@3514 )");
		   break;
		case "profile":
		   message.channel.sendMessage(message.author.avatarURL);
		   break;       
		case "help":
		   message.channel.sendMessage("debbot!ping/debbot!pong/debbot!info/debbot!profile");
		   break;
		case "play":
		   if (!args[1]) {
			   message.channel.sendMessage("Please provide a link");
			   return;
		   }
		   
		   if(!message.member.voiceChannel) {
			   message.channel.sendMessage("You must be in a voice channel");
			   return;
		   }
		   
		   if(!servers[message.guild.id]) servers[message.guild.id] = {
			   queue: []
		   };
		   
		   var server = servers[message.guild.id];
		   
		   server.queue.push(args[1]);
		   
		   if (!message.guild.voiceConnection) message.member.voiceChannel.join().then(function(connection) {
			   play(connection, message);
		   });
		   break;
		case "skip":
           var server = servers[message.guild.id];
		   
		   if (server.dispatcher) server.dispatcher.end();
           break;		
	}
	

})

bot.on("ready", () => bot.user.setGame("debbot!help")) 

bot.login(TOKEN);
