# link_reducer

Test task for wonderobe

## Short description of task

Implement a service for shortening links (for example, bit.ly, goo.gl).
When a link is first created, the user is given a unique user ID for the link.
When you click on the shortened link, the user is redirected to original link,
for each link the number of clicks is saved.

## Usage

### Backend

`yarn run serve:prepareDB` - creates DB and starts migrations
`yarn run serve:start` - starts server

#### Possible errors

* `Invalid url` - invalid url
* `Link not found` - link not found

### Client

`node client/index.js --link=http://google.com
--address=http://localhost:5000` - runs client with params
`--link | -l` - link which will be reduced
`--address | -a` - link of link reducer service

#### Possible errors

* `Invalid url` - invalid url
