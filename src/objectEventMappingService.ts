import { Logger } from 'sitka';
import { ObjectEvent } from './objectEvent';
import { ObjectEventDB } from './objectEventDB';

export class ObjectEventMappingService {
  private logger: Logger;

	constructor() {
        this.logger = Logger.getLogger({ name: this.constructor.name });
	}

  public toObjectEventDB(objectEvent: ObjectEvent): ObjectEventDB {
    const convertedTime : string = "asd";
    const convertedPayload : string = "asd";
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
    const convertedTime = new Date();
    const convertedPayload = new Map<string,string>();
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