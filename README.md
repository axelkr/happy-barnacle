# happy-barnacle aka ObjectEventStore
Happy-Barnacle provide a REST interface to store/retrieve object events.

## Object Event
An object event is an event which belong to one specific object. Nothing fancy, each event just carries an id of the object and the object's type in addition to the usual fields for a usual event sourcing. The class ObjectEvent has fields
* topic : GUID
* time : Date (when event is stored in event store)
* id : number (strictly increases within topic). This uniquely identifies the event. Set by event store.
* type : string (to identify category of event, e.g. "CreateObject")
* object : GUID (non-null)
* objectType : String (non-null)
* payload: Map<String,String>

## ObjectEventStore
Class Server starts a REST interface. You can either start it in your environment or use index.ts to start it directly from the shell. The server allows Cross-Origin-Requests for calls originating from localhost.

### GET /objectEvent
Retrieve all objectEvents of a topic. Topic is a mandatory parameter.

### POST /objectEvent
Store a new objectEvent. 