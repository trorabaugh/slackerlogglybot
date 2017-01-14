
/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  _________.__                 __                .____                        .__         
 /   _____/|  | _____    ____ |  | __ ___________|    |    ____   ____   ____ |  | ___.__.
 \_____  \ |  | \__  \ _/ ___\|  |/ // __ \_  __ \    |   /  _ \ / ___\ / ___\|  |<   |  |
 /        \|  |__/ __ \\  \___|    <\  ___/|  | \/    |__(  <_> ) /_/  > /_/  >  |_\___  |
/_______  /|____(____  /\___  >__|_ \\___  >__|  |_______ \____/\___  /\___  /|____/ ____|
        \/           \/     \/     \/    \/              \/    /_____//_____/      \/     
       _________                _____.__                                                  
       \_   ___ \  ____   _____/ ____\__| ____                                            
       /    \  \/ /  _ \ /    \   __\|  |/ ___\                                           
       \     \___(  <_> )   |  \  |  |  / /_/  >                                          
        \______  /\____/|___|  /__|  |__\___  /                                           
               \/            \/        /_____/ 

# Change the options below to match your environment
# Any place with <change_me> should be updated appropriately

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/


var BotConfigOptions = {};

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

module.exports = {
    options:BotConfigOptions 
};