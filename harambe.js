'use strict';

const creds = {
  clever_api: {
    USER: process.env.CLEVER_API_USER,
    KEY: process.env.CLEVER_API_KEY,
  },
};

const people = {
  Zack: 'U2BQVDSGL',
  Tingle: 'U2BQHMQV6',
  Ryan: 'U2BQ4UJ3X',
  Jimmy: 'U2BRQ3CUE',
}

const on_mention = [
  'direct_message',
  'direct_mention',
  'mention',
];

const ambience = [
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
registerResponse('you a wizard', 'No, I\'m obviously a fucking ape', on_mention);
registerResponse(['thank you', 'thanks'], 'no problem, you beautiful motherfuck :weed:', on_mention);
registerResponse('favorite breakfast cereal', 'cheerios you cock choking motherfucker', on_mention);
registerResponse('best friend', 'satan', on_mention);
registerResponse('ape heaven', 'it fucking sucks you anus licking cunt', on_mention);
registerResponse('do you like', 'no, fuck that', on_mention);
registerResponse('lit', ':party_parrot: :fast_parrot: :slow_parrot: :sassy_parrot: :slow_parrot: :goth_parrot: GONE APE MUTHAFUCKAAS :exploding_parrot: :moonwalking_parrot: :aussie_parrot: :deal_with_it_parrot: :aussie_conga_line_parrot:', on_mention);

// Slightly more complex responses TODO refactor this somehow
harambe.hears('fuck you', on_mention, (bot, event) => {
  if (event.user === people.Ryan) {
    return bot.reply(event, 'god dammit Ryan you fucking chode, shut the fuck up');
  }

  return bot.reply(event, 'fuck you too');
});

harambe.hears('rng', on_mention, (bot, event) => {
  const random_number = Math.floor(Math.random() * (999 - 1 + 1)) + 1;

  return bot.reply(event, `Here is a random number between 1 and 999 you fucking shit: ${random_number}`);
});

harambe.hears('do you like me', on_mention, (bot, event) => {
  const person = event.user;
  const answer = person === people.Tingle ? 'no' : 'yes';

  return bot.reply(event, answer);
});

harambe.hears('love you', on_mention, (bot, event) => {
  if (event.user === people.Tingle) {
    return bot.reply(event, 'no, just no. fuck no.');
  }

  return bot.reply(event, ':heart:');
});

harambe.on('user_channel_join', (bot, event) => {
  const channel = event.channel;
  const name = event.user_profile.first_name;
  const text = `Welcome to the forums, ${name}, my name is bosk1, fuck you`;

  return bot.say({ text, channel });
});

harambe.hears(['sup'], on_mention, (bot, event) => {
    const greeting = (response, convo) => {
      convo.ask('nm, u? LOL :neverusethis:', (response, convo) => {
        convo.say('shut the fuck up');
        convo.next();
      });
    };

    bot.startConversation(event, greeting);
});

// Set up clever bot NOTE: These are last for a reason, so they do not override the responses defined above
// TODO: Refactor these two
harambe.hears('', ambience, (bot, event) => {
  const message = event.text;
  const random_number = Math.floor(Math.random() * 99);

  if (random_number === 0) {
    return clever_harambe.ask(message, (err, response) => {
        if (!err) {
            return bot.reply(event, response);
        } else {
            console.log(`Cleverbot err: ${err}`);
        }
    });
  }

  return;
});

harambe.hears('', on_mention, (bot, event) => {
  const message = event.text;

  return clever_harambe.ask(message, (err, response) => {
    if (err) {
      console.log(`Cleverbot err: ${err}`);
      return;
    }

    return bot.reply(event, response);
  });
});
