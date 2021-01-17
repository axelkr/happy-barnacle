import { Logger } from 'sitka';
import sqlite from 'better-sqlite3';

import {ObjectEvent} from './objectEvent';
import {ObjectEventDB} from './objectEventDB';
import {ObjectEventMappingService} from './objectEventMappingService';

export class Database {
	private logger: Logger;
    private db: sqlite.Database;
    private readonly fileName: string;
    private readonly mappingService : ObjectEventMappingService = new ObjectEventMappingService();

	constructor(dbFileName:string) {
        this.fileName = dbFileName;
        this.logger = Logger.getLogger({ name: this.constructor.name });
        this.initializeSqliteDatabase();
    }
    
    public store(objectEvent:ObjectEvent): ObjectEvent {
        objectEvent.time = new Date();
        const asObjectEventDB : ObjectEventDB = this.mappingService.toObjectEventDB(objectEvent);
        const stmt = this.db.prepare('INSERT INTO objectEvents(topic, time,eventType,object,objectType,payload) VALUES (?, ?, ?, ?, ?, ?)');
        const info = stmt.run(asObjectEventDB.topic,asObjectEventDB.time,asObjectEventDB.eventType,
                              asObjectEventDB.object,asObjectEventDB.objectType,asObjectEventDB.payload);
        objectEvent.id = parseInt(info.lastInsertRowid.toString());
        return objectEvent;
    }

    public query(topic:string): ObjectEvent[] {
        const stmt = this.db.prepare('SELECT * FROM objectEvents WHERE topic= ?');
        const eventsOfTopic = stmt.all(topic);
        const results : ObjectEvent[] = [];
        eventsOfTopic.forEach(aObjEventDB => {results.push(this.mappingService.toObjectEvent(aObjEventDB))});
        return results;
    }

    private initializeSqliteDatabase(){
        try {
            this.db = sqlite(this.fileName,{fileMustExist:true});
        } catch(e){
            this.logger.debug(`initializing new DB`);
            this.db = sqlite(this.fileName);
            const createObjectEventTable = this.db.prepare("CREATE TABLE objectEvents(id INTEGER PRIMARY KEY AUTOINCREMENT,\
                                                       topic text NOT NULL,\
                                                       time text NOT NULL,\
                                                       eventType text NOT NULL,\
                                                       object text NOT NULL,\
                                                       objectType text NOT NULL,\
                                                       payload text)");
            createObjectEventTable.run();
            this.db.prepare("CREATE INDEX topics ON objectEvents(topic)").run();
            this.db.prepare("CREATE INDEX objects ON objectEvents(object)").run();
        }
        this.logger.debug(`DB started`);
    }
}