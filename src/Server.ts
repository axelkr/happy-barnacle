import { Logger } from 'sitka';
import express from 'express';
import cors from 'cors';

import {Database} from './Database';
import {ObjectEvent} from './objectEvent';

export class Server {
    private logger: Logger;
    private db: Database

	constructor(database: Database) {
        this.logger = Logger.getLogger({ name: this.constructor.name });
        this.db = database;
	}

	public start(PORT: number): void {
        const app = express();
        const corsOptions = {
            origin: function (origin:string, callback:any) {
              const fromLocalHost = origin.startsWith('http://localhost:') || origin == 'http://localhost';
              if (fromLocalHost) {
                callback(null, true)
              } else {
                callback(new Error('Not allowed by CORS'))
              }
            }
        }
        app.use(cors(corsOptions));
        app.use(express.json());
        var aLogger = this.logger;
        app.get('/objectEvent', (req,res) => {
            if (!req.query.hasOwnProperty('topic')) {
                res.status(400).send('parameter topic missing');
                return;
            }
            const objectEvents = this.db.query(req.query.topic as string);
            const asDBObjects :any[] = []
            objectEvents.forEach(objectEvent=>{
                asDBObjects.push({
                    topic : objectEvent.topic,
                    time: objectEvent.time,
                    id: objectEvent.id,
                    eventType: objectEvent.eventType,
                    object: objectEvent.object,
                    objectType: objectEvent.objectType,
                    payload: JSON.stringify(Array.from(objectEvent.payload.entries()))
                })
            })
            res.status(200).send(JSON.stringify(asDBObjects));
        })
        app.post('/objectEvent', (req,res) => {
            // TODO: validate input, extract payload
            const idToBeDiscarded = 0;
            const timeToBeDiscarded = new Date();
            const inputObjectEvent : ObjectEvent = {
                topic: req.body.topic as string,
                time: timeToBeDiscarded,
                id: idToBeDiscarded,
                eventType: req.body.eventType as string,
                object: req.body.object as string,
                objectType: req.body.objectType as string,
                payload: new Map<string,string>(JSON.parse(req.body.payload))
            }
            const objectEvent = this.db.store(inputObjectEvent);
            res.status(200).send({
                topic : objectEvent.topic,
                time: objectEvent.time,
                id: objectEvent.id,
                eventType: objectEvent.eventType,
                object: objectEvent.object,
                objectType: objectEvent.objectType,
                payload: JSON.stringify(Array.from(objectEvent.payload.entries()))
            });
        });
        app.use(function(req, res) {
            aLogger.debug(`404`);
            res.status(404).send();
          });
        app.listen(PORT, () => {
            this.logger.debug(`Server is running at http://localhost:${PORT}`);
        });
    }

}