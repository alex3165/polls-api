import * as EventEmitter from 'events';

const Emitter = new EventEmitter();

export const listerner = (fn: any) => Emitter.on('poll', fn);
export const emit = (data: any) => Emitter.emit('poll', data);
