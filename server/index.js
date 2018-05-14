
const createSites = require('./api/createSites');
const createChannels = require('./api/createChannels');
createChannels().then(() => {
  console.log("FINISHED CHANNELS PROMISE")
});
