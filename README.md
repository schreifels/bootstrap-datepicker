# bootstrap-datepicker

This is a fork of Stefan Petre's [bootstrap-datepicker](http://www.eyecon.ro/bootstrap-datepicker/). There are a few improvements over the original:

* A new **remove** method, which removes datepicker events and DOM elements
* The code has been cleaned up for consistency, readability, and extensibility

See the [changelog](CHANGELOG.md) for specifics.

The goal is to maintain a lightweight, extensible library that covers the most common datepicker use cases. If you're looking for internationalization, keyboard navigation, and other advanced features, see eternicode's [popular fork](https://github.com/eternicode/bootstrap-datepicker).

## Usage

```
$('.datepicker').datepicker(options)
```

Options can also be specified with ```data``` attributes by prepending the option name with ```data-date-```. For example, you could set ```minViewMode``` with ```data-date-min-view-mode```.

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

  <dt>.datepicker('place')</dt>
  <dd>Updates the datepicker's position relative to the element.</dd>

  <dt>.datepicker('setValue', value)</dt>
  <dd>Set a new value for the datepicker. It can be a string in the specified format or a Date object.</dd>
</dl>

## Options

Name        | Type    | Default      | Description
----------- | ------- | ------------ | -----------
format      | string  | 'mm/dd/yyyy' | Date format; combination of d, dd, m, mm, yy, yyyy
weekStart   | integer | 0            | Day of the week start; 0 for Sunday, 6 for Sunday
viewMode    | string  | 'days'       | Start view mode; days, months, or years
minViewMode | string  | 'days'       | Limit for view mode; days, months, or years

## Events

Event      | Description
---------- | -----------
show       | This event is fired immediately when the datepicker is displayed.
hide       | This event is fired immediately when the datepicker is hidden.
changeDate | This event is fired when the date is changed.
onRender   | This event is fired when a day is rendered inside the datepicker. Should return a string. Return 'disabled' to disable the day from being selected.
