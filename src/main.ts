import { Server } from './Server';
import { Logger } from 'sitka';
import { Database } from './Database';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const loggerConfig: any = {name: 'happy-barnacle',level: Logger.Level.ALL};

const db = new Database("objectEventStore.db",loggerConfig);
const runServer = new Server(db,loggerConfig);
runServer.start(8000);
