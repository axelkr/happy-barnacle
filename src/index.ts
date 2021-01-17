import {Server} from './Server';
import {Database} from './Database';

const db = new Database("objectEventStore.db");
const runServer = new Server(db);
runServer.start(8000);
