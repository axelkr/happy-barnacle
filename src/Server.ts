import { Logger } from 'sitka';
import express from 'express';
import cors from 'cors';

import { Database } from './Database';
import { ObjectEvent } from './objectEvent';
import { ObjectEventMappingService } from './objectEventMappingService';
import { ObjectEventREST } from './objectEventREST';

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
        app.get('/objectEvent', (req, res) => {
            if (!req.query.hasOwnProperty('topic')) { // eslint-disable-line no-prototype-builtins
                res.status(400).send('parameter topic missing');
                return;
            }
            const optionalParameters: { object?: string, objectType?: string } = {};
            if (!req.query.hasOwnProperty('object')) {// eslint-disable-line no-prototype-builtins
                optionalParameters.object = req.query.object as string;
            }
            if (!req.query.hasOwnProperty('objectType')) {// eslint-disable-line no-prototype-builtins
                optionalParameters.objectType = req.query.objectType as string;
            }
            const objectEvents = this.db.query(req.query.topic as string, optionalParameters);
            const asDBObjects: ObjectEventREST[] = [];
            objectEvents.forEach(objectEvent => {
                asDBObjects.push(this.objectEventMappingService.toObjectEventREST(objectEvent))
            })
            res.status(200).send(JSON.stringify(asDBObjects));
        })

        app.post('/objectEvent', (req, res) => {
            const validationErrors: string[] = this.validatePostedObjectEventREST(req.body);
            if (validationErrors.length > 0) {
                res.status(400).send(validationErrors[0]);
                return;
            }
            const inputBody = req.body;
            const idToBeDiscarded = 0;
            req.body.id = idToBeDiscarded;
            const dateToBeDiscarded = new Date();
            req.body.time = dateToBeDiscarded;

            const inputObjectEvent: ObjectEvent = this.objectEventMappingService.fromObjectEventREST(inputBody);
            const objectEvent = this.db.store(inputObjectEvent);
            res.status(200).send(this.objectEventMappingService.toObjectEventREST(objectEvent));
        });

        app.use(function (_req, res) {
            res.status(404).send();
        });

        app.listen(PORT, () => {
            this.logger.debug(`Server is running at http://localhost:${PORT}`);
        });
    }

    private validatePostedObjectEventREST(body: any): string[] { // eslint-disable-line @typescript-eslint/no-explicit-any
        const validationErrors: string[] = [];
        const nonNullStringProperties = ['topic', 'eventType', 'object', 'objectType', 'payload'];
        nonNullStringProperties.forEach(aPropertyName => {
            if (!this.hasNonNullStringProperty(body, aPropertyName)) {
                validationErrors.push('parameter ' + aPropertyName + ' missing');
            }
        });
        try {
            const parsedMap: Map<any, any> = JSON.parse(body["payload"]); // eslint-disable-line @typescript-eslint/no-explicit-any
            parsedMap.forEach((value, key) => {
                const keyIsOfTypeString = (typeof key === 'string' || key instanceof String);
                const valueIsOfTypeString = (typeof value === 'string' || value instanceof String);
                if (!keyIsOfTypeString || !valueIsOfTypeString) {
                    validationErrors.push('payload is not a stringied map of strings to strings');
                }
            })

        } catch (_error) {
            validationErrors.push('payload is not a stringied map of strings to strings');
        }
        return validationErrors;
    }

    private hasNonNullStringProperty(anObject: any, propertyName: string): boolean {// eslint-disable-line @typescript-eslint/no-explicit-any
        if (!anObject.hasOwnProperty(propertyName)) { // eslint-disable-line no-prototype-builtins
            return false;
        }
        const objectProperty = anObject[propertyName];
        return (typeof objectProperty === 'string' || objectProperty instanceof String) && (objectProperty !== undefined) && (objectProperty.length > 0);
    }

}