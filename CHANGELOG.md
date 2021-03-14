# v3.1.0
- REST API for topics

# v3.0.3
- fix: undefined origin means same origin ==> always trust those requests

# v3.0.2
- fix: cors options handle if called with an undefined origin

# v3.0.1
- fix: resource leak

# v3.0.0
- breaking change: don't provide object event types and conversion but reuse choicest-barnacle. This way other packages don't have to import this very package
- update to latest versions

# v2.1.2
- write event in expected format.

# v2.1.1
- rename event stream endpoint to /newObjectEvents as well

# v2.1.0
- clients can subscribe to server side events to receive newly stored object events at /newObjectEvents

# v2.0.0
- breaking change: only if client doesn't provide an event time, does the server set it. This enables loading kanban data from other sources.

# v1.1.4
- reduce package size further
- package can be loaded by node packages

# v1.1.3
- provide .d.ts files so package can be referenced from Typescript
- reduced package's content to bare minimum