/* ==========================================================================
 * bootstrap-datepicker.js
 * A simple, lightweight Bootstrap-powered datepicker.
 * https://github.com/schreifels/removeable-bootstrap-datepicker
 * ==========================================================================
 * By Mike Schreifels, based on Stefan Petre's http://www.eyecon.ro/bootstrap-datepicker/
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ========================================================================== */

;(function($) {

  var Datepicker, defaults, tbodyTemplate, template, dictionary;

  //////////////////////////////////////////////////////////////////////////////
  // Constructor
  //////////////////////////////////////////////////////////////////////////////

  Datepicker = function(element, options) {
    var initialDate;

    this.$element = $(element);
    this.$picker  = $(template).appendTo('body');
    this.$addOn   = this.$element.is('.date') ? this.$element.find('.add-on') : null;

    this.format  = parseFormat(options.format);
    this.isInput = this.$element.is('input');

    this.$picker.on('click', $.proxy(this._click, this));
    if (this.isInput) {
      this._bindEvent('alwaysBound', this.$element, 'focus', $.proxy(this.show, this));
      this._bindEvent('alwaysBound', this.$element, 'keyup', $.proxy(function(e) {
        this.setDate(parseDate(e.target.value, this.format), true);
      }, this));
    } else {
      if (this.$addOn) {
        this._bindEvent('alwaysBound', this.$addOn, 'click', $.proxy(this.show, this));
      } else {
        this._bindEvent('alwaysBound', this.$element, 'click', $.proxy(this.show, this));
      }
    }

    this.weekStart = options.weekStart;
    this.weekEnd = this.weekStart === 0 ? 6 : this.weekStart - 1;

    initialDate = this.isInput ? this.$element.prop('value') : options.date;
    this.setDate(initialDate ? parseDate(initialDate, this.format) : new Date(), true);
    this._renderDaysOfWeek();
    this.setMode('days');
  };

  //////////////////////////////////////////////////////////////////////////////
  // Public methods
  //////////////////////////////////////////////////////////////////////////////

  Datepicker.prototype.show = function(e) {
    if (e) { e.stopPropagation(); e.preventDefault(); }

    this.$picker.show();
    this.height = this.$addOn ? this.$addOn.outerHeight() : this.$element.outerHeight();
    this.place();

    this._bindEvent('boundWhenShown', $(window), 'resize', $.proxy(this.place, this));
    this._bindEvent('boundWhenShown', $(document), 'mousedown', $.proxy(function(ev) {
      var $target = $(ev.target);
      if (!$target.is(this.$element) && $target.closest('.datepicker').length === 0) {
        this.hide();
      }
    }, this));
    if (!this.addOn) {
      this._bindEvent('boundWhenShown', this.$element, 'keydown', $.proxy(function(ev) {
        if (ev.which === 9) { this.hide(); }
      }, this));
    }

    this.$element.trigger({ type: 'shown.bs.datepicker', date: this.date });
  };

  Datepicker.prototype.hide = function() {
    this.$picker.hide();
    this._unbindEvents('boundWhenShown');
    this.$element.trigger({ type: 'hidden.bs.datepicker', date: this.date });
  };

  Datepicker.prototype.remove = function() {
    this.hide();
    this.$picker.remove();
    this._unbindEvents('alwaysBound');
  };

  Datepicker.prototype.setDate = function(newDate, skipFieldUpdate) {
    var formatted, newViewport;

    newViewport = {
      month: (!this.date || this.date.getMonth()    !== newDate.getMonth())    ? newDate.getMonth() : null,
      year:  (!this.date || this.date.getFullYear() !== newDate.getFullYear()) ? newDate.getFullYear() : null
    };

    this.date = newDate;

    if (!skipFieldUpdate) {
      formatted = formatDate(this.date, this.format);
      if (this.$addOn) {
        this.$element.find('input').prop('value', formatted);
      } else if (this.isInput) {
        this.$element.prop('value', formatted);
      } else {
        this.$element.data('date', formatted);
      }
    }

    this.setViewport(newViewport);

    this.$element.trigger({
      type: 'dateSet.bs.datepicker',
      date: this.date,
      viewMode: this.viewMode
    });
  };

  Datepicker.prototype.setViewport = function(newViewport) {
    this._viewport || (this._viewport = {});
    if (typeof newViewport.month === 'number') {
      this._viewport.month = newViewport.month;
      this._renderMonths();
    }
    if (typeof newViewport.year === 'number') {
      this._viewport.year = newViewport.year;
      this._renderYears();
    }
    this._renderDays();
  };

  Datepicker.prototype.place = function() {
    var offset = this.$addOn ? this.$addOn.offset() : this.$element.offset();
    this.$picker.css({
      top: offset.top + this.height,
      left: offset.left
    });
  };

  Datepicker.prototype.setMode = function(newMode) {
    this.viewMode = newMode;
    this.$picker.find('> div').hide().filter('.datepicker-' + this.viewMode).show();
  };

  Datepicker.prototype.setPage = function(direction) {
    var direction = (direction === 'next') ? 1 : -1;

    if (this.viewMode === 'days') {
      this.setViewport({ month: this._viewport.month + direction });
    } else if (this.viewMode === 'months') {
      this.setViewport({ year: this._viewport.year + direction });
    } else if (this.viewMode === 'years') {
      this.setViewport({ year: this._viewport.year + direction * 10 });
    }
  };

  //////////////////////////////////////////////////////////////////////////////
  // Rendering
  //////////////////////////////////////////////////////////////////////////////

  Datepicker.prototype._renderDaysOfWeek = function() {
    var currentDay = this.weekStart,
        html = '<tr>';

    while (currentDay < this.weekStart + 7) {
      html += '<th>' + dictionary.days[currentDay++ % 7] + '</th>';
    }
    html += '</tr>';

    this.$picker.find('.datepicker-days thead').append(html);
  };

  Datepicker.prototype._renderDays = function() {
    var today = this.date.getTime(),
        thisYear = this.date.getFullYear(),
        currentDay, nextMonth, html, className, months,
        currentYear, currentMonth, currentDate;

    this.$picker.find('.datepicker-days th:eq(1) a').text(dictionary.months[this._viewport.month] + ' ' + this._viewport.year);

    currentDay = new Date(this._viewport.year, this._viewport.month, 0, 0, 0, 0, 0); // day 0 is the last day of the previous month
    currentDay.setDate(currentDay.getDate() - ((currentDay.getDay() - this.weekStart + 7) % 7));

    nextMonth = new Date(currentDay);
    nextMonth.setDate(nextMonth.getDate() + 42);
    nextMonth = nextMonth.getTime();

    html = '';
    while(currentDay.getTime() < nextMonth) {
      currentYear  = currentDay.getFullYear();
      currentMonth = currentDay.getMonth();
      currentDate  = currentDay.getDate();
      className    = '';

      if (currentDay.getDay() === this.weekStart) { html += '<tr>'; }
      if ((currentMonth < this._viewport.month &&  currentYear === this._viewport.year) || currentYear < this._viewport.year) {
        className += ' datepicker-old';
      } else if ((currentMonth > this._viewport.month && currentYear === this._viewport.year) || currentYear > this._viewport.year) {
        className += ' datepicker-new';
      }
      if (currentDay.getTime() === today) { className += ' datepicker-selected'; }
      html += (
        '<td>' +
          '<a href="#" ' +
               'data-handler="setDate" ' +
               'data-year="' + currentYear + '" ' +
               'data-month="' + currentMonth + '" ' +
               'data-day="' + currentDate + '" ' +
               'class="' + className + '">' +
               currentDay.getDate() +
          '</a>' +
        '</td>'
      );
      if (currentDay.getDay() === this.weekEnd) { html += '</tr>'; }
      currentDay.setDate(currentDate + 1);
    }

    this.$picker.find('.datepicker-days tbody').html(html);
  };

  Datepicker.prototype._renderMonths = function() {
    var html = '', i = 0, thisMonth = this.date.getMonth();

    while (i < 12) {
      html += '<a href="#" ' +
                  (thisMonth === i ? 'class="active" ' : '') +
                  'data-handler="setViewport" ' +
                  'data-month="' + i + '"' +
                  '>' + dictionary.monthsShort[i] +
              '</a>';
      i++;
    }

    this.$picker.find('.datepicker-months td').html(html);
  };

  Datepicker.prototype._renderYears = function() {
    var html        = '',
        currentYear = parseInt(this._viewport.year / 10) * 10,
        $years      = this.$picker.find('.datepicker-years'),
        thisYear    = this.date.getFullYear();

    $years.find('th:eq(1) a').text(currentYear + '-' + (currentYear + 9));
    $years = $years.find('td');

    currentYear -= 1;
    for (i = -1; i < 11; i++) {
      html += '<a href="#"' +
                  (thisYear === currentYear ? ' class="active"' : '') +
                  ' data-handler="setViewport"' +
                  ' data-year="' + currentYear + '"' +
                  '>' + currentYear + '</a>';
      currentYear++;
    }
    $years.html(html);

    this.$picker.find('.datepicker-months th:eq(1) a').text(this._viewport.year);
  };

  //////////////////////////////////////////////////////////////////////////////
  // Event handling
  //////////////////////////////////////////////////////////////////////////////

  Datepicker.prototype._click = function(e) {
    var $target = $(e.target), nextViewport;

    if (!$target.is('a')) { return; }

    e.preventDefault();
    e.stopPropagation();

    switch ($target.data('handler')) {
      case 'setDate':
        this.setDate(new Date($target.data('year'), $target.data('month'), $target.data('day'), 0, 0, 0, 0));
        break;
      case 'setMode':
        this.setMode($target.data('next-mode'));
        break;
      case 'setPage':
        this.setPage($target.data('direction'));
        break;
      case 'setViewport':
        nextViewport = { year: $target.data('year'), month: $target.data('month') };
        this.setViewport(nextViewport);
        this.setMode(nextViewport.year ? 'months' : 'days');
        break;
    }
  };

  Datepicker.prototype._bindEvent = function(category, $el, event, handler) {
    this._events || (this._events = {});
    this._events[category] || (this._events[category] = []);

    $el.on(event, handler);
    this._events[category].push([$el, event, handler]);
  };

  Datepicker.prototype._unbindEvents = function(category) {
    $.each(this._events[category], function(index, e) {
      e[0].off(e[1], e[2]);
    });
  };

  //////////////////////////////////////////////////////////////////////////////
  // jQuery plugin definition
  //////////////////////////////////////////////////////////////////////////////

  $.fn.datepicker = function(option, val) {
    return this.each(function() {
      var $this = $(this), data = $this.data('bs.datepicker'), options;
      if (!data) {
        options = $.extend({}, defaults, $this.data(), typeof option === 'object' && option);
        $this.data('bs.datepicker', (data = new Datepicker(this, options)));
      }
      if (typeof option === 'string') { data[option](val); }
    });
  };

  $.fn.datepicker.Constructor = Datepicker;

  defaults = {
    format: 'mm/dd/yyyy',
    weekStart: 0
  };

  //////////////////////////////////////////////////////////////////////////////
  // Utility methods
  //////////////////////////////////////////////////////////////////////////////

  function parseFormat(format) {
    var separator = format.match(/\W+/),
        parts     = format.split(separator);
    if (parts.length < 2) { throw new Error('Invalid date format'); }
    return { separator: separator, parts: parts };
  }

  function parseDate(dateString, format) {
    var parts = String(dateString).split(/\W+/),
        date = new Date();

    date.setHours(0);
    date.setMinutes(0);
    date.setSeconds(0);
    date.setMilliseconds(0);

    $.each(format.parts, function(index, formatPart) {
      if (!parts[index]) { return; }

      if (formatPart === 'dd' || formatPart === 'd') {
        date.setDate(parseInt(parts[index]));
      } else if (formatPart === 'mm' || formatPart === 'm') {
        date.setMonth(parseInt(parts[index]) - 1);
      } else if (formatPart === 'yyyy' || formatPart === 'yy') {
        if (parts[index].length === 4) {
          date.setFullYear(parseInt(parts[index]));
        } else {
          date.setFullYear(parseInt('20' + parts[index].slice(-2)));
        }
      }
    });

    return date;
  }

  function formatDate(date, format) {
    var date, values;

    values = {
      d: date.getDate(),
      m: date.getMonth() + 1,
      yyyy: date.getFullYear().toString()
    };
    values.dd = (values.d < 10 ? '0' : '') + values.d;
    values.mm = (values.m < 10 ? '0' : '') + values.m;
    values.yy = values.yyyy.substring(2);

    date = [];
    $.each(format.parts, function(index, part) {
      date.push(values[part]);
    });

    return date.join(format.separator);
  }

  //////////////////////////////////////////////////////////////////////////////
  // Template
  //////////////////////////////////////////////////////////////////////////////

  function headTemplate(nextMode) {
    return '<thead>' +
             '<tr>' +
               '<th class="prev"><a href="#" data-handler="setPage" data-direction="prev">&lsaquo;</a></th>' +
               '<th colspan="5"><a href="#"' + (nextMode ? ' data-handler="setMode" data-next-mode="' + nextMode + '"' : '') + '></a></th>' +
               '<th class="next"><a href="#" data-handler="setPage" data-direction="next">&rsaquo;</a></th>' +
             '</tr>' +
           '</thead>';
  }

  tbodyTemplate =
    '<tbody>' +
      '<tr>' +
        '<td colspan="7"></td>' +
      '</tr>' +
    '</tbody>';

  template =
    '<div class="datepicker dropdown-menu">' +
      '<div class="datepicker-days">' +
        '<table class="table-condensed">' +
          headTemplate('months') +
          '<tbody></tbody>' +
        '</table>' +
      '</div>' +
      '<div class="datepicker-months">' +
        '<table class="table-condensed">' +
          headTemplate('years') +
          tbodyTemplate +
        '</table>' +
      '</div>' +
      '<div class="datepicker-years">' +
        '<table class="table-condensed">' +
          headTemplate() +
          tbodyTemplate +
        '</table>' +
      '</div>' +
    '</div>';

  //////////////////////////////////////////////////////////////////////////////
  // Reference
  //////////////////////////////////////////////////////////////////////////////

  dictionary = {
    days:        ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
    months:      ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
    monthsShort: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  };

})(jQuery);
