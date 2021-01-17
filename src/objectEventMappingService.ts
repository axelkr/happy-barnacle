import { Logger } from 'sitka';
import { ObjectEvent } from './objectEvent';
import { ObjectEventDB } from './objectEventDB';

export class ObjectEventMappingService {
  private logger: Logger;

	constructor() {
    this.logger = Logger.getLogger({ name: this.constructor.name });
	}

  public toObjectEventDB(objectEvent: ObjectEvent): ObjectEventDB {
    const convertedTime : string = objectEvent.time.toUTCString();
    const convertedPayload : string = JSON.stringify(Array.from(objectEvent.payload.entries()));
    return {
      topic: objectEvent.topic,
      time: convertedTime,
      id: objectEvent.id,
      eventType: objectEvent.eventType,
      object: objectEvent.object,
      objectType: objectEvent.objectType,
      payload: convertedPayload
    };
  }

  public toObjectEvent(objectEventDB: ObjectEventDB): ObjectEvent {
    const convertedTime = new Date(objectEventDB.time);
    const convertedPayload = new Map<string,string>(JSON.parse(objectEventDB.payload));
    return {
      topic: objectEventDB.topic,
      time: convertedTime,
      id: objectEventDB.id,
      eventType: objectEventDB.eventType,
      object: objectEventDB.object,
      objectType: objectEventDB.objectType,
      payload: convertedPayload
    };
  }
}