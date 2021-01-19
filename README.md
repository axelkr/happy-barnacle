# happy-barnacle aka ObjectEventStore
Happy-Barnacle provide a REST interface to store/retrieve object events.

## Object Event
An object event is an event which belong to one specific object. Nothing fancy, each event just carries an id of the object and the object's type in addition to the usual fields for a usual event sourcing. The class ObjectEvent has fields
* topic : GUID (non-null)
* time : Date (when event is stored in event store). Set by event store.
* id : number (strictly increases within topic). This uniquely identifies the event. Set by event store.
* type : string (to identify category of event, e.g. "CreateObject", non-null)
* object : GUID (non-null)
* objectType : String (non-null)
* payload: Map<String,String>

## ObjectEventStore
Class Server starts a REST interface. You can either start it in your environment or use index.ts to start it directly from the shell. The server allows Cross-Origin-Requests for calls originating from localhost.

### GET /objectEvent
Retrieve all objectEvents of a topic. Topic is a mandatory parameter. object and objectType are optional parameters.

### POST /objectEvent
Store a new objectEvent. No need to transfer an id or time for the event, as those will be set by the server. The server expects the payload to be encoded via 

### Encoding of payload for REST calls
Payload has to be encoded
~~~
JSON.stringify(Array.from(objectEvent.payload.entries()))
~~~
which can be converted back via
~~~
new Map<string, string>(JSON.parse(restObjectEvent.payload))
~~~