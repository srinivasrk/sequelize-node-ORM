const createChannelsSites = require('./server/api/createChannelsSites');

createChannelsSites().then(() => {
  console.log("FINISHED CHANNELS PROMISE")
});
