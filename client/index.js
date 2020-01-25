const yargs = require('yargs');
const request = require('request-promise-native');
const validUrl = require('valid-url');

const args = yargs
  .option('link', {
    description: 'link to be reduced',
    alias: 'l',
    type: 'string',
    default: '',
  })
  .option('address', {
    description: 'Full server address. For example: http://localhost:4000',
    alias: 'a',
    type: 'string',
    default: '',
  })
  .argv;

if (!validUrl.isUri(args.address)) {
  console.log('Invalid url.');
  process.exit(1);
}

const options = {
  method: 'post',
  json: true,
  body: {
    url: args.link
  },
  url: args.address,
};

request(options)
  .then((body) => {
    if (body.status === 'ok') {
      console.log(body.data.short);
    }

    if (body.status === 'error') {
      console.error('Got Error: ', body.errorText);
    }
  })
  .catch((err) => console.error('Something went wrong', err.message));
