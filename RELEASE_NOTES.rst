=============
Release Notes
=============

v2.12.0
=======

- `ModelRoute` now sends push notifications to downstream clients when executing `doCreate`, `doDelete` or `doUpdate`.

v2.11.0
=======

- Integrated ComposerJS v1.13.0 including WebSocket support.
- Rolling back TypeORM dependency to v0.2.28 to fix DNS lookup issue introduced with v0.2.29+.
- Fixing issue that caused `EventListenerManager` to register event listeners multiple times.
- Refactored event handler initialization code.
- Event listeners can now register for events using regular expressions.

v2.10.0
=======

- Integrated ComposerJS v1.12.0
- Fixed issues with background jobs not being fully initialized before server startup completes.
- Fixed issue with processing route handler classes that caused server to finish startup prematurely.
- Fixing various other issues.

v2.9.0
======

- Integrated ComposerJS v1.11.0

v2.8.0
======

- Integrated ComposerJS v1.10.1

v2.7.0
======

- Added `safe mode` to scripting system that will disable loading of all scripts stored in the database. This results
  in only scripts on the local file system to be loaded.

v2.6.0
======

- Added ability to disable scripts.

v2.5.0
======

- Integrated ComposerJS v1.7.3.
- Deleting scripts no longer remvoes entries from the database, instead marks them as deleted, so that they can be restored.
- Fixing issue that caused publishing scripts to create a new document version.
- Fixing database indexing for Script data model.
- Fixing issue with URL parsing.
- Script compiling now writes temporary files in their proper relative directory structure to preserve imports.

v2.4.0
======

- Scripting system can now accept `Buffer` or string types for script data.
- Scripting system now rejects `POST` and `PUT` operations on scripts that cannot be compiled.
- `ScriptUtils.import` is now an async function that returns a `Promise`.
- Refactored package dependencies.
- Added debug logging to `ObjectFactory`.
- Fixing issues with `ObjectFactory` calling destructor functions

v2.3.0
======

- Specifying a source path as the temporary script path will no longer overwite local files.

v2.2.0
======

- Integrated ComposerJS v1.7.0
- `ScriptManager` ignore list can now accept regular expression patterns

v2.1.0
======

- `ObjectFactory.newInstance` no longer requires class types to be pre-registered before instantiation.
- Various bug fixes
- Updated documentation

v2.0.0
======

- Introduced the new Live Scripting system. The Live Scripting system stores all application code into a configured
  `scripts` datastore and automatically retrieves and loads the code from the database at Server startup.
  In addition to being able to store code in the database, a new default REST API endpoint `/scripts` has been added
  to allow for the management of all stored scripts including the ability to define entirely new scripts.
- Added new event listener system. The event listener systems allows any class/function to be registered as an event
  listener. The event listener receives incoming events from the telemetry system on a redis pub/sub channel. These
  events are then processed by custom code automatically.