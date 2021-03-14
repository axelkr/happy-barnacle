import { Logger } from 'sitka';
import sqlite from 'better-sqlite3';

import { ObjectEvent, Topic } from 'choicest-barnacle';
import { ObjectEventDB } from './objectEventDB';
import { TopicDB } from './topicDB';
import { DBMappingService } from './DBMappingService';

export class Database {
    private logger: Logger;
    private db: sqlite.Database;
    private readonly mappingDBService = new DBMappingService();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    constructor(dbFileName: string, loggerConfig: any = {name: 'Database',level: Logger.Level.ERROR}) {
        this.logger = Logger.getLogger(loggerConfig);
        this.initializeSqliteDatabase(dbFileName);
    }

    public storeObjectEvent(objectEvent: ObjectEvent): ObjectEvent {
        const asObjectEventDB = this.mappingDBService.toObjectEventDB(objectEvent);
        const stmt = this.db.prepare('INSERT INTO objectEvents(topic, time,eventType,object,objectType,payload) VALUES (?, ?, ?, ?, ?, ?)');
        const info = stmt.run(asObjectEventDB.topic, asObjectEventDB.time, asObjectEventDB.eventType,
            asObjectEventDB.object, asObjectEventDB.objectType, asObjectEventDB.payload);
        objectEvent.id = parseInt(info.lastInsertRowid.toString());
        return objectEvent;
    }

    public storeTopic(topic: Topic): void {
        const asTopicDB = this.mappingDBService.toTopicDB(topic);
        const stmt = this.db.prepare('INSERT INTO topics(id, name, isReadOnly ) VALUES (?, ?, ?)');
        stmt.run(asTopicDB.id, asTopicDB.name, asTopicDB.isReadOnly);
    }

    public queryTopics(): Topic[] {
        const dbStmt = this.db.prepare('SELECT * FROM topics');
        const dbEvents: TopicDB[] = dbStmt.all();

        const results: Topic[] = [];
        dbEvents.forEach(aTopicDB => { results.push(this.mappingDBService.toTopic(aTopicDB)) });
        return results;
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
        dbEvents.forEach(aObjEventDB => { results.push(this.mappingDBService.toObjectEvent(aObjEventDB)) });
        return results;
    }

    private initializeSqliteDatabase(dbFileName: string) {
        this.db = sqlite(dbFileName);
        this.initializeObjectEventsTable();
        this.initializeTopicsTable();
        this.logger.debug(`DB started`);
    }

    private initializeObjectEventsTable() {
        const objectEventsTableExists = 1 == (this.db.prepare("SELECT COUNT(name) as NumberObjectEventsTables FROM sqlite_master WHERE type='table' AND name='objectEvents'").get().NumberObjectEventsTables);
        if (objectEventsTableExists) {
            return;
        }

        this.logger.debug(`initializing table object events`);
        const createObjectEventTable = this.db.prepare("CREATE TABLE objectEvents(id INTEGER PRIMARY KEY AUTOINCREMENT,\
                                                       topic text NOT NULL,\
                                                       time text NOT NULL,\
                                                       eventType text NOT NULL,\
                                                       object text NOT NULL,\
                                                       objectType text NOT NULL,\
                                                       payload text)");
        createObjectEventTable.run();
        this.db.prepare("CREATE INDEX topicsInObjects ON objectEvents(topic)").run();
        this.db.prepare("CREATE INDEX objects ON objectEvents(object)").run();
    }

    private initializeTopicsTable() {
        const topicsTableExists = 1 == (this.db.prepare("SELECT COUNT(name) as NumberTopicsTables FROM sqlite_master WHERE type='table' AND name='topics'").get().NumberTopicsTables);
        if (topicsTableExists) {
            return;
        }
        this.logger.debug(`initializing table topics`);
        const createTopicsTable = this.db.prepare("CREATE TABLE topics(\
            id text PRIMARY KEY,\
            name text NOT NULL,\
            isReadOnly INTEGER NOT NULL)");
        createTopicsTable.run();
    }
}