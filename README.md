# Welcome to Slacker Loggly Bot

This is just a simple example of a Slacker Loggly Bot

his is a sample Slack Loggly bot built with Botkit.

This bot demonstrates many of the core features of Botkit:

- Connect to Slack using the real time API
- Receive messages based on "spoken" patterns
- Reply to messages
- Use the conversation system to ask questions
- Use Loggly to log messages.
- Use Loggly to search for messages

# Depends on:
 ```
  -> "botkit": ^0.4.7,
  -> "winston-loggly": "^1.3.1"
```
# RUN THE BOT:

## Get a Bot token from Slack:

    -> http://my.slack.com/services/new/bot

## Get a Token from Loggly:
   
    -> https://<your_company>.loggly.com/tokens

## INSTALL DEPENDENCIES
    
    -> npm install 
    
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

# EXTEND THE BOT:

  * Botkit has many features for building cool and useful bots!

  * Read all about it here:

    ** [Howdy.ai](http://howdy.ai/botkit)
    
    ** [SlackerLoggly](http://slackerloggly.github.com)
