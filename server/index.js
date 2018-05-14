
const createSites = require('./api/createSites');
const createChannels = require('./api/createChannels');
createSites().then(() => {
  console.log("FINISHED PROMISE");
  createChannels().then(() => {
    console.log("FINISHED CHANNELS PROMISE")
  });
});
