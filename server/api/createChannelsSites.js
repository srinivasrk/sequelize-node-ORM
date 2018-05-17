const db = require('../config/db');
var _ = require('underscore');
const csvparse = require('csv-parse');
var fs = require('fs-extra');
var path = require('path');

const force = true;
let active_csv_path = path.join(path.resolve(__dirname),'..','..','active_sites.csv');
let channels_path = path.join(path.resolve(__dirname),'..','..','channels.csv');

const channelModelKeys = ['measurement','units','location','method','generator','number']

let validateSitesRecord = (record,line_num,reject) => {
  if (record.length < 4) {
    reject(`expected 4 columns. file has ${record.length}`);
    return false;
  } else if (line_num == 1 && record[0] != "Site_ID") {
    reject('expected columns: Site_ID, Selected Project, Maintenance Assigned to, Current state name\n Check file format.\n');
    return false;
  }
  return true;
}

let validateChannelsRecord = (record,line_num,reject) => {
  if (record.length < 7) {
    reject(`expected 7 columns. file has ${record.length}`);
    return false;
  } else if (line_num == 1 && !('site' in record)) {
    reject('expected columns: site,generator,measurement,units,method,location,number\n Check file format.\n');
    return false;
  }
  return true;
}

let updateSitesWithRow = (row,transaction) => {
  let active = (row.state.substring(0,2) != "11");
  return db.Maintainer.findOrCreate({where: {name:row.maintainer}, transaction})
  .then(([maintainer,created]) => {
    return db.Site.findOrCreate({where: {name:row.site}, include: [{model:db.Maintainer,as:'maintainer'}], transaction})
    .then(([site,created]) => {
      let updateObj = {maintainer,active};
      //console.log(`updating with: ${JSON.stringify(updateObj)}`);
      return site.update({active},{transaction})
      .then(()=>site.setMaintainer(maintainer,{transaction})) // must be separate updates for some reason
      .then(()=>site.save({transaction}));
    }); // Site findOrCreate
  }); // Maintainer findOrCreate
}

let updateChannelWithRow = (row,transaction) => {
  // console.log(row);
  return db.Site.findOrCreate({where: {name:row.site}, transaction, defaults:{active:false}})
  .then(([site,created]) => {
    // console.log('found site: ' + site)
    let filter = _.extend(_.omit(row,'site'),{site_id:site.id}); // i hate this line.
    return db.Channel.findOrCreate({where:filter, include:[{model:db.Site,as:'site'}], transaction})
    .then(([channel,created]) => {
      return channel.update(row,{transaction})
      .then(()=>channel.setSite(site,{transaction}))
      .then(()=>channel.save({transaction}));
    });
  });
};

module.exports.updateSites = () => {
  return new Promise((resolve, reject) => {
    // start reading the Sites csv file:
    // for each line, get the site, the maintainer, and the status
    // findOrCreate the Maintainer({name}). then,
    // findOrCreate the Site({name}). update properties (maintainer, status)

    // TO DO:
    // - set all sites not in this file to "inactive" status
    // - keep local cache of maintainers to reduce db traffic
    // - error handling

    db.Site.sync({force})
    .then(() => db.Maintainer.sync({force}))
    .then(() => {
      return db.connection.transaction().then((transaction) => {
        let modelUpdateChain = Promise.resolve();
        var streamOK = true;
        let line_num = 0;
        var parser = csvparse();
        parser.on('readable', function(){
          let record = parser.read();
          if (!record) return;
          ++line_num;
          if (!validateSitesRecord(record,line_num,reject)) {
            streamOK = false;
            parser.destroy();
          }
          else if (line_num > 1) { // skip header row
            // open sites are anything other than "11"
            let row = _(['site','project','maintainer','state']).object(record); // zip up object
            if (row.maintainer.length == 0) {
              return;
            }
            modelUpdateChain = modelUpdateChain.then(() => updateSitesWithRow(row,transaction)); // append update-chain
          } // non-header line
        }); // on readable
        parser.on('error', (err) => {
          transaction.rollback();
          reject(err.message);
        });
        parser.on('finish', () => {
          console.log('stream finish')
          if (streamOK) {
            modelUpdateChain = modelUpdateChain.then(() => {
              transaction.commit();
              resolve();
            });
          }
          // if stream not ok, then 'error' would have been emitted, and the main promise rejected.
        });
        fs.createReadStream(active_csv_path).pipe(parser);
        // if streaming a file, i.e., with POST data:
        //parser.write(inStream);
        //parser.end();
        return modelUpdateChain;
      }); // transaction
    })
  });  // Promise
}; // updateSites





// parse channels data
// - make sure the site is present in the model
// - if not, then create it and set to inactive status
// - find or create channels as needed

module.exports.updateChannels = () => {
  return new Promise((resolve,reject) => {
    db.Channel.sync({force})
    .then(() => {
      return db.connection.transaction().then((transaction) => {
        let modelUpdateChain = Promise.resolve();
        var streamOK = true;
        let line_num = 0;
        var parser = csvparse({
          columns: ['site','generator','measurement','units','method','location','number'],
          ltrim: true,
          relax_column_count: true
        });
        parser.on('readable', function(){
          let record = parser.read();
          if (!record) return;
          ++line_num;
          if (!validateChannelsRecord(record,line_num,reject)) {
            streamOK = false;
            parser.destroy();
          }
          else if (line_num > 1) { // skip header row
            record = _(record).mapObject((v,k) => {
              if (k != 'site') {
                return v.toLowerCase()
              }
              else {
                return v;
              }
            });
            modelUpdateChain = modelUpdateChain.then(() => updateChannelWithRow(record,transaction)); // append update-chain
          } // non-header line
        }); // on readable
        parser.on('error', (err) => {
          transaction.rollback();
          reject(err.message);
        });
        parser.on('finish', () => {
          console.log('stream finish')
          if (streamOK) {
            modelUpdateChain = modelUpdateChain.then(() => {
              transaction.commit();
              resolve();
            });
          }
          // if stream not ok, then 'error' would have been emitted, and the main promise rejected.
        });
        fs.createReadStream(channels_path).pipe(parser);
        // if streaming a file, i.e., with POST data:
        //parser.write(inStream);
        //parser.end();
        return modelUpdateChain;
      }); // transaction
    })
  });
};
