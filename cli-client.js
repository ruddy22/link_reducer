const yargs = require('yargs');
const request = require('request-promise-native');
const validUrl = require('valid-url');

const argv = yargs
  .option('link', {
    description: 'link to be reduced',
    alias: 'l',
    type: 'string',
    default: '',
  })
  .option('url', {
    description: 'Full server address. For example: http://localhost:4000',
    alias: 'u',
    type: 'string',
    default: '',
  })
  .argv;

if (!validUrl.isUri(argv.url)) {
  console.log('Invalid url.');
  process.exit(1);
}

const jsonData = {
  url: argv.link
};

const options = {
  method: 'post',
  json: true,
  body: jsonData,
  url: argv.url,
};

request(options)
       .then((err, httpResponse, body) => {
         console.log('err', err);
         console.log('hr ', httpResponse);
         console.log('body ', body);
       })
       .catch((err) => console.log('err 1', err.message));
