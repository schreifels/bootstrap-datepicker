/* ==========================================================================
 * bootstrap-datepicker.js
 * A lightweight Bootstrap-powered datepicker focused on usability and extensibility.
 * https://github.com/schreifels/removeable-bootstrap-datepicker
 * ==========================================================================
 * Based on Stefan Petre's bootstrap-datepicker (http://www.eyecon.ro/bootstrap-datepicker)
 * Updated and maintained by Mike Schreifels
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

  var Datepicker, defaults, headTemplate, tbodyTemplate, template, modes, dictionary;

  //////////////////////////////////////////////////////////////////////////////
  // Constructor
  //////////////////////////////////////////////////////////////////////////////

  Datepicker = function(element, options) {
    this.$element = $(element);
    this.$picker  = $(template).appendTo('body').on('click', $.proxy(this.click, this));
    this.$addOn   = this.$element.is('.date') ? this.$element.find('.add-on') : null;

    this.format  = parseFormat(this.$element.data('date-format') || options.format);
    this.isInput = this.$element.is('input');

    if (this.isInput) {
      this._bindEvent('alwaysBound', this.$element, 'focus', $.proxy(this.show, this));
      this._bindEvent('alwaysBound', this.$element, 'keyup', $.proxy(this.update, this));
    } else {
      if (this.$addOn) {
        this._bindEvent('alwaysBound', this.$addOn, 'click', $.proxy(this.show, this));
      } else {
        this._bindEvent('alwaysBound', this.$element, 'click', $.proxy(this.show, this));
      }
    }

    this.minViewMode = this.$element.data('date-min-view-mode') || options.minViewMode;
    this.minViewMode = { days: 0, months: 1, years: 2 }[this.minViewMode];
    this.viewMode = this.$element.data('date-view-mode') || options.viewMode;
    this.viewMode = { days: 0, months: 1, years: 2 }[this.viewMode];
    this.startViewMode = this.viewMode;
    this.weekStart = this.$element.data('date-week-start') || options.weekStart;
    this.weekEnd = this.weekStart === 0 ? 6 : this.weekStart - 1;
    this.onRender = options.onRender;

    this.fillDow();
    this.fillMonths();
    this.update();
    this.showMode();
  };

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

    this.$element.trigger({ type: 'shown.bs.datepicker', date: this.date });
  };

  Datepicker.prototype.hide = function() {
    this.$picker.hide();
    this._unbindEvents('boundWhenShown');
    this.viewMode = this.startViewMode;
    this.showMode();
    this.$element.trigger({ type: 'hidden.bs.datepicker', date: this.date });
  };

  Datepicker.prototype.remove = function() {
    this.hide();
    this.$picker.remove();
    this._unbindEvents('alwaysBound');
  };

  Datepicker.prototype.set = function() {
    var formatted = formatDate(this.date, this.format);
    if (!this.isInput) {
      if (this.$addOn) {
        this.$element.find('input').prop('value', formatted);
      }
      this.$element.data('date', formatted);
    } else {
      this.$element.prop('value', formatted);
    }
  };

  Datepicker.prototype.setValue = function(newDate) {
    if (typeof newDate === 'string') {
      this.date = parseDate(newDate, this.format);
    } else {
      this.date = new Date(newDate);
    }
    this.set();
    this.viewDate = new Date(this.date.getFullYear(), this.date.getMonth(), 1, 0, 0, 0, 0);
    this.fill();
  };

  Datepicker.prototype.place = function() {
    var offset = this.$addOn ? this.$addOn.offset() : this.$element.offset();
    this.$picker.css({
      top: offset.top + this.height,
      left: offset.left
    });
  };

  Datepicker.prototype.update = function(newDate) {
    this.date = parseDate(
      typeof newDate === 'string' ? newDate : (this.isInput ? this.$element.prop('value') : this.$element.data('date')), this.format
    );
    this.viewDate = new Date(this.date.getFullYear(), this.date.getMonth(), 1, 0, 0, 0, 0);
    this.fill();
  };

  Datepicker.prototype.fillDow = function() {
    var dowCnt = this.weekStart,
        html = '<tr>';
    while (dowCnt < this.weekStart + 7) {
      html += '<th class="dow">' + dictionary.daysShorter[dowCnt++ % 7] + '</th>';
    }
    html += '</tr>';
    this.$picker.find('.datepicker-days thead').append(html);
  };

  Datepicker.prototype.fillMonths = function() {
    var html = '', i = 0;
    while (i < 12) {
      html += '<span class="month">' + dictionary.monthsShort[i++] + '</span>';
    }
    this.$picker.find('.datepicker-months td').append(html);
  };

  Datepicker.prototype.fill = function() {
    var d = new Date(this.viewDate),
        year = d.getFullYear(),
        month = d.getMonth(),
        currentDate = this.date.valueOf(),
        currentYear = this.date.getFullYear(),
        prevMonth, nextMonth, html, clsName, prevY, prevM, months, i, yearCont;
    this.$picker.find('.datepicker-days th:eq(1)')
          .text(dictionary.months[month] + ' ' + year);
    prevMonth = new Date(year, month-1, 28,0,0,0,0),
      day = getDaysInMonth(prevMonth.getMonth(), prevMonth.getFullYear());
    prevMonth.setDate(day);
    prevMonth.setDate(day - (prevMonth.getDay() - this.weekStart + 7)%7);
    nextMonth = new Date(prevMonth);
    nextMonth.setDate(nextMonth.getDate() + 42);
    nextMonth = nextMonth.valueOf();
    html = [];
    while(prevMonth.valueOf() < nextMonth) {
      if (prevMonth.getDay() === this.weekStart) {
        html.push('<tr>');
      }
      clsName = this.onRender(prevMonth);
      prevY = prevMonth.getFullYear();
      prevM = prevMonth.getMonth();
      if ((prevM < month &&  prevY === year) ||  prevY < year) {
        clsName += ' old';
      } else if ((prevM > month && prevY === year) || prevY > year) {
        clsName += ' new';
      }
      if (prevMonth.valueOf() === currentDate) {
        clsName += ' active';
      }
      html.push('<td class="day '+clsName+'">'+prevMonth.getDate() + '</td>');
      if (prevMonth.getDay() === this.weekEnd) {
        html.push('</tr>');
      }
      prevMonth.setDate(prevMonth.getDate()+1);
    }
    this.$picker.find('.datepicker-days tbody').empty().append(html.join(''));

    months = this.$picker.find('.datepicker-months')
          .find('th:eq(1)')
            .text(year)
            .end()
          .find('span').removeClass('active');
    if (currentYear === year) {
      months.eq(this.date.getMonth()).addClass('active');
    }

    html = '';
    year = parseInt(year/10, 10) * 10;
    yearCont = this.$picker.find('.datepicker-years')
              .find('th:eq(1)')
                .text(year + '-' + (year + 9))
                .end()
              .find('td');
    year -= 1;
    for (i = -1; i < 11; i++) {
      html += '<span class="year'+(i === -1 || i === 10 ? ' old' : '')+(currentYear === year ? ' active' : '')+'">'+year+'</span>';
      year += 1;
    }
    yearCont.html(html);
  };

  Datepicker.prototype.click = function(e) {
    e.stopPropagation();
    e.preventDefault();
    var target = $(e.target).closest('span, td, th'), day, month, year;
    if (target.length === 1) {
      switch(target[0].nodeName.toLowerCase()) {
        case 'th':
          switch(target[0].className) {
            case 'switch':
              this.showMode(1);
              break;
            case 'prev':
            case 'next':
              this.viewDate['set' + modes[this.viewMode].navFnc].call(
                this.viewDate,
                this.viewDate['get' + modes[this.viewMode].navFnc].call(this.viewDate) +
                modes[this.viewMode].navStep * (target[0].className === 'prev' ? -1 : 1)
              );
              this.fill();
              this.set();
              break;
          }
          break;
        case 'span':
          if (target.is('.month')) {
            month = target.parent().find('span').index(target);
            this.viewDate.setMonth(month);
          } else {
            year = parseInt(target.text(), 10) || 0;
            this.viewDate.setFullYear(year);
          }
          if (this.viewMode !== 0) {
            this.date = new Date(this.viewDate);
            this.$element.trigger({
              type: 'dateSelected.bs.datepicker',
              date: this.date,
              viewMode: modes[this.viewMode].clsName
            });
          }
          this.showMode(-1);
          this.fill();
          this.set();
          break;
        case 'td':
          if (target.is('.day') && !target.is('.disabled')) {
            day = parseInt(target.text(), 10) || 1;
            month = this.viewDate.getMonth();
            if (target.is('.old')) {
              month -= 1;
            } else if (target.is('.new')) {
              month += 1;
            }
            year = this.viewDate.getFullYear();
            this.date = new Date(year, month, day,0,0,0,0);
            this.viewDate = new Date(year, month, Math.min(28, day),0,0,0,0);
            this.fill();
            this.set();
            this.$element.trigger({
              type: 'dateSelected.bs.datepicker',
              date: this.date,
              viewMode: modes[this.viewMode].clsName
            });
          }
          break;
      }
    }
  };

  Datepicker.prototype.showMode = function(dir) {
    if (dir) {
      this.viewMode = Math.max(this.minViewMode, Math.min(2, this.viewMode + dir));
    }
    this.$picker.find('> div').hide().filter('.datepicker-'+modes[this.viewMode].clsName).show();
  };

  //////////////////////////////////////////////////////////////////////////////
  // Event handling
  //////////////////////////////////////////////////////////////////////////////

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
      var $this   = $(this),
          data    = $this.data('bs.datepicker'),
          options = $.extend({}, defaults, $this.data(), typeof option === 'object' && option);
      if (!data) { $this.data('bs.datepicker', (data = new Datepicker(this, options))); }
      if (typeof option === 'string') { data[option](val); }
    });
  };

  $.fn.datepicker.Constructor = Datepicker;

  defaults = {
    format: 'mm/dd/yyyy',
    minViewMode: 'years',
    viewMode: 'days',
    weekStart: 0,
    onRender: function(date) { return ''; }
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
    var date,
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

  function isLeapYear(year) {
    return ((year % 4 === 0) && (year % 100 !== 0)) || (year % 400 === 0);
  }

  function getDaysInMonth(month, year) {
    return [31, (isLeapYear(year) ? 29 : 28), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month]
  }

  //////////////////////////////////////////////////////////////////////////////
  // Template
  //////////////////////////////////////////////////////////////////////////////

  headTemplate =
    '<thead>' +
      '<tr>' +
        '<th class="prev">&lsaquo;</th>' +
        '<th colspan="5" class="switch"></th>' +
        '<th class="next">&rsaquo;</th>' +
      '</tr>' +
    '</thead>';

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
          headTemplate + '<tbody></tbody>' +
        '</table>' +
      '</div>' +
      '<div class="datepicker-months">' +
        '<table class="table-condensed">' +
          headTemplate + tbodyTemplate +
        '</table>' +
      '</div>' +
      '<div class="datepicker-years">' +
        '<table class="table-condensed">' +
          headTemplate + tbodyTemplate +
        '</table>' +
      '</div>' +
    '</div>';

  //////////////////////////////////////////////////////////////////////////////
  // Reference
  //////////////////////////////////////////////////////////////////////////////

  modes = [
    { clsName: 'days',   navFnc: 'Month',    navStep: 1 },
    { clsName: 'months', navFnc: 'FullYear', navStep: 1 },
    { clsName: 'years',  navFnc: 'FullYear', navStep: 10 }
  ];

  dictionary = {
    days:        ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    daysShort:   ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    daysShorter: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'],
    months:      ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
    monthsShort: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  };

})(jQuery);
