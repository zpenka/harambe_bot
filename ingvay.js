'use strict';

const creds = {
  clever_api: {
    USER: process.env.CLEVER_API_USER,
    KEY: process.env.CLEVER_API_KEY,
  },
};

const on_mention = [
  'direct_message',
  'direct_mention',
  'mention',
];

const ambience = [
  'ambient',
];

const all = [
  'direct_message',
  'direct_mention',
  'mention',
  'ambient',
];

const Botkit = require('botkit');
const Cleverbot = require('cleverbot.io');

const clever_ingvay = new Cleverbot(
  creds.clever_api.USER,
  creds.clever_api.KEY
);


clever_ingvay.create((err, session) => {
    if (err) {
        return console.log('Cleverbot create fail.');
    }

    clever_ingvay.setNick('ingvay');

    return console.log('Cleverbot create success.');
});

const ingvay = Botkit.slackbot({
  debug: process.env.test || true,
  log: process.env.test || true,
});

ingvay.spawn({
  token: process.env.token,
}).startRTM();

const registerResponse = (listenFor, say, context) => ingvay.hears(listenFor, context, (bot, event) => bot.reply(event, say));

// Simple responses
registerResponse('favorite band', 'ingvay malmstein and the focking fury\'s, obviously', on_mention);
registerResponse('you a wizard', 'no i am obviously guitar protege', on_mention);
registerResponse(['thank you', 'thanks'], 'no porblem, u beautiful malmstein', on_mention);
registerResponse('favorite breakfast cereal', 'invay o\'s', on_mention);
registerResponse('do you like', 'no', on_mention);
registerResponse('lit', ':party_parrot: :fast_parrot: :slow_parrot: :sassy_parrot: :slow_parrot: :goth_parrot: ingvay :exploding_parrot: :moonwalking_parrot: :aussie_parrot: :deal_with_it_parrot: :aussie_conga_line_parrot:', on_mention);

ingvay.hears('rng', on_mention, (bot, event) => {
  const random_number = Math.floor(Math.random() * (999 - 1 + 1)) + 1;

  return bot.reply(event, `ingvay say: ${random_number}`);
});

ingvay.hears('sup', on_mention, (bot, event) => {
    const greeting = (response, convo) => {
      convo.ask('nm, u? LOL :neverusethis:', (response, convo) => {
        convo.say('shut up u');
        convo.next();
      });
    };

    bot.startConversation(event, greeting);
});

// Greet new users
ingvay.on('user_channel_join', (bot, event) => {
  const channel = event.channel;
  const name = event.user_profile.first_name;
  const text = `Welcome to the forums, ${name}!\nit me\ningvay malmstein`;

  return bot.say({ text, channel });
});

// Set up clever bot NOTE: This is last for a reason, so it does not override the responses defined above
ingvay.hears('', all, (bot, event) => {
  const event_type = event.event;
  const message = event.text;

  if (event_type === 'ambient') {
    // Roll the dice (1% chance dice <_<)
    const random_number = Math.floor(Math.random() * 99);

    if (random_number === 1) {
      return bot.reply(event, 'it me\ningvay malmstein');
    }

    // Filter out the majority of the ambient messages
    if (!(random_number === 0)) {
      return;
    }
  }

  return clever_ingvay.ask(message, (err, response) => {
    if (err) {
      // Handle errors with cleverbot api call
      return console.log(`Cleverbot error: ${err}`);
    }

    return bot.reply(event, response);
  });
});
