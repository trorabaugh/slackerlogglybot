# Welcome to Slacker Loggly Bot

This is just a simple example of a Slacker Loggly Bot and is a demonstration 
of the integration of Loggly and Slack using Botkit.

This bot demonstrates many of the core features of Botkit:

- Connect to Slack using the real time API
- Receive messages based on "spoken" patterns
- Reply to messages
- Use the conversation system to ask questions
- Use Loggly to log messages.
- Use Loggly to search for messages
- Use Loggly LiveTail in order to stream messages to Slack

# Depends on:

```
  -> NodeJS
  -> botkit: ^0.4.7,
  -> winston-loggly: "^1.3.1"
  -> Loggly LiveTail (Token) CMD 
  -> Java If using LiveTail 
  
```

# RUN THE BOT:

## Get a Bot token from Slack:

    -> http://my.slack.com/services/new/bot

## Get a Token from Loggly:
   
    -> https://<your_company>.loggly.com/tokens

## INSTALL DEPENDENCIES
    
    -> npm install 
    -> npm run installlogglycli - This will install the loggly CLI LiveTail CMD utility. 
    
## Modify the /lib/botconfig.js and add your slack and loggly tokens
  
```
BotConfigOptions.SlackOptions = {
    token: "<Enter_Your_Slack_Token>"
}

BotConfigOptions.WinstonLogglyOptions = {
        "subdomain": "<loggly_customer_domain>",
        "inputToken": "<loggly_customer_token>",
        "auth": {
          "username": "<loggly_user_name>",
          "password": "<loggly_password>"
        },
        "tags": ["slackloggly"]
};


BotConfigOptions.LogglySearchOptions = {
    hostname: '<subdomain>.loggly.com',
    port: 443,
    method: 'GET',
    auth: "<loggly_user_name>:<loggly_password>"

};

BotConfigOptions.LogglyEventOptions = {
    hostname: '<subdomain>.loggly.com',
    port: 443,
    method: 'GET',
    auth: "<loggly_user_name>:<loggly_password>"
};

BotConfigOptions.LiveTailOptions = {
    "version":"1.0.3",
    "liveTailToken":"<loggly_livetail_token>"
};


```

## Modify the bot config options above accordingly
    
## Run the bot from the command line:

    -> node slackloggly_bot.js

# USE THE BOT:

  * Find your bot inside Slack to send it a direct message.
  
  ** Say: "Hello"

  ** The bot will reply "Hello!"

  * Say: "who are you?"

  ** The bot will tell you its name, where it is running, and for how long.

  * Make sure to invite your bot into other channels using /invite @<my bot>!

  * Next try to log something
  
  ** Say: "@<your_botname> log <message you want to log>"
  
  ** The bot will say the message is logged. 
  
  ** Say: "@<your_botname> search <message to search for>"
  
  ** Say: "@<your_botname> streamlogs -match=<match_string> -ignore=<ignore_string>
  
  ** Repeat above to see new message streams that match

# EXTEND THE BOT:

  * Botkit has many features for building cool and useful bots!

  * Read all about it here:

    ** [Howdy.ai](http://howdy.ai/botkit)
    
    ** [SlackerLoggly](http://slackerloggly.github.com)
