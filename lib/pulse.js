const { EventEmitter2 } = require('eventemitter2');
module.exports = new EventEmitter2({
  wildcard: true,
});
