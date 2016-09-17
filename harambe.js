const Botkit = require('botkit');

const controller = Botkit.slackbot({
  debug: process.env.test || true,
  log: process.env.test || true,
});

controller.spawn({
  token: process.env.token,
}).startRTM();

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
registerResponse('fuck you', 'fuck you too', on_mention);
registerResponse('favorite band', 'Harambe and the Gone Apes, obviously', on_mention);
registerResponse('you a wizard', 'No, I\'m obviously a fucking ape', on_mention);
registerResponse('gone ape', 'AWWW YEAA', ambience);
registerResponse('tingle', 'fuck that guy', ambience);

// Random Number Generator
controller.hears('rng', on_mention, (harambe, event) => {
  const random_number = Math.floor(Math.random() * (999 - 1 + 1)) + 1;

  return harambe.reply(event, `Here's a random number between 1 and 999 you fucking shit: ${random_number}`);
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

    harambe.startConversation(event, first);
});

