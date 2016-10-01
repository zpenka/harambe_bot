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

const clever_harambe = new Cleverbot(
  creds.clever_api.USER,
  creds.clever_api.KEY
);


clever_harambe.create((err, session) => {
    if (err) {
        return console.log('Cleverbot create fail.');
    }

    clever_harambe.setNick('Harambe');

    return console.log('Cleverbot create success.');
});

const harambe = Botkit.slackbot({
  debug: process.env.test || true,
  log: process.env.test || true,
});

harambe.spawn({
  token: process.env.token,
}).startRTM();

const registerResponse = (listenFor, say, context) => harambe.hears(listenFor, context, (bot, event) => bot.reply(event, say));

// Simple responses
registerResponse('favorite band', 'Harambe and the Gone Apes, obviously', on_mention);
registerResponse('you a wizard', 'No, I\'m obviously an ape', on_mention);
registerResponse(['thank you', 'thanks'], 'no problem, you beautiful person', on_mention);
registerResponse('favorite breakfast cereal', 'cheerios', on_mention);
registerResponse('do you like', 'no', on_mention);
registerResponse('lit', ':party_parrot: :fast_parrot: :slow_parrot: :sassy_parrot: :slow_parrot: :goth_parrot: GONE APE :exploding_parrot: :moonwalking_parrot: :aussie_parrot: :deal_with_it_parrot: :aussie_conga_line_parrot:', on_mention);

harambe.hears('rng', on_mention, (bot, event) => {
  const random_number = Math.floor(Math.random() * (999 - 1 + 1)) + 1;

  return bot.reply(event, `Here is a random number between 1 and 999: ${random_number}`);
});

harambe.hears('sup', on_mention, (bot, event) => {
    const greeting = (response, convo) => {
      convo.ask('nm, u? LOL :neverusethis:', (response, convo) => {
        convo.say('shut up');
        convo.next();
      });
    };

    bot.startConversation(event, greeting);
});

// Greet new users
harambe.on('user_channel_join', (bot, event) => {
  const channel = event.channel;
  const name = event.user_profile.first_name;
  const text = `Welcome to the forums, ${name}, my name is bosk1`;

  return bot.say({ text, channel });
});

// Set up clever bot NOTE: This is last for a reason, so it does not override the responses defined above
harambe.hears('', all, (bot, event) => {
  const event_type = event.event;
  const message = event.text;

  if (event_type === 'ambient') {
    // Roll the dice (1% chance dice <_<)
    const random_number = Math.floor(Math.random() * 99);

    // Filter out the majority (99%) of the ambient messages
    if (!(random_number === 0)) {
      return;
    }
  }

  return clever_harambe.ask(message, (err, response) => {
    if (err) {
      // Handle errors with cleverbot api call
      return console.log(`Cleverbot error: ${err}`);
    }

    return bot.reply(event, response);
  });
});
