import { ObjectEvent } from './objectEvent';
import { ObjectEventDB } from './objectEventDB';
import { ObjectEventREST } from './objectEventREST';

export class ObjectEventMappingService {

  constructor() {
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

  public toObjectEventREST(objectEvent: ObjectEvent): ObjectEventREST {
    return {
        topic : objectEvent.topic,
        time: objectEvent.time,
        id: objectEvent.id,
        eventType: objectEvent.eventType,
        object: objectEvent.object,
        objectType: objectEvent.objectType,
        payload: JSON.stringify(Array.from(objectEvent.payload.entries()))
    }
}

public fromObjectEventREST(restObjectEvent: ObjectEventREST): ObjectEvent {
    const inputObjectEvent : ObjectEvent = {
        topic: restObjectEvent.topic as string,
        time: restObjectEvent.time as Date,
        id: restObjectEvent.id as number,
        eventType: restObjectEvent.eventType as string,
        object: restObjectEvent.object as string,
        objectType: restObjectEvent.objectType as string,
        payload: new Map<string,string>(JSON.parse(restObjectEvent.payload))
    }
    return inputObjectEvent;
}
}