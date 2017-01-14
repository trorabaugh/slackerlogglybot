/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  _________.__                 __                .____                        .__         
 /   _____/|  | _____    ____ |  | __ ___________|    |    ____   ____   ____ |  | ___.__.
 \_____  \ |  | \__  \ _/ ___\|  |/ // __ \_  __ \    |   /  _ \ / ___\ / ___\|  |<   |  |
 /        \|  |__/ __ \\  \___|    <\  ___/|  | \/    |__(  <_> ) /_/  > /_/  >  |_\___  |
/_______  /|____(____  /\___  >__|_ \\___  >__|  |_______ \____/\___  /\___  /|____/ ____|
        \/           \/     \/     \/    \/              \/    /_____//_____/      \/ 

                                Using
          ______     ______     ______   __  __     __     ______
          /\  == \   /\  __ \   /\__  _\ /\ \/ /    /\ \   /\__  _\
          \ \  __<   \ \ \/\ \  \/_/\ \/ \ \  _"-.  \ \ \  \/_/\ \/
           \ \_____\  \ \_____\    \ \_\  \ \_\ \_\  \ \_\    \ \_\
            \/_____/   \/_____/     \/_/   \/_/\/_/   \/_/     \/_/
            
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ 
 
This is a sample Slack Loggly bot built with Botkit.

This bot demonstrates many of the core features of Botkit:

* Connect to Slack using the real time API
* Receive messages based on "spoken" patterns
* Reply to messages
* Use the conversation system to ask questions
* Use Loggly to log messages.
* Use Loggly to search for messages

# RUN THE BOT:

  Get a Bot token from Slack:

    -> http://my.slack.com/services/new/bot

  Get a Token from Loggly:
   
    -> https://<your_company>.loggly.com/tokens
    
  Modify the /lib/botconfig.js and add your slack and loggly tokens
  
  Modify the options accordingly
    
  Run the bot from the command line:

    token=<MY SLACK TOKEN> node slackloggly_bot.js

# USE THE BOT:

  Find your bot inside Slack to send it a direct message.
  
  Say: "Hello"

  The bot will reply "Hello!"

  Say: "who are you?"

  The bot will tell you its name, where it is running, and for how long.

  Make sure to invite your bot into other channels using /invite @<my bot>!

  Next try to log something
  
  Say: "@<your_botname> log <message you want to log>"
  
  The bot will say the message is logged. 
  
  Say: "@<your_botname> search <message to search for>"

# EXTEND THE BOT:

  Botkit has many features for building cool and useful bots!

  Read all about it here:

    -> http://howdy.ai/botkit
    -> http://slackerloggly.github.com

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

const https = require('https');
const querystring = require('querystring');
const botconfig = require('./lib/botconfig.js');

var winstonLogglyOptions = botconfig.options.WinstonLogglyOptions;
var searchOptions = botconfig.options.LogglySearchOptions;
var eventOptions = botconfig.options.LogglyEventOptions;
var slackOptions = botconfig.options.SlackOptions;
var slackToken = slackOptions.token;
if(process.env.token) {
   slackToken = process.env.token; 
}
var winston = require('winston');
require('winston-loggly');

winston.add(winston.transports.Loggly, winstonLogglyOptions);




if (!slackToken || slackToken == "<Enter_Your_Slack_Token>" || !winstonLogglyOptions.inputToken || winstonLogglyOptions.inputToken == "<loggly_customer_token>") {
    console.log('Error: Specify tokens in environment or fix your /lib/botconfig.js file');
    process.exit(1);
}

var Botkit = require('./lib/slackerlogglylib.js');
var os = require('os');

var controller = Botkit.slackbot({
    debug: true,
});

var bot = controller.spawn({
    token: slackToken
}).startRTM();


controller.hears(['note','^log '], 'direct_message,direct_mention,mention', function(bot, message) {

    bot.api.reactions.add({
        timestamp: message.ts,
        channel: message.channel,
        name: 'robot_face',
    }, function(err, res) {
        if (err) {
            bot.botkit.log('Failed to add emoji reaction :(', err);
        }
    });
    console.log('Logging the message', message.text);
    message.text = message.text.replace(/^log /,'')
    message.text = message.text.replace(/^note /,'')
    var dataToLog = JSON.stringify(message);
    console.log('Removed log word', dataToLog);
    winston.log('info', dataToLog);
    bot.reply(message,
            ':robot_face: I have logged your message.');
});


controller.hears(['hello', 'hi'], 'direct_message,direct_mention,mention', function(bot, message) {

    bot.api.reactions.add({
        timestamp: message.ts,
        channel: message.channel,
        name: 'robot_face',
    }, function(err, res) {
        if (err) {
            bot.botkit.log('Failed to add emoji reaction :(', err);
        }
    });


    controller.storage.users.get(message.user, function(err, user) {
        if (user && user.name) {
            bot.reply(message, 'Hello ' + user.name + '!!');
        } else {
            bot.reply(message, 'Hello.');
        }
    });
});

controller.hears(['call me (.*)', 'my name is (.*)'], 'direct_message,direct_mention,mention', function(bot, message) {
    var name = message.match[1];
    controller.storage.users.get(message.user, function(err, user) {
        if (!user) {
            user = {
                id: message.user,
            };
        }
        user.name = name;
        controller.storage.users.save(user, function(err, id) {
            bot.reply(message, 'Got it. I will call you ' + user.name + ' from now on.');
        });
    });
});

controller.hears(['what is my name', 'who am i'], 'direct_message,direct_mention,mention', function(bot, message) {

    controller.storage.users.get(message.user, function(err, user) {
        if (user && user.name) {
            bot.reply(message, 'Your name is ' + user.name);
        } else {
            bot.startConversation(message, function(err, convo) {
                if (!err) {
                    convo.say('I do not know your name yet!');
                    convo.ask('What should I call you?', function(response, convo) {
                        convo.ask('You want me to call you `' + response.text + '`?', [
                            {
                                pattern: 'yes',
                                callback: function(response, convo) {
                                    // since no further messages are queued after this,
                                    // the conversation will end naturally with status == 'completed'
                                    convo.next();
                                }
                            },
                            {
                                pattern: 'no',
                                callback: function(response, convo) {
                                    // stop the conversation. this will cause it to end with status == 'stopped'
                                    convo.stop();
                                }
                            },
                            {
                                default: true,
                                callback: function(response, convo) {
                                    convo.repeat();
                                    convo.next();
                                }
                            }
                        ]);

                        convo.next();

                    }, {'key': 'nickname'}); // store the results in a field called nickname

                    convo.on('end', function(convo) {
                        if (convo.status == 'completed') {
                            bot.reply(message, 'OK! I will update my dossier...');

                            controller.storage.users.get(message.user, function(err, user) {
                                if (!user) {
                                    user = {
                                        id: message.user,
                                    };
                                }
                                user.name = convo.extractResponse('nickname');
                                controller.storage.users.save(user, function(err, id) {
                                    bot.reply(message, 'Got it. I will call you ' + user.name + ' from now on.');
                                });
                            });



                        } else {
                            // this happens if the conversation ended prematurely for some reason
                            bot.reply(message, 'OK, nevermind!');
                        }
                    });
                }
            });
        }
    });
});


controller.hears(['shutdown'], 'direct_message,direct_mention,mention', function(bot, message) {

    bot.startConversation(message, function(err, convo) {

        convo.ask('Are you sure you want me to shutdown?', [
            {
                pattern: bot.utterances.yes,
                callback: function(response, convo) {
                    convo.say('Bye!');
                    convo.next();
                    setTimeout(function() {
                        process.exit();
                    }, 3000);
                }
            },
        {
            pattern: bot.utterances.no,
            default: true,
            callback: function(response, convo) {
                convo.say('*Phew!*');
                convo.next();
            }
        }
        ]);
    });
});


controller.hears(['uptime', 'identify yourself', 'who are you', 'what is your name'],
    'direct_message,direct_mention,mention', function(bot, message) {

        var hostname = os.hostname();
        var uptime = formatUptime(process.uptime());

        bot.reply(message,
            ':robot_face: I am a bot named <@' + bot.identity.name +
             '>. I have been running for ' + uptime + ' on ' + hostname + '.');

    });

function formatUptime(uptime) {
    var unit = 'second';
    if (uptime > 60) {
        uptime = uptime / 60;
        unit = 'minute';
    }
    if (uptime > 60) {
        uptime = uptime / 60;
        unit = 'hour';
    }
    if (uptime != 1) {
        unit = unit + 's';
    }

    uptime = uptime + ' ' + unit;
    return uptime;
}



//////// TOY STUFF

controller.hears('sysload',['direct_message,direct_mention,mention','message_received'],function(bot,message) {
    console.log(os.loadavg());
  return bot.reply(message, 'My load average is ' + os.loadavg());
});

controller.hears('systype',['direct_message,direct_mention,mention','message_received'],function(bot,message) {
   return bot.reply(message, 'My os type is ' + os.type());
});

controller.hears('sysmem',['direct_message,direct_mention,mention','message_received'],function(bot,message) {
  return bot.reply(message, 'My memory available is ' + os.freemem());
});

controller.hears('sysrel',['direct_message,direct_mention,mention','message_received'],function(bot,message) {
  return bot.reply(message, 'My os release is ' + os.release());
});

controller.hears('open the (.*) door',['direct_message,direct_mention,mention','message_received'],function(bot,message) {
  var doorType = message.match[1]; //match[1] is the (.*) group. match[0] is the entire group (open the (.*) doors).
  console.log('DOOR TYPE'+doorType);
  if (doorType === 'fucking') {
    return bot.reply(message, 'Im a bot I can open stuff but I can\'t fuck stuff.');
  } else if(doorType === 'sliding') {
      return bot.reply(message, 'Okay I will open the sliding doors');
  } else if(doorType === 'backdoor') {
    return bot.reply(message, 'Okay I will open the sliding doors');
    
  }
  return bot.reply(message, 'Okay I will open the ' + doorType);
});


//////// LOGGLY STUFF

controller.hears(['search'], 'direct_message,direct_mention,mention', function(bot, message) {
    var searchString = message.text.replace(/^search /,'');
    var origSearchMessage = message.text.replace(/^search /,'');
    searchString = querystring.escape(searchString);
    searchOptions.path = '/apiv2/search?q=';
    searchOptions.path += searchString;
    searchOptions.path += '&from=-2h&until=now&size=10';
    console.log('Request Search Path', searchOptions);
    var req = https.request(searchOptions, (res) => {
        //console.log('statusCode: ', res.statusCode);
        //console.log('headers: ', res.headers);

        res.on('data', (d) => {
            //process.stdout.write(d);
            var searchDataResp = JSON.parse(d);
            console.log('Search Data Resp', searchDataResp);
            console.log('RSID EventID', searchDataResp.rsid.id);
            eventOptions.path = '/apiv2/events?rsid=';
            eventOptions.path += searchDataResp.rsid.id;
            console.log('Request Event Path', eventOptions);
            var req2 = https.request(eventOptions, (res) => {
                    //console.log('statusCode: ', res.statusCode);
                    //console.log('headers: ', res.headers);
                       
                    res.on('data', (eventData) => {
                        
                        bot.reply(message, "Events Found for '" + origSearchMessage + "'");
                        //process.stdout.write(d);
                        var eventDataResp = JSON.parse(eventData);
                        console.log('getLogglyEventData', eventDataResp);
                        var totalEvents = eventDataResp.total_events;
                        var eventsList = eventDataResp.events;
                        console.log(eventsList);
                        
                        bot.reply(message, JSON.stringify(eventDataResp, null, 4));
                    });
            });
            req2.end();
        
            req2.on('error', (e) => {
                console.error(e);
            });
        });
    });
    req.end();

    req.on('error', (e) => {
        console.error(e);
    });
    
    
});

