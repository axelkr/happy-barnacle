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