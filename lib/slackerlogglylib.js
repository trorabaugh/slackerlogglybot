var bkit = require('botkit');
console.log(bkit);
module.exports = {
    Botkit: bkit,
    slackbot: bkit.slackbot,
    facebookbot: bkit.facebookbot,
    twilioipmbot: bkit.twilioipmbot,
    botframeworkbot: bkit.botframeworkbot,
    consolebot: bkit.consolebot
};
