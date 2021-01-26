=============
Release Notes
=============

v1.13.0
=======

- Added support for WebSockets. 
- Fixing multiple bugs with route handle argument injection.

v1.12.0
=======

- The @Config decorator can now specify an optional `path` argument that will inject the value of the configuration
    value at the provided path.
- `ObjectFactory.initialize` and `ObjectFactory.newInstance` are now async functions that return a `Promise`.
- Moved all route specific dependency injection code from `Server` to `ObjectFactory`.

v1.11.0
=======

- Added `@Init` decorator for performing post-IoC initialization during the start of the object lifecycle.

v1.10.1
=======

- Refactored all ACL data classes to use the new `@Model` decorator.

v1.10.0
=======

Upgraded all third-party dependencies.

v1.0.0
======

Initial release.