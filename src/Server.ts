import { Logger } from 'sitka';
import express from 'express';
import cors from 'cors';

import { Database } from './Database';
import { ObjectEvent } from './objectEvent';
import { ObjectEventMappingService } from './objectEventMappingService';

export class Server {
    private logger: Logger;
    private db: Database
    private objectEventMappingService: ObjectEventMappingService = new ObjectEventMappingService();

    constructor(database: Database) {
        this.logger = Logger.getLogger({ name: this.constructor.name });
        this.db = database;
    }

    public start(PORT: number): void {
        const app = express();
        const corsOptions = {
            origin: function (origin: string, callback: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
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
        const aLogger = this.logger;
        app.get('/objectEvent', (req, res) => {
            if (!req.query.hasOwnProperty('topic')) { // eslint-disable-line no-prototype-builtins
                res.status(400).send('parameter topic missing');
                return;
            }
            const optionalParameters: any = {};
            if (!req.query.hasOwnProperty('object')) {// eslint-disable-line no-prototype-builtins
                optionalParameters.object = req.query.object;
            }
            if (!req.query.hasOwnProperty('objectType')) {// eslint-disable-line no-prototype-builtins
                optionalParameters.objectType = req.query.objectType;
            }
            const objectEvents = this.db.query(req.query.topic as string, optionalParameters);
            const asDBObjects: any[] = [] // eslint-disable-line @typescript-eslint/no-explicit-any
            objectEvents.forEach(objectEvent => {
                asDBObjects.push(this.objectEventMappingService.toObjectEventREST(objectEvent))
            })
            res.status(200).send(JSON.stringify(asDBObjects));
        })

        app.post('/objectEvent', (req, res) => {
            const inputBody = req.body;
            const idToBeDiscarded = 0;
            req.body.id = idToBeDiscarded;
            const dateToBeDiscarded = new Date();
            req.body.time = dateToBeDiscarded;

            const inputObjectEvent: ObjectEvent = this.objectEventMappingService.fromObjectEventREST(inputBody);
            const objectEvent = this.db.store(inputObjectEvent);
            res.status(200).send(this.objectEventMappingService.toObjectEventREST(objectEvent));
        });

        app.use(function (req, res) {
            aLogger.debug(`404`);
            res.status(404).send();
        });

        app.listen(PORT, () => {
            this.logger.debug(`Server is running at http://localhost:${PORT}`);
        });
    }
}