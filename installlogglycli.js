var sys = require('util');
var exec = require('child_process').exec;
var separator = "\n########################################################\n";
    
    
var botconfig = require('./lib/botconfig.js');
//console.log(botconfig);
if(botconfig.options.LiveTailOptions.liveTailToken == '<lively_input_token>' || botconfig.options.LiveTailOptions.version == "") {
    var errtext = "Please update the ./lib/botconfig.js \n with your Loggly Lively Token and your customer domain";
    console.error(separator + errtext + separator);
    process.exit(0);
}

console.log(separator + "Notes: YOU MUST HAVE JAVA V7 update 25 or above installed for LiveTail to Work \n LiveTails CLI Client Uses Java");
console.log("If you need to install java on an ubuntu platform run:");
console.log("sudo add-apt-repository ppa:webupd8team/java");
console.log("sudo apt update; sudo apt install oracle-java8-installer" + separator);

var liveTailVersion = botconfig.options.LiveTailOptions.version;
var liveTailToken = botconfig.options.LiveTailOptions.liveTailToken;
var liveTailSlackURL = botconfig.options.SlackOptions.liveTailSlackURL;
var tailClientURL = "curl -O https://www.loggly.com/install/tailclient-" + liveTailVersion + "-install.zip";
liveTailSlackURL = liveTailSlackURL.replace(/\//g,'\\/');
var unzipTailClient = "unzip tailclient-" + liveTailVersion + "-install.zip";
var sedTokenIntoPropFile = "sed -i.orig 's/#tail.client.authtoken=.*/tail.client.authtoken=" + liveTailToken + "/' tailclient-" + liveTailVersion + "/conf/livetail.properties";
var sedLogglyWebHooksIntoPropFile = "sed -i.orig 's/#tail.client.im.url=.*/tail.client.im.url=" + liveTailSlackURL + "/' tailclient-" + liveTailVersion + "/conf/livetail.properties";
var mkdirLiveTailLog = "mkdir " + process.cwd() + "/tailclient-" + liveTailVersion + "/bin/log/";
var tchLiveTailLog = "touch " + process.cwd() + "/tailclient-" + liveTailVersion + "/bin/log/livertail.log";
var fullExeCmd = tailClientURL + ' && '; 
fullExeCmd += unzipTailClient + ' && '; 
fullExeCmd += sedTokenIntoPropFile + ' && '; 
fullExeCmd += sedLogglyWebHooksIntoPropFile + ' && ';
fullExeCmd += mkdirLiveTailLog + ' && ';
fullExeCmd += tchLiveTailLog;

var exec = require('child_process').exec;
function puts(error, stdout, stderr) { 
    if(error) { console.log(separator + 'Errors' + error); }
    console.log(separator + stderr);
    console.log(separator + 'STDOUT: ' + stdout + separator);
     
    
}

console.log(separator + 'INSTALLING LOGGLY CLI - You must have Java V7+ Installed');
console.log(separator + fullExeCmd + separator);
exec(fullExeCmd, puts);

//exec("cd tailclient-1.0.3/bin/");
//exec("./livetail -m \"<matcher pattern>\" -i \"<ignore pattern>\"");