import { Logger } from 'sitka';
import sqlite from 'better-sqlite3';

import { ObjectEvent } from './objectEvent';
import { ObjectEventDB } from './objectEventDB';
import { ObjectEventMappingService } from './objectEventMappingService';

export class Database {
    private logger: Logger;
    private db: sqlite.Database;
    private readonly mappingService: ObjectEventMappingService = new ObjectEventMappingService();

    constructor(dbFileName: string) {
        this.logger = Logger.getLogger({ name: this.constructor.name });
        this.initializeSqliteDatabase(dbFileName);
    }

    public store(objectEvent: ObjectEvent): ObjectEvent {
        const asObjectEventDB: ObjectEventDB = this.mappingService.toObjectEventDB(objectEvent);
        const stmt = this.db.prepare('INSERT INTO objectEvents(topic, time,eventType,object,objectType,payload) VALUES (?, ?, ?, ?, ?, ?)');
        const info = stmt.run(asObjectEventDB.topic, asObjectEventDB.time, asObjectEventDB.eventType,
            asObjectEventDB.object, asObjectEventDB.objectType, asObjectEventDB.payload);
        objectEvent.id = parseInt(info.lastInsertRowid.toString());
        return objectEvent;
    }

    public query(topic: string, parameters?: { object?: string, objectType?: string }): ObjectEvent[] {
        let stmt = 'SELECT * FROM objectEvents WHERE topic= ?';
        const stmtParameters: string[] = [topic];
        if (parameters !== undefined && parameters.object !== undefined) {
            stmt = stmt + " AND object = ?";
            stmtParameters.push(parameters.object);
        }
        if (parameters !== undefined && parameters.objectType !== undefined) {
            stmt = stmt + " AND objectType = ?";
            stmtParameters.push(parameters.objectType);
        }
        const dbStmt = this.db.prepare(stmt);
        const dbEvents: ObjectEventDB[] = dbStmt.all(stmtParameters);

        const results: ObjectEvent[] = [];
        dbEvents.forEach(aObjEventDB => { results.push(this.mappingService.toObjectEvent(aObjEventDB)) });
        return results;
    }

    private initializeSqliteDatabase(dbFileName: string) {
        this.db = sqlite(dbFileName);

        const objectEventsTableExists = 1 == (this.db.prepare("SELECT COUNT(name) as NumberObjectEventsTables FROM sqlite_master WHERE type='table' AND name='objectEvents'").get().NumberObjectEventsTables);
        if (!objectEventsTableExists) {

            this.logger.debug(`initializing new DB`);
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