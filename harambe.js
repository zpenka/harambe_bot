'use strict';

const Botkit = require('botkit');

const controller = Botkit.slackbot({
  debug: process.env.test || true,
  log: process.env.test || true,
});

controller.spawn({
  token: process.env.token,
}).startRTM();

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

const registerResponse = (listenFor, say, context) => controller.hears(listenFor, context, (bot, event) => bot.reply(event, say));

// Simple responses
registerResponse('harambe', '#dicksoutforme', ambience);
registerResponse('favorite band', 'Harambe and the Gone Apes, obviously', on_mention);
registerResponse('you a wizard', 'No, I\'m obviously a fucking ape', on_mention);
registerResponse('gone ape', 'AWWW YEAA', ambience);
registerResponse('wtf', 'there is no reason to be upset', ambience);
registerResponse('thanks', 'no problem, you beautiful motherfuck :weed:', on_mention);
registerResponse('favorite breakfast cereal', 'cheerios you cock choking motherfucker', on_mention);
registerResponse('best friend', 'satan', on_mention);
registerResponse('ape heaven', 'it fucking sucks you anus licking cunt', on_mention);
registerResponse('is lit', ':party_parrot: :fast_parrot: :slow_parrot: :sassy_parrot: :slow_parrot: :goth_parrot: GONE APE MUTHAFUCKAAS :exploding_parrot: :moonwalking_parrot: :aussie_parrot: :deal_with_it_parrot: :aussie_conga_line_parrot:', on_mention);

controller.hears('fuck you', on_mention, (harambe, event) => {
  if (event.user === people.Ryan) {
    return harambe.reply(event, 'god dammit Ryan you fucking chode, shut the fuck up');
  }

  return harambe.reply(event, 'fuck you too');
});

controller.hears('love you', on_mention, (harambe, event) => {
  if (event.user === people.Tingle) {
    return harambe.reply(event, 'no, just no. fuck no.');
  }

  return harambe.reply(event, ':heart:');
});

controller.hears('sup', ambience, (harambe, event) => {
  if (event.user === people.Jimmy) {
    return harambe.reply(event, 'let me guess, you\'re here to tell us all about how great _Frames_ is. :bored_parrot:');
  }

  return harambe.reply(event, 'fuck you too');
});

// Random Number Generator
controller.hears('rng', on_mention, (harambe, event) => {
  const random_number = Math.floor(Math.random() * (999 - 1 + 1)) + 1;

  return harambe.reply(event, `Here is a random number between 1 and 999 you fucking shit: ${random_number}`);
});

// He still doesn't like Tingle
controller.hears('do you like me', on_mention, (harambe, event) => {
  const person = event.user;
  const answer = person === people.Tingle ? 'no' : 'yes';

  return harambe.reply(event, answer);
});


// Welcome new users
controller.on('user_channel_join', (harambe, event) => {
  const channel = event.channel;
  const name = event.user_profile.first_name;
  const text = `Welcome to the forums, ${name}, my name is bosk1, fuck you`;

  return harambe.say({ text, channel });
});

// Eloquence conversation
controller.hears(['be eloquent'], on_mention, (harambe, event) => {
    const first = (err, convo) => {
      convo.ask('How eloquent shall I be?', (response, convo) => {
        convo.say('Sounds good. Even though I am an ape, I can try my best.');
        second(response, convo);
        convo.next();
      });
    };

    const second = (response, convo) => {
      convo.ask('How eloquent are you?', (response, convo) => {
        convo.say('Ok.')
        third(response, convo);
        convo.next();
      });
    };

    const third = (response, convo) => {
      convo.ask('I think we can be great, eloquent friends. Do you agree?', (response, convo) => {
        convo.say('Ok! Good bye, shit eater.');
        convo.next();
      });
    };

    if (event.user === people.Tingle) {
      return harambe.reply(event, 'no, fuck you');
    }

    return harambe.startConversation(event, first);
});

// greeting conversation
controller.hears(['sup', 'hey', 'hello'], on_mention, (harambe, event) => {
    const greeting = (response, convo) => {
      convo.ask('nm, u? LOL :neverusethis:', (response, convo) => {
        convo.say('shut the fuck up');
        convo.next();
      });
    };

    harambe.startConversation(event, greeting);
});
