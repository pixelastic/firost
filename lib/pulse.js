import eventemitter2 from 'eventemitter2';

export const pulse = new eventemitter2.EventEmitter2({
  wildcard: true,
});
