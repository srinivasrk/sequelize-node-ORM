
const createChannelsSites = require('./api/createChannelsSites');

createChannelsSites().then(() => {
  console.log("FINISHED CHANNELS PROMISE")
});
