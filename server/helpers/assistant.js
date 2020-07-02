const low = require('lowdb');
const path = require('path');

const FileSync = require('lowdb/adapters/FileSync');
const dbAdapter = new FileSync(path.resolve('server/bin', 'db.json'));
const configAdapter = new FileSync(path.resolve('server/bin', 'config.json'));

const Conversation = require('google-assistant/components/conversation');

exports.sendTextInput = function (text, name) {
  return new Promise(async (res, rej) => {
    try {
      const db = await low(dbAdapter);
      const config = await low(configAdapter);
      const convo = await config.get('conversation').value();
      const users = await db.get('users').value();

      let nameToUse;
      convo.textQuery = text;

      if (users.length > 0) {
        if (!name) nameToUse = users[0].name;
        else nameToUse = name;
        const conversation = new Conversation(global.assistants[nameToUse], convo);
        res(conversation);
      }
      res();
    } catch (e) {
      rej(e);
    }
  });
};