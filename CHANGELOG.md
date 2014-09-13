## 1.0.0

Initial release of this fork of Stefan Petre's [bootstrap-datepicker](http://www.eyecon.ro/bootstrap-datepicker/). Some of the noteable changes to the public API:

* Added methods ```remove```, ```setViewport```, ```setMode```, and ```setPage```
* Added ```setDate``` method, which behaves differently from the (now removed) ```setValue``` method
* Date object is stored in the ```date``` data attribute for programmatic access
* Removed the ```minViewMode``` and ```viewMode``` options
* Removed the ```onRender``` event
* Bootstrap 3 support
* Markup is more semantic (e.g. anchors are used for links)
* Event names now follow the Bootstrap convention
* CSS class names are namespaced with "datepicker-"
* CSS rewritten, about 60% smaller than the original code
* When provided an option in both the Javascript options hash and a ```data``` attribute, precedence is given to the ```data``` attribute
* Smarter handling of user-inputted dates:
  * Accepts any separator character (not just the configured one)
  * Accepts four digit years even when expecting two digit years and vice-versa
* Any non-alphanumeric character (except underscore) can now be configured as a separator
* Only listens for click events when the datepicker is visible
* Pressing tab or escape in a datepicker input will close the datepicker
* If you use the datepicker as an addon to an input group, the datepicker will be updated if the user types a date in the input
* If the datepicker is bound to an input and you double click on the input, the datepicker will be shown

There were many, many more changes to the internals, which were mostly rewritten.
