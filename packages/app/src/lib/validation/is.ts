/**
 * This file is a fork of 'https://github.com/arasatasaygin/is.js'
 * Customized to simplify it as much as possible. You can extend it
 * based on the requirement.
 */

import { TObject, AnyFunction } from "./types.js";

// typedef
const { toString } = Object.prototype;
const { slice } = Array.prototype;
const { hasOwnProperty } = Object.prototype;

// helper function which reverses the sense of predicate result
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function not(func: AnyFunction) {
  return () => !func.apply(null, slice.call(arguments)); // eslint-disable-line prefer-spread, prefer-rest-params
}

// build a 'comparator' object for various comparison checks
const comparator = {
  "<": <T>(a: T, b: T) => a < b,
  "<=": <T>(a: T, b: T) => a <= b,
  ">": <T>(a: T, b: T) => a > b,
  ">=": <T>(a: T, b: T) => a >= b,
};

// // helper function which compares a version to a range
// function compareVersion(version, range) {
//   const string = (`${range}`);
//   const n = +(string.match(/\d+/) || NaN);
//   const op = string.match(/^[<>]=?|/)[0];
//   return comparator[op] ? comparator[op](version, n) : (version === n);
// }

// // helper function which extracts params from arguments
// function getParams(args) {
//   let params = slice.call(args);
//   const length = params.length;
//   if (length === 1 && Is.array(params[0])) { // support array
//     params = params[0];
//   }
//   return params;
// }

function objectType(value: unknown) {
  return toString.call(value);
}

const days = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
const months = [
  "january",
  "february",
  "march",
  "april",
  "may",
  "june",
  "july",
  "august",
  "september",
  "october",
  "november",
  "december",
];

// Steven Levithan, Jan Goyvaerts: Regular Expressions Cookbook
// Scott Gonzalez: Email address validation

// dateString match m/d/yy and mm/dd/yyyy, allowing any combination of one or two digits for the day and month,
// and two or four digits for the year
// eppPhone match extensible provisioning protocol format
// nanpPhone match north american number plan format
// time match hours, minutes, and seconds, 24-hour clock
const regexps = {
  /* eslint-disable max-len, no-useless-escape */

  affirmative: /^(?:1|t(?:rue)?|y(?:es)?|ok(?:ay)?)$/,
  alphaNumeric: /^[A-Za-z0-9]+$/,
  caPostalCode: /^(?!.*[DFIOQU])[A-VXY][0-9][A-Z]\s?[0-9][A-Z][0-9]$/,
  creditCard: /^(?:(4[0-9]{12}(?:[0-9]{3})?)|(5[1-5][0-9]{14})|(6(?:011|5[0-9]{2})[0-9]{12})|(3[47][0-9]{13})|(3(?:0[0-5]|[68][0-9])[0-9]{11})|((?:2131|1800|35[0-9]{3})[0-9]{11}))$/,
  dateString: /^(1[0-2]|0?[1-9])([\/-])(3[01]|[12][0-9]|0?[1-9])(?:\2)(?:[0-9]{2})?[0-9]{2}$/,
  email: /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))$/i, // eslint-disable-line no-control-regex
  eppPhone: /^\+[0-9]{1,3}\.[0-9]{4,14}(?:x.+)?$/,
  hexadecimal: /^(?:0x)?[0-9a-fA-F]+$/,
  hexColor: /^#?([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/,
  ipv4: /^(?:(?:\d|[1-9]\d|1\d{2}|2[0-4]\d|25[0-5])\.){3}(?:\d|[1-9]\d|1\d{2}|2[0-4]\d|25[0-5])$/,
  ipv6: /^((?=.*::)(?!.*::.+::)(::)?([\dA-F]{1,4}:(:|\b)|){5}|([\dA-F]{1,4}:){6})((([\dA-F]{1,4}((?!\3)::|:\b|$))|(?!\2\3)){2}|(((2[0-4]|1\d|[1-9])?\d|25[0-5])\.?\b){4})$/i,
  nanpPhone: /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/,
  socialSecurityNumber: /^(?!000|666)[0-8][0-9]{2}-?(?!00)[0-9]{2}-?(?!0000)[0-9]{4}$/,
  timeString: /^(2[0-3]|[01]?[0-9]):([0-5]?[0-9]):([0-5]?[0-9])$/,
  ukPostCode: /^[A-Z]{1,2}[0-9RCHNQ][0-9A-Z]?\s?[0-9][ABD-HJLNP-UW-Z]{2}$|^[A-Z]{2}-?[0-9]{4}$/,
  url: /^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/i,
  usZipCode: /^[0-9]{5}(?:-[0-9]{4})?$/,

  /* eslint-enable max-len */
};

function regexpCheck(regexp: RegExp, value: string) {
  return regexp.test(value);
}

/**
  * Is namespace.
  *
  * @namespace Is
  */
export const Is = {
  // Type checks
  /* -------------------------------------------------------------------------- */

  // is a given value object?
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  object<T extends Record<string, any> = Record<string, any>>(value: unknown): value is T {
    return (Object(value) === value);
  },
  // is a given value valid?
  valid<T>(value: T): value is NonNullable<T> {
    if (value) return true;
    return (false);
  },
  // is a given value Arguments?
  arguments(value: unknown) {
    /* fallback check is for IE */
    return (objectType(value) === "[object Arguments]"
    || (value != null && typeof value === "object" && "callee" in value));
  },
  // is a given value Array?
  array<T>(value: unknown): value is Array<T> { // check native isArray first
    return objectType(value) === "[object Array]";
  },
  // is a given value Boolean?
  boolean(value: unknown): value is boolean {
    return (value === true || value === false || objectType(value) === "[object Boolean]");
  },
  // is a given value String?
  string(value: unknown): value is string {
    return (objectType(value) === "[object String]");
  },
  // is a given value Char?
  char(value: unknown): value is string {
    return (this.string(value) && value.length === 1);
  },
  // is a given value Date Object?
  date: function date(value: unknown): value is Date {
    return value instanceof Date;
  },
  // is a given object a DOM node?
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  domNode(object: any) {
    return (this.object(object) && object.nodeType > 0);
  },
  // is a given value Error object?
  error(value: unknown): value is Error {
    return (objectType(value) === "[object Error]");
  },
  // is a given value function?
  function<T extends AnyFunction = AnyFunction>(value: unknown): value is T {
    /* fallback check is for IE */
    return (objectType(value) === "[object Function]" || typeof value === "function");
  },
  // is given value a pure JSON object?
  // Q/A: what would be the type guard expression for this function???
  json(value: unknown): value is TObject {
    return (objectType(value) === "[object Object]");
  },
  // is a given value NaN?
  nan(value: unknown) { return Number.isNaN(value); },
  // is a given value null?
  null(value: unknown) { return (value === null); },
  // is a given value number?
  number(value: unknown) { return Number.isFinite(value); },
  // is a given value class?
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  class(value: any) {
    const status = (Object.prototype.toString.call(value) === "[object Function]")
                      && (value.prototype)
                      && (value.prototype.constructor)
                      && (value.prototype.constructor.toString)
                      && (value.prototype.constructor.toString().substring(0, 5) === "class");

    return (status);
  },
  // is a given value RegExp?
  regexp(value: unknown) { return (objectType(value) === "[object RegExp]"); },
  // is a given value undefined?
  undefined(value: unknown) { return (typeof value === "undefined"); },
  // is a given value window?
  // setInterval method is only available for window object
  window(value: unknown) { return (value != null && typeof value === "object" && "setInterval" in value); },

  // is node?
  node() { return ((typeof process !== "undefined") && (objectType(process) === "[object process]")); },

  // is browser?
  browser() { return ((typeof window !== "undefined") && (objectType(window) === "[object Window]")); },

  // Presence checks
  /* -------------------------------------------------------------------------- */

  // is a given value empty? Objects, arrays, strings
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  empty(value: Record<string, any>|Array<any>|string) {
    if (this.valid(value)) {
      if (this.object(value)) {
        const { length } = Object.getOwnPropertyNames(value);
        if (length === 0 || (length === 1 && Is.array(value))
                  || (length === 2 && this.arguments(value))) {
          return true;
        }
        return false;
      }
      return value === "";
    }
    return (true);
  },
  // is a given value existy?
  existy<T>(value: T): value is NonNullable<T> { return (value != null); },
  // is a given value falsy?
  falsy(value: unknown) { return !value; },
  // is a given value truthy?
  truthy(value: unknown) { return value; },

  // Arithmetic checks
  /* -------------------------------------------------------------------------- */

  // is a given number decimal?
  decimal(n: number) { return n % 1 !== 0; },
  // is a given number even?
  even(n: number) { return n % 2 === 0; },
  // is a given number finite?
  finite: Number.isFinite,
  // is a given number infinite?
  infinite(n: number) { return n === Infinity || n === -Infinity; },

  // is a given number integer?
  integer(n: number) { return Number.isInteger(n); },

  // is a given number negative?
  negative(n: number) { return n < 0; },

  // is a given number odd?
  odd(n: number) { return ((n % 2 === 1 || n % 2 === -1)); },

  // is a given number positive?
  positive(n: number) { return n > 0; },

  // String checks
  /* -------------------------------------------------------------------------- */

  // is a given string or sentence capitalized?
  capitalized(string: string) {
    const words = string.split(" ");
    for (let i = 0; i < words.length; i += 1) {
      const word = words[i];
      if (word.length) {
        const chr = word.charAt(0);
        if (chr !== chr.toUpperCase()) {
          return false;
        }
      }
    }
    return true;
  },

  // is string end with a given target parameter?
  endWith(value: string, target: string) {
    const newTarget = target + ""; // eslint-disable-line prefer-template
    const position = value.length - newTarget.length;
    return position >= 0 && value.indexOf(newTarget, position) === position;
  },

  // is a given string include parameter target?
  include(value: string, target: string) { return value.indexOf(target) > -1; },

  // is a given string all lowercase?
  lowerCase(value: string) { return value === value.toLowerCase(); },

  // is a given string palindrome?
  palindrome(value: string) {
    const newString = value.replace(/[^a-zA-Z0-9]+/g, "").toLowerCase();
    const length = newString.length - 1;
    for (let i = 0, half = Math.floor(length / 2); i <= half; i += 1) {
      if (newString.charAt(i) !== newString.charAt(length - i)) {
        return false;
      }
    }
    return true;
  },

  // is a given value space?
  // horizontal tab: 9, line feed: 10, vertical tab: 11, form feed: 12, carriage return: 13, space: 32
  space(value: string) {
    if (!this.char(value)) {
      return false;
    }
    const charCode = value.charCodeAt(0);
    return (charCode > 8 && charCode < 14) || charCode === 32;
  },

  // is string start with a given target parameter?
  startWith(value: string, target: string) { return value.indexOf(target) === 0; },

  // is a given string all uppercase?
  upperCase(value: string) { return value === value.toUpperCase(); },

  // Time checks
  /* -------------------------------------------------------------------------- */

  // is a given dates day equal given day parameter?
  day(date: Date, day: string) { return day.toLowerCase() === days[date.getDay()]; },

  // is a given date in daylight saving time?
  dayLightSavingTime(date: Date) {
    const january = new Date(date.getFullYear(), 0, 1);
    const july = new Date(date.getFullYear(), 6, 1);
    const stdTimezoneOffset = Math.max(january.getTimezoneOffset(), july.getTimezoneOffset());
    return date.getTimezoneOffset() < stdTimezoneOffset;
  },

  // is a given date future?
  future(date: Date) {
    const now = new Date();
    return (date.getTime() > now.getTime());
  },

  // is date within given range?
  inDateRange(date: Date, start: Date, end: Date) {
    const stamp = date.getTime();
    return stamp > start.getTime() && stamp < end.getTime();
  },

  // is a given date in last month range?
  inLastMonth(date: Date) {
    return (this.inDateRange(date, new Date(new Date().setMonth(new Date().getMonth() - 1)), new Date()));
  },

  // is a given date in last week range?
  inLastWeek(date: Date) {
    return this.inDateRange(date, new Date(new Date().setDate(new Date().getDate() - 7)), new Date());
  },

  // is a given date in last year range?
  inLastYear(date: Date) {
    return Is.inDateRange(date, new Date(new Date().setFullYear(new Date().getFullYear() - 1)), new Date());
  },

  // is a given date in next month range?
  inNextMonth(date: Date) {
    return this.inDateRange(date, new Date(), new Date(new Date().setMonth(new Date().getMonth() + 1)));
  },

  // is a given date in next week range?
  inNextWeek(date: Date) {
    return this.inDateRange(date, new Date(), new Date(new Date().setDate(new Date().getDate() + 7)));
  },

  // is a given date in next year range?
  inNextYear(date: Date) {
    return this.inDateRange(date, new Date(), new Date(new Date().setFullYear(new Date().getFullYear() + 1)));
  },

  // is the given year a leap year?
  leapYear(year: number) { return ((year % 4 === 0 && year % 100 !== 0) || year % 400 === 0); },

  // is a given dates month equal given month parameter?
  month(date: Date, month: string) { return month.toLowerCase() === months[date.getMonth()]; },

  // is a given date past?
  past(date: Date) {
    const now = new Date();
    return date.getTime() < now.getTime();
  },

  // is a given date in the parameter quarter?
  quarterOfYear(date: Date, quarter: number) { return quarter === Math.floor((date.getMonth() + 3) / 3); },

  // is a given date indicate today?
  today(date: Date) {
    const now = new Date();
    const todayString = now.toDateString();
    return date.toDateString() === todayString;
  },

  // is a given date indicate tomorrow?
  tomorrow(date: Date) {
    const now = new Date();
    const tomorrowString = new Date(now.setDate(now.getDate() + 1)).toDateString();
    return date.toDateString() === tomorrowString;
  },

  // is a given date weekend?
  // 6: Saturday, 0: Sunday
  weekend(date: Date) { return (date.getDay() === 6 || date.getDay() === 0); },

  // is a given date weekday?
  weekday(date: Date) { return (!this.weekend(date)); },

  // is a given dates year equal given year parameter?
  year(date: Date, year: number) { return year === date.getFullYear(); },

  // is a given date indicate yesterday?
  yesterday(date: Date) {
    const now = new Date();
    const yesterdayString = new Date(now.setDate(now.getDate() - 1)).toDateString();
    return date.toDateString() === yesterdayString;
  },

  // Object checks
  /* -------------------------------------------------------------------------- */

  // has a given object got parameterized count property?
  propertyCount(object: unknown, count: number) {
    if (!this.object(object)) {
      return false;
    }
    let n = 0;

    // eslint-disable-next-line no-restricted-syntax
    for (const property in object) {
      // eslint-disable-next-line no-plusplus
      if (hasOwnProperty.call(object, property) && ++n > count) {
        return false;
      }
    }
    return n === count;
  },

  // is given object has parameterized property?
  propertyDefined(object: unknown, property: string) { return this.object(object) && property in object; },

  // is a given value thenable (like Promise)?
  thenable(value: unknown) { return this.object(value) && typeof value.then === "function"; },

  // Array checks
  /* -------------------------------------------------------------------------- */

  // is a given item in an array?
  inArray<T>(value: T, array: Array<T>) {
    for (let i = 0; i < array.length; i += 1) {
      if (array[i] === value) {
        return true;
      }
    }
    return false;
  },

  // is a given array sorted?
  sorted<T>(array: Array<T>, sign: keyof typeof comparator) {
    const predicate = comparator[sign] || comparator[">="];
    for (let i = 1; i < array.length; i += 1) {
      if (!predicate(array[i], array[i - 1])) {
        return false;
      }
    }
    return true;
  },

  // Regexp checks
  /* -------------------------------------------------------------------------- */

  // is given value affirmative?
  affirmative(value: string) { return (regexpCheck(regexps.affirmative, value)); },

  // is given value alphaNumeric?
  alphaNumeric(value: string) { return (regexpCheck(regexps.alphaNumeric, value)); },

  // is given value caPostalCode?
  caPostalCode(value: string) { return (regexpCheck(regexps.caPostalCode, value)); },

  // is given value creditCard?
  creditCard(value: string) { return (regexpCheck(regexps.creditCard, value)); },

  // is given value dateString?
  dateString(value: string) { return (regexpCheck(regexps.dateString, value)); },

  // is given value email?
  email(value: string) { return (regexpCheck(regexps.email, value)); },

  // is given value eppPhone?
  eppPhone(value: string) { return (regexpCheck(regexps.eppPhone, value)); },

  // is given value hexadecimal?
  hexadecimal(value: string) { return (regexpCheck(regexps.hexadecimal, value)); },

  // is given value hexColor?
  hexColor(value: string) { return (regexpCheck(regexps.hexColor, value)); },

  // simplify IPv4
  ipv4(value: string) { return (regexpCheck(regexps.ipv4, value)); },

  // simplify IPv6
  ipv6(value: string) { return (regexpCheck(regexps.ipv6, value)); },

  // simplify IP checks by calling the regex helpers for IPv4 and IPv6
  ip(value: string) { return (this.ipv4(value) || this.ipv6(value)); },

  // is given value nanpPhone?
  nanpPhone(value: string) { return (regexpCheck(regexps.nanpPhone, value)); },

  // is given value socialSecurityNumber?
  socialSecurityNumber(value: string) { return (regexpCheck(regexps.socialSecurityNumber, value)); },

  // is given value timeString?
  timeString(value: string) { return (regexpCheck(regexps.timeString, value)); },

  // is given value ukPostCode?
  ukPostCode(value: string) { return (regexpCheck(regexps.ukPostCode, value)); },

  // is given value url?
  url(value: string) { return (regexpCheck(regexps.url, value)); },

  // is given value usZipCode?
  usZipCode(value: string) { return (regexpCheck(regexps.usZipCode, value)); },
};
