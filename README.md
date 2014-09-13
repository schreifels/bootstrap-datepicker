# bootstrap-datepicker

bootstrap-datepicker is a lightweight, idiomatic library that covers the most common datepicker use cases. It is compatible with Bootstrap 3 and jQuery 2.x.

The code is about 8 kb minified and 3 kb minified and gzipped. Versions are released according to [Semantic Versioning](http://semver.org/).

This started as a fork of Stefan Petre's [bootstrap-datepicker](http://www.eyecon.ro/bootstrap-datepicker/), but the code has diverged significantly. If you're looking for internationalization, keyboard navigation, and other advanced features, see eternicode's [alternative fork](https://github.com/eternicode/bootstrap-datepicker).

## Usage

```
$('.datepicker').datepicker(options)
```

## Demo

https://schreifels.github.io/bootstrap-datepicker

## Methods

<dl>
  <dt>.datepicker(options)</dt>
  <dd>Initializes a datepicker.</dd>

  <dt>.datepicker('show')</dt>
  <dd>Shows the datepicker.</dd>

  <dt>.datepicker('hide')</dt>
  <dd>Hides the datepicker.</dd>

  <dt>.datepicker('remove')</dt>
  <dd>Removes the datepicker elements from the DOM and unbinds datepicker events.</dd>

  <dt>.datepicker('setDate', newDate[, skipFieldUpdate])</dt>
  <dd>Sets the datepicker's selected date to <code>newDate</code>, which should be a Date object. <code>skipFieldUpdate</code> (defaults to <code>false</code>) is a boolean indicating whether the input field should be updated (if one exists).</dd>

  <dt>.datepicker('setViewport', newViewport)</dt>
  <dd>Sets the viewport without changing the selected date. <code>newViewport</code> is a hash with two optional keys: <code>month</code> (an integer 0-11) and <code>year</code> (a four digit integer). For example, an argument of <code>{ month: 11, year: 2015 }</code> would set the viewport to December 2015.</dd>

  <dt>.datepicker('place')</dt>
  <dd>Updates the datepicker's position relative to the element.</dd>

  <dt>.datepicker('setMode', newMode)</dt>
  <dd>Sets the datepicker's viewport mode. <code>newMode</code> can be 'days', 'months', or 'years'.</dd>

  <dt>.datepicker('setPage', direction)</dt>
  <dd>Navigates the datepicker's viewport page forward or back. This works in any viewport mode. <code>direction</code> can be 'next' or 'prev'. Alternatively, the same effect can be achieved with the more robust <code>setViewport</code> method.</dd>
</dl>

## Options

Name              | Type     | Default      | Description
----------------- | -------- | ------------ | -----------
```format```      | string   | 'mm/dd/yyyy' | Date format; combination of 'd', 'dd', 'm', 'mm', 'yy', 'yyyy'; separator can be any non-alphanumeric character except underscore
```weekStart```   | integer  | 0            | First day of the week, 0-6; 0 for Sunday, 1 for Monday, etc.
```date```        | string   | Today's date | Default selected date; if datepicker is attached to an ```input``` element, it will ignore this option and use the value of the input

## Events

Event                           | Description
------------------------------- | -----------
```shown.bs.datepicker```       | Fired after the datepicker has been displayed to the user.
```hidden.bs.datepicker```      | Fired after the datepicker has been hidden from the user.
```dateChanged.bs.datepicker``` | Fired after the user enters or selects a date. The event contains ```date```, which is the newly set Date object.

## Retrieving the selected date

If you're looking to retrieve the Date object for the currently selected date, you may use:

```
$('#datepicker-element').data('date')
```

You can also get it from the event:

```
$('#datepicker-element').on('dateChanged.bs.datepicker', function(e) {
  console.log('The user just selected date: ' + e.date);
});
```
