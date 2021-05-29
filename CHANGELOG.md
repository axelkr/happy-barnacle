# 3.3.1
- fix: read correct parameter

# 3.3.0
- GET /objectEvents now supports pagination via the parameters limit (how many results to return at most) and start (index of first object to return in list of complete result set).

# 3.2.3
- latest versions of dependencies
- fix: query optional parameters correctly

# 3.2.2
- latest versions of dependencies

# 3.2.1
- latest versions of dependencies

# 3.2.0
- enable deletion of topics

# 3.1.2
- latest version

# 3.1.1
- fix: correct input validation

# 3.1.0
- REST API for topics

# 3.0.3
- fix: undefined origin means same origin ==> always trust those requests

# 3.0.2
- fix: cors options handle if called with an undefined origin

# 3.0.1
- fix: resource leak

# 3.0.0
- breaking change: don't provide object event types and conversion but reuse choicest-barnacle. This way other packages don't have to import this very package
- update to latest versions

# 2.1.2
- write event in expected format.

# 2.1.1
- rename event stream endpoint to /newObjectEvents as well

# 2.1.0
- clients can subscribe to server side events to receive newly stored object events at /newObjectEvents

# 2.0.0
- breaking change: only if client doesn't provide an event time, does the server set it. This enables loading kanban data from other sources.

# 1.1.4
- reduce package size further
- package can be loaded by node packages

# 1.1.3
- provide .d.ts files so package can be referenced from Typescript
- reduced package's content to bare minimum