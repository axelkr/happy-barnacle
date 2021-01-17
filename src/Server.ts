import { Logger } from 'sitka';
import express from 'express';

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
        app.get('/objectEvent', (req,res) => {
            if (!req.query.hasOwnProperty('topic')) {
                res.status(400).send('parameter topic missing');
                return;
            }
            const objectEvents = this.db.query(req.query.topic as string);
            res.status(200).send(objectEvents);
        })
        app.post('objectEvent', (req,res) => {
            this.logger.debug("received: ", req.query);
            // TODO: validate input, extract payload
            const inputObjectEvent : ObjectEvent = {
                topic: req.query.topic as string,
                time: new Date(),
                id: parseInt(req.query.id as string),
                eventType: req.query.eventType as string,
                object: req.query.object as string,
                objectType: req.query.objectType as string,
                payload: new Map<string,string>()
            }
            const objectEvent = this.db.store(inputObjectEvent);
            res.status(200).send(objectEvent);
        })
        app.listen(PORT, () => {
            this.logger.debug(`Server is running at http://localhost:${PORT}`);
        });
    }

}