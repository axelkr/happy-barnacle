import { Logger } from 'sitka';
import sqlite from 'better-sqlite3';

import { ObjectEvent, Topic } from 'choicest-barnacle';
import { ObjectEventDB } from './objectEventDB';
import { TopicDB } from './topicDB';
import { DBMappingService } from './DBMappingService';

export type OptionsQueryObjectEvents = { object?: string, objectType?: string, limit?: number, start: number };

export class Database {
    private logger: Logger;
    private db: sqlite.Database;
    private readonly mappingDBService = new DBMappingService();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    constructor(dbFileName: string, loggerConfig: any = { name: 'Database', level: Logger.Level.ERROR }) {
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
        const stmt = this.db.prepare('INSERT INTO topics(id, name ) VALUES (?, ?)');
        stmt.run(asTopicDB.id, asTopicDB.name);
    }

    public removeTopic(topic: Topic): void {
        const removeFromTopicTable = this.db.prepare('DELETE FROM topics where id = ?');
        removeFromTopicTable.run(topic.id);
        const removeFromObjectEventsTable = this.db.prepare('DELETE FROM objectEvents where topic = ?');
        removeFromObjectEventsTable.run(topic.id);
    }

    public queryTopics(): Topic[] {
        const dbStmt = this.db.prepare('SELECT * FROM topics');
        const dbEvents: TopicDB[] = dbStmt.all();

        const results: Topic[] = [];
        dbEvents.forEach(aTopicDB => { results.push(this.mappingDBService.toTopic(aTopicDB)) });
        return results;
    }

    public queryObjectEvents(topic: string, parameters?: OptionsQueryObjectEvents): ObjectEvent[] {
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
        let start = (parameters !== undefined && parameters.start !== undefined) ? parameters.start : 0;
        const unlimited = -1;
        let limit = (parameters !== undefined && parameters.limit !== undefined && parameters.limit > 0) ? parameters.limit : unlimited;
        const dbStmt = this.db.prepare(stmt);
        const dbEvents: ObjectEventDB[] = dbStmt.all(stmtParameters);

        const results: ObjectEvent[] = [];
        dbEvents.forEach(aObjEventDB => {
            if (start > 0) { // skip this element
                start = start - 1;
            } else if (limit === unlimited || limit > 0) {
                results.push(this.mappingDBService.toObjectEvent(aObjEventDB));
                if (limit > 0) {
                    limit = limit - 1;
                }
            }
        });
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
            name text NOT NULL)");
        createTopicsTable.run();
    }
}