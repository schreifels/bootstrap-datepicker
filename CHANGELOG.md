## (unreleased)

* Added a **remove** method, which unbinds datepicker events and removes datepicker DOM elements
* Converted tabs to spaces and made other whitespace changes
* Options passed in with data attributes now use hyphenated option names
* If the datepicker is bound to an input and you click in the input twice, the datepicker will no longer be hidden automatically
* Events have been renamed and namespaced for consistency with Bootstrap's Javascript conventions
* Any non-alphanumeric character (except underscore) can now be configured as a separator
* Smarter handling of user-inputted dates:
    * Accepts any separator character (not just the configured one)
    * Accepts four digit years even when expecting two digit years and vice-versa
* Improvements made to documentation
* When provided an option with both Javascript and a ```data``` attribute, bootstrap-datepicker now gives precedence to the ```data``` attribute
* minViewMode has been removed as an option
* If you select the header in years mode, it will take you back to days mode
