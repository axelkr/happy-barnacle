import { Logger } from 'sitka';
import {ObjectEvent} from './objectEvent';

export class Database {
	private _logger: Logger;

	constructor() {
        this._logger = Logger.getLogger({ name: this.constructor.name });
        this._logger.debug(`DB started`);
    }
    
    public store(objectEvent:ObjectEvent): void {
    }

    public query(topic:string): ObjectEvent[] {
        return [];
    }
}