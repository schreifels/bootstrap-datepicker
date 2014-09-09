# bootstrap-datepicker

This is a fork of Stefan Petre's [bootstrap-datepicker](http://www.eyecon.ro/bootstrap-datepicker/). The code is being refactored for consistency, usability, and extensibility. See the [changelog](CHANGELOG.md) for changes to the public interface.

The goal is to maintain a lightweight, extensible library that covers the most common datepicker use cases. If you're looking for internationalization, keyboard navigation, and other advanced features, see eternicode's [popular fork](https://github.com/eternicode/bootstrap-datepicker).

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

  <dt>.datepicker('place')</dt>
  <dd>Updates the datepicker's position relative to the element.</dd>

  <dt>.datepicker('setValue', value)</dt>
  <dd>Set a new value for the datepicker. It can be a string in the specified format or a Date object.</dd>
</dl>

## Options

Name        | Type     | Default                      | Description
----------- | -------- | ---------------------------- | -----------
format      | string   | 'mm/dd/yyyy'                 | Date format; combination of d, dd, m, mm, yy, yyyy; separator can be any non-alphanumeric character except underscore
weekStart   | integer  | 0                            | Day of the week start; 0 for Sunday, 6 for Sunday

## Events

Event                      | Description
-------------------------- | -----------
shown.bs.datepicker        | Fired after the datepicker has been displayed to the user.
hidden.bs.datepicker       | Fired after the datepicker has been hidden from the user.
dateSet.bs.datepicker      | Fired after the user enters or selects a date.
