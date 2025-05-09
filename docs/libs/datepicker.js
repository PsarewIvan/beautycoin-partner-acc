// vanillajs-datepicker
var Datepicker = (function () {
    'use strict';
    function e(e) {
        return e[e.length - 1];
    }
    function t(e, ...t) {
        return (
            t.forEach((t) => {
                e.includes(t) || e.push(t);
            }),
            e
        );
    }
    function i(e, t) {
        return e ? e.split(t) : [];
    }
    function n(e, t, i) {
        return (void 0 === t || e >= t) && (void 0 === i || e <= i);
    }
    function s(e, t, i) {
        return e < t ? t : e > i ? i : e;
    }
    function a(e, t, i = {}, n = 0, s = '') {
        s += `<${Object.keys(i).reduce((e, t) => {
            let s = i[t];
            return 'function' == typeof s && (s = s(n)), `${e} ${t}="${s}"`;
        }, e)}></${e}>`;
        const r = n + 1;
        return r < t ? a(e, t, i, r, s) : s;
    }
    function r(e) {
        return e.replace(/>\s+/g, '>').replace(/\s+</, '<');
    }
    function o(e) {
        return new Date(e).setHours(0, 0, 0, 0);
    }
    function d() {
        return new Date().setHours(0, 0, 0, 0);
    }
    function c(...e) {
        switch (e.length) {
            case 0:
                return d();
            case 1:
                return o(e[0]);
        }
        const t = new Date(0);
        return t.setFullYear(...e), t.setHours(0, 0, 0, 0);
    }
    function l(e, t) {
        const i = new Date(e);
        return i.setDate(i.getDate() + t);
    }
    function h(e, t) {
        const i = new Date(e),
            n = i.getMonth() + t;
        let s = n % 12;
        s < 0 && (s += 12);
        const a = i.setMonth(n);
        return i.getMonth() !== s ? i.setDate(0) : a;
    }
    function u(e, t) {
        const i = new Date(e),
            n = i.getMonth(),
            s = i.setFullYear(i.getFullYear() + t);
        return 1 === n && 2 === i.getMonth() ? i.setDate(0) : s;
    }
    function f(e, t) {
        return (e - t + 7) % 7;
    }
    function p(e, t, i = 0) {
        const n = new Date(e).getDay();
        return l(e, f(t, i) - f(n, i));
    }
    function m(e, t) {
        return Math.round((e - t) / 6048e5) + 1;
    }
    function w(e) {
        const t = p(e, 4, 1);
        return m(t, p(new Date(t).setMonth(0, 4), 4, 1));
    }
    function g(e, t) {
        const i = p(new Date(e).setMonth(0, 1), t, t),
            n = p(e, t, t),
            s = m(n, i);
        if (s < 53) return s;
        return n === p(new Date(e).setDate(32), t, t) ? 1 : s;
    }
    function y(e) {
        return g(e, 0);
    }
    function D(e) {
        return g(e, 6);
    }
    function k(e, t) {
        const i = new Date(e).getFullYear();
        return Math.floor(i / t) * t;
    }
    function b(e, t, i) {
        if (1 !== t && 2 !== t) return e;
        const n = new Date(e);
        return (
            1 === t
                ? i
                    ? n.setMonth(n.getMonth() + 1, 0)
                    : n.setDate(1)
                : i
                ? n.setFullYear(n.getFullYear() + 1, 0, 0)
                : n.setMonth(0, 1),
            n.setHours(0, 0, 0, 0)
        );
    }
    const v = /dd?|DD?|mm?|MM?|yy?(?:yy)?/,
        x = /[\s!-/:-@[-`{-~年月日]+/;
    let M = {};
    const N = {
            y: (e, t) => new Date(e).setFullYear(parseInt(t, 10)),
            m(e, t, i) {
                const n = new Date(e);
                let s = parseInt(t, 10) - 1;
                if (isNaN(s)) {
                    if (!t) return NaN;
                    const e = t.toLowerCase(),
                        n = (t) => t.toLowerCase().startsWith(e);
                    if (
                        ((s = i.monthsShort.findIndex(n)),
                        s < 0 && (s = i.months.findIndex(n)),
                        s < 0)
                    )
                        return NaN;
                }
                return (
                    n.setMonth(s),
                    n.getMonth() !== O(s) ? n.setDate(0) : n.getTime()
                );
            },
            d: (e, t) => new Date(e).setDate(parseInt(t, 10)),
        },
        S = {
            d: (e) => e.getDate(),
            dd: (e) => C(e.getDate(), 2),
            D: (e, t) => t.daysShort[e.getDay()],
            DD: (e, t) => t.days[e.getDay()],
            m: (e) => e.getMonth() + 1,
            mm: (e) => C(e.getMonth() + 1, 2),
            M: (e, t) => t.monthsShort[e.getMonth()],
            MM: (e, t) => t.months[e.getMonth()],
            y: (e) => e.getFullYear(),
            yy: (e) => C(e.getFullYear(), 2).slice(-2),
            yyyy: (e) => C(e.getFullYear(), 4),
        };
    function O(e) {
        return e > -1 ? e % 12 : O(e + 12);
    }
    function C(e, t) {
        return e.toString().padStart(t, '0');
    }
    function F(t) {
        if ('string' != typeof t) throw new Error('Invalid date format.');
        if (t in M) return M[t];
        const i = t.split(v),
            n = t.match(new RegExp(v, 'g'));
        if (0 === i.length || !n) throw new Error('Invalid date format.');
        const s = n.map((e) => S[e]),
            a = Object.keys(N).reduce(
                (e, t) => (
                    n.find((e) => 'D' !== e[0] && e[0].toLowerCase() === t) &&
                        e.push(t),
                    e
                ),
                []
            );
        return (M[t] = {
            parser(e, t) {
                const i = e.split(x).reduce((e, t, i) => {
                    if (t.length > 0 && n[i]) {
                        const s = n[i][0];
                        'M' === s ? (e.m = t) : 'D' !== s && (e[s] = t);
                    }
                    return e;
                }, {});
                return a.reduce((e, n) => {
                    const s = N[n](e, i[n], t);
                    return isNaN(s) ? e : s;
                }, d());
            },
            formatter: (t, n) =>
                s.reduce((e, s, a) => e + `${i[a]}${s(t, n)}`, '') + e(i),
        });
    }
    function V(e, t, i) {
        if (e instanceof Date || 'number' == typeof e) {
            const t = o(e);
            return isNaN(t) ? void 0 : t;
        }
        if (e) {
            if ('today' === e) return d();
            if (t && t.toValue) {
                const n = t.toValue(e, t, i);
                return isNaN(n) ? void 0 : o(n);
            }
            return F(t).parser(e, i);
        }
    }
    function B(e, t, i) {
        if (isNaN(e) || (!e && 0 !== e)) return '';
        const n = 'number' == typeof e ? new Date(e) : e;
        return t.toDisplay ? t.toDisplay(n, t, i) : F(t).formatter(n, i);
    }
    const E = document.createRange();
    function L(e) {
        return E.createContextualFragment(e);
    }
    function A(e) {
        return (
            e.parentElement ||
            (e.parentNode instanceof ShadowRoot ? e.parentNode.host : void 0)
        );
    }
    function Y(e) {
        return e.getRootNode().activeElement === e;
    }
    function W(e) {
        'none' !== e.style.display &&
            (e.style.display && (e.dataset.styleDisplay = e.style.display),
            (e.style.display = 'none'));
    }
    function K(e) {
        'none' === e.style.display &&
            (e.dataset.styleDisplay
                ? ((e.style.display = e.dataset.styleDisplay),
                  delete e.dataset.styleDisplay)
                : (e.style.display = ''));
    }
    function _(e) {
        e.firstChild && (e.removeChild(e.firstChild), _(e));
    }
    const T = new WeakMap(),
        { addEventListener: H, removeEventListener: j } = EventTarget.prototype;
    function R(e, t) {
        let i = T.get(e);
        i || ((i = []), T.set(e, i)),
            t.forEach((e) => {
                H.call(...e), i.push(e);
            });
    }
    if (!Event.prototype.composedPath) {
        const e = (t, i = []) => {
            let n;
            return (
                i.push(t),
                t.parentNode
                    ? (n = t.parentNode)
                    : t.host
                    ? (n = t.host)
                    : t.defaultView && (n = t.defaultView),
                n ? e(n, i) : i
            );
        };
        Event.prototype.composedPath = function () {
            return e(this.target);
        };
    }
    function $(e, t, i) {
        const [n, ...s] = e;
        return t(n)
            ? n
            : n !== i && 'HTML' !== n.tagName && 0 !== s.length
            ? $(s, t, i)
            : void 0;
    }
    function I(e, t) {
        const i =
            'function' == typeof t
                ? t
                : (e) => e instanceof Element && e.matches(t);
        return $(e.composedPath(), i, e.currentTarget);
    }
    const P = {
            en: {
                days: [
                    'Sunday',
                    'Monday',
                    'Tuesday',
                    'Wednesday',
                    'Thursday',
                    'Friday',
                    'Saturday',
                ],
                daysShort: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
                daysMin: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
                months: [
                    'January',
                    'February',
                    'March',
                    'April',
                    'May',
                    'June',
                    'July',
                    'August',
                    'September',
                    'October',
                    'November',
                    'December',
                ],
                monthsShort: [
                    'Jan',
                    'Feb',
                    'Mar',
                    'Apr',
                    'May',
                    'Jun',
                    'Jul',
                    'Aug',
                    'Sep',
                    'Oct',
                    'Nov',
                    'Dec',
                ],
                today: 'Today',
                clear: 'Clear',
                titleFormat: 'MM y',
            },
        },
        J = {
            autohide: !1,
            beforeShowDay: null,
            beforeShowDecade: null,
            beforeShowMonth: null,
            beforeShowYear: null,
            clearButton: !1,
            dateDelimiter: ',',
            datesDisabled: [],
            daysOfWeekDisabled: [],
            daysOfWeekHighlighted: [],
            defaultViewDate: void 0,
            disableTouchKeyboard: !1,
            enableOnReadonly: !0,
            format: 'mm/dd/yyyy',
            language: 'en',
            maxDate: null,
            maxNumberOfDates: 1,
            maxView: 3,
            minDate: null,
            nextArrow: '»',
            orientation: 'auto',
            pickLevel: 0,
            prevArrow: '«',
            showDaysOfWeek: !0,
            showOnClick: !0,
            showOnFocus: !0,
            startView: 0,
            title: '',
            todayButton: !1,
            todayButtonMode: 0,
            todayHighlight: !1,
            updateOnBlur: !0,
            weekNumbers: 0,
            weekStart: 0,
        },
        { language: U, format: q, weekStart: z } = J;
    function X(e, i) {
        return e.length < 6 && i >= 0 && i < 7 ? t(e, i) : e;
    }
    function G(e, t) {
        switch (4 === e ? (6 === t ? 3 : !t + 1) : e) {
            case 1:
                return w;
            case 2:
                return y;
            case 3:
                return D;
        }
    }
    function Q(e, t, i) {
        return (
            (t.weekStart = e),
            (t.weekEnd = (e + 6) % 7),
            4 === i && (t.getWeekNumber = G(4, e)),
            e
        );
    }
    function Z(e, t, i, n) {
        const s = V(e, t, i);
        return void 0 !== s ? s : n;
    }
    function ee(e, t, i = 3) {
        const n = parseInt(e, 10);
        return n >= 0 && n <= i ? n : t;
    }
    function te(e, t, i, n = void 0) {
        t in e && (i in e || (e[i] = n ? n(e[t]) : e[t]), delete e[t]);
    }
    function ie(e, i) {
        const n = Object.assign({}, e),
            s = {},
            a = i.constructor.locales,
            r = !!i.rangeSideIndex;
        let {
            datesDisabled: o,
            format: d,
            language: l,
            locale: h,
            maxDate: u,
            maxView: f,
            minDate: p,
            pickLevel: m,
            startView: w,
            weekNumbers: g,
            weekStart: y,
        } = i.config || {};
        if (
            (te(n, 'calendarWeeks', 'weekNumbers', (e) => (e ? 1 : 0)),
            te(n, 'clearBtn', 'clearButton'),
            te(n, 'todayBtn', 'todayButton'),
            te(n, 'todayBtnMode', 'todayButtonMode'),
            n.language)
        ) {
            let e;
            if (
                (n.language !== l &&
                    (a[n.language]
                        ? (e = n.language)
                        : ((e = n.language.split('-')[0]), a[e] || (e = !1))),
                delete n.language,
                e)
            ) {
                l = s.language = e;
                const t = h || a[U];
                (h = Object.assign({ format: q, weekStart: z }, a[U])),
                    l !== U && Object.assign(h, a[l]),
                    (s.locale = h),
                    d === t.format && (d = s.format = h.format),
                    y === t.weekStart && (y = Q(h.weekStart, s, g));
            }
        }
        if (n.format) {
            const e = 'function' == typeof n.format.toDisplay,
                t = 'function' == typeof n.format.toValue,
                i = v.test(n.format);
            ((e && t) || i) && (d = s.format = n.format), delete n.format;
        }
        let D = m;
        'pickLevel' in n && ((D = ee(n.pickLevel, m, 2)), delete n.pickLevel),
            D !== m &&
                (D > m &&
                    ('minDate' in n || (n.minDate = p),
                    'maxDate' in n || (n.maxDate = u)),
                o && !n.datesDisabled && (n.datesDisabled = []),
                (m = s.pickLevel = D));
        let k = p,
            x = u;
        if ('minDate' in n) {
            const e = c(0, 0, 1);
            (k = null === n.minDate ? e : Z(n.minDate, d, h, k)),
                k !== e && (k = b(k, m, !1)),
                delete n.minDate;
        }
        if (
            ('maxDate' in n &&
                ((x = null === n.maxDate ? void 0 : Z(n.maxDate, d, h, x)),
                void 0 !== x && (x = b(x, m, !0)),
                delete n.maxDate),
            x < k
                ? ((p = s.minDate = x), (u = s.maxDate = k))
                : (p !== k && (p = s.minDate = k),
                  u !== x && (u = s.maxDate = x)),
            n.datesDisabled)
        ) {
            const e = n.datesDisabled;
            if ('function' == typeof e)
                (s.datesDisabled = null),
                    (s.checkDisabled = (t, i) => e(new Date(t), i, r));
            else {
                const i = (s.datesDisabled = e.reduce((e, i) => {
                    const n = V(i, d, h);
                    return void 0 !== n ? t(e, b(n, m, r)) : e;
                }, []));
                s.checkDisabled = (e) => i.includes(e);
            }
            delete n.datesDisabled;
        }
        if ('defaultViewDate' in n) {
            const e = V(n.defaultViewDate, d, h);
            void 0 !== e && (s.defaultViewDate = e), delete n.defaultViewDate;
        }
        if ('weekStart' in n) {
            const e = Number(n.weekStart) % 7;
            isNaN(e) || (y = Q(e, s, g)), delete n.weekStart;
        }
        if (
            (n.daysOfWeekDisabled &&
                ((s.daysOfWeekDisabled = n.daysOfWeekDisabled.reduce(X, [])),
                delete n.daysOfWeekDisabled),
            n.daysOfWeekHighlighted &&
                ((s.daysOfWeekHighlighted = n.daysOfWeekHighlighted.reduce(
                    X,
                    []
                )),
                delete n.daysOfWeekHighlighted),
            'weekNumbers' in n)
        ) {
            let e = n.weekNumbers;
            if (e) {
                const t =
                    'function' == typeof e
                        ? (t, i) => e(new Date(t), i)
                        : G((e = parseInt(e, 10)), y);
                t && ((g = s.weekNumbers = e), (s.getWeekNumber = t));
            } else (g = s.weekNumbers = 0), (s.getWeekNumber = null);
            delete n.weekNumbers;
        }
        if ('maxNumberOfDates' in n) {
            const e = parseInt(n.maxNumberOfDates, 10);
            e >= 0 && ((s.maxNumberOfDates = e), (s.multidate = 1 !== e)),
                delete n.maxNumberOfDates;
        }
        n.dateDelimiter &&
            ((s.dateDelimiter = String(n.dateDelimiter)),
            delete n.dateDelimiter);
        let M = f;
        'maxView' in n && ((M = ee(n.maxView, f)), delete n.maxView),
            (M = m > M ? m : M),
            M !== f && (f = s.maxView = M);
        let N = w;
        if (
            ('startView' in n && ((N = ee(n.startView, N)), delete n.startView),
            N < m ? (N = m) : N > f && (N = f),
            N !== w && (s.startView = N),
            n.prevArrow)
        ) {
            const e = L(n.prevArrow);
            e.childNodes.length > 0 && (s.prevArrow = e.childNodes),
                delete n.prevArrow;
        }
        if (n.nextArrow) {
            const e = L(n.nextArrow);
            e.childNodes.length > 0 && (s.nextArrow = e.childNodes),
                delete n.nextArrow;
        }
        if (
            ('disableTouchKeyboard' in n &&
                ((s.disableTouchKeyboard =
                    'ontouchstart' in document && !!n.disableTouchKeyboard),
                delete n.disableTouchKeyboard),
            n.orientation)
        ) {
            const e = n.orientation.toLowerCase().split(/\s+/g);
            (s.orientation = {
                x: e.find((e) => 'left' === e || 'right' === e) || 'auto',
                y: e.find((e) => 'top' === e || 'bottom' === e) || 'auto',
            }),
                delete n.orientation;
        }
        if ('todayButtonMode' in n) {
            switch (n.todayButtonMode) {
                case 0:
                case 1:
                    s.todayButtonMode = n.todayButtonMode;
            }
            delete n.todayButtonMode;
        }
        return (
            Object.entries(n).forEach(([e, t]) => {
                void 0 !== t && e in J && (s[e] = t);
            }),
            s
        );
    }
    const ne = {
        show: { key: 'ArrowDown' },
        hide: null,
        toggle: { key: 'Escape' },
        prevButton: { key: 'ArrowLeft', ctrlOrMetaKey: !0 },
        nextButton: { key: 'ArrowRight', ctrlOrMetaKey: !0 },
        viewSwitch: { key: 'ArrowUp', ctrlOrMetaKey: !0 },
        clearButton: { key: 'Backspace', ctrlOrMetaKey: !0 },
        todayButton: { key: '.', ctrlOrMetaKey: !0 },
        exitEditMode: { key: 'ArrowDown', ctrlOrMetaKey: !0 },
    };
    const se = (e) =>
            e
                .map(
                    (e) =>
                        `<button type="button" class="%buttonClass% ${e}" tabindex="-1"></button>`
                )
                .join(''),
        ae = r(
            `<div class="datepicker">\n  <div class="datepicker-picker">\n    <div class="datepicker-header">\n      <div class="datepicker-title"></div>\n      <div class="datepicker-controls">\n        ${se(
                ['prev-button prev-btn', 'view-switch', 'next-button next-btn']
            )}\n      </div>\n    </div>\n    <div class="datepicker-main"></div>\n    <div class="datepicker-footer">\n      <div class="datepicker-controls">\n        ${se(
                ['today-button today-btn', 'clear-button clear-btn']
            )}\n      </div>\n    </div>\n  </div>\n</div>`
        ),
        re = r(
            `<div class="days">\n  <div class="days-of-week">${a('span', 7, {
                class: 'dow',
            })}</div>\n  <div class="datepicker-grid">${a(
                'span',
                42
            )}</div>\n</div>`
        ),
        oe = r(
            `<div class="week-numbers calendar-weeks">\n  <div class="days-of-week"><span class="dow"></span></div>\n  <div class="weeks">${a(
                'span',
                6,
                { class: 'week' }
            )}</div>\n</div>`
        );
    class de {
        constructor(e, t) {
            Object.assign(this, t, {
                picker: e,
                element: L('<div class="datepicker-view"></div>').firstChild,
                selected: [],
                isRangeEnd: !!e.datepicker.rangeSideIndex,
            }),
                this.init(this.picker.datepicker.config);
        }
        init(e) {
            'pickLevel' in e && (this.isMinView = this.id === e.pickLevel),
                this.setOptions(e),
                this.updateFocus(),
                this.updateSelection();
        }
        prepareForRender(e, t, i) {
            this.disabled = [];
            const n = this.picker;
            n.setViewSwitchLabel(e),
                n.setPrevButtonDisabled(t),
                n.setNextButtonDisabled(i);
        }
        setDisabled(e, i) {
            i.add('disabled'), t(this.disabled, e);
        }
        performBeforeHook(e, t) {
            let i = this.beforeShow(new Date(t));
            switch (typeof i) {
                case 'boolean':
                    i = { enabled: i };
                    break;
                case 'string':
                    i = { classes: i };
            }
            if (i) {
                const n = e.classList;
                if ((!1 === i.enabled && this.setDisabled(t, n), i.classes)) {
                    const e = i.classes.split(/\s+/);
                    n.add(...e),
                        e.includes('disabled') && this.setDisabled(t, n);
                }
                i.content &&
                    (function (e, t) {
                        _(e),
                            t instanceof DocumentFragment
                                ? e.appendChild(t)
                                : 'string' == typeof t
                                ? e.appendChild(L(t))
                                : 'function' == typeof t.forEach &&
                                  t.forEach((t) => {
                                      e.appendChild(t);
                                  });
                    })(e, i.content);
            }
        }
        renderCell(e, t, i, n, { selected: s, range: a }, r, o = []) {
            (e.textContent = t), this.isMinView && (e.dataset.date = n);
            const d = e.classList;
            if (
                ((e.className = `datepicker-cell ${this.cellClass}`),
                i < this.first ? d.add('prev') : i > this.last && d.add('next'),
                d.add(...o),
                (r || this.checkDisabled(n, this.id)) && this.setDisabled(n, d),
                a)
            ) {
                const [e, t] = a;
                i > e && i < t && d.add('range'),
                    i === e && d.add('range-start'),
                    i === t && d.add('range-end');
            }
            s.includes(i) && d.add('selected'),
                i === this.focused && d.add('focused'),
                this.beforeShow && this.performBeforeHook(e, n);
        }
        refreshCell(e, t, i, [n, s]) {
            const a = e.classList;
            a.remove(
                'range',
                'range-start',
                'range-end',
                'selected',
                'focused'
            ),
                t > n && t < s && a.add('range'),
                t === n && a.add('range-start'),
                t === s && a.add('range-end'),
                i.includes(t) && a.add('selected'),
                t === this.focused && a.add('focused');
        }
        changeFocusedCell(e) {
            this.grid.querySelectorAll('.focused').forEach((e) => {
                e.classList.remove('focused');
            }),
                this.grid.children[e].classList.add('focused');
        }
    }
    class ce extends de {
        constructor(e) {
            super(e, { id: 0, name: 'days', cellClass: 'day' });
        }
        init(e, t = !0) {
            if (t) {
                const e = L(re).firstChild;
                (this.dow = e.firstChild),
                    (this.grid = e.lastChild),
                    this.element.appendChild(e);
            }
            super.init(e);
        }
        setOptions(e) {
            let t;
            if (
                ('minDate' in e && (this.minDate = e.minDate),
                'maxDate' in e && (this.maxDate = e.maxDate),
                e.checkDisabled && (this.checkDisabled = e.checkDisabled),
                e.daysOfWeekDisabled &&
                    ((this.daysOfWeekDisabled = e.daysOfWeekDisabled),
                    (t = !0)),
                e.daysOfWeekHighlighted &&
                    (this.daysOfWeekHighlighted = e.daysOfWeekHighlighted),
                'todayHighlight' in e &&
                    (this.todayHighlight = e.todayHighlight),
                'weekStart' in e &&
                    ((this.weekStart = e.weekStart),
                    (this.weekEnd = e.weekEnd),
                    (t = !0)),
                e.locale)
            ) {
                const i = (this.locale = e.locale);
                (this.dayNames = i.daysMin),
                    (this.switchLabelFormat = i.titleFormat),
                    (t = !0);
            }
            if (
                ('beforeShowDay' in e &&
                    (this.beforeShow =
                        'function' == typeof e.beforeShowDay
                            ? e.beforeShowDay
                            : void 0),
                'weekNumbers' in e)
            )
                if (e.weekNumbers && !this.weekNumbers) {
                    const e = L(oe).firstChild;
                    (this.weekNumbers = {
                        element: e,
                        dow: e.firstChild,
                        weeks: e.lastChild,
                    }),
                        this.element.insertBefore(e, this.element.firstChild);
                } else
                    this.weekNumbers &&
                        !e.weekNumbers &&
                        (this.element.removeChild(this.weekNumbers.element),
                        (this.weekNumbers = null));
            'getWeekNumber' in e && (this.getWeekNumber = e.getWeekNumber),
                'showDaysOfWeek' in e &&
                    (e.showDaysOfWeek
                        ? (K(this.dow),
                          this.weekNumbers && K(this.weekNumbers.dow))
                        : (W(this.dow),
                          this.weekNumbers && W(this.weekNumbers.dow))),
                t &&
                    Array.from(this.dow.children).forEach((e, t) => {
                        const i = (this.weekStart + t) % 7;
                        (e.textContent = this.dayNames[i]),
                            (e.className = this.daysOfWeekDisabled.includes(i)
                                ? 'dow disabled'
                                : 'dow');
                    });
        }
        updateFocus() {
            const e = new Date(this.picker.viewDate),
                t = e.getFullYear(),
                i = e.getMonth(),
                n = c(t, i, 1),
                s = p(n, this.weekStart, this.weekStart);
            (this.first = n),
                (this.last = c(t, i + 1, 0)),
                (this.start = s),
                (this.focused = this.picker.viewDate);
        }
        updateSelection() {
            const { dates: e, rangepicker: t } = this.picker.datepicker;
            (this.selected = e), t && (this.range = t.dates);
        }
        render() {
            if (
                ((this.today = this.todayHighlight ? d() : void 0),
                this.prepareForRender(
                    B(this.focused, this.switchLabelFormat, this.locale),
                    this.first <= this.minDate,
                    this.last >= this.maxDate
                ),
                this.weekNumbers)
            ) {
                const e = this.weekStart,
                    t = p(this.first, e, e);
                Array.from(this.weekNumbers.weeks.children).forEach((i, n) => {
                    const s = l(t, 7 * n);
                    (i.textContent = this.getWeekNumber(s, e)),
                        n > 3 &&
                            i.classList[s > this.last ? 'add' : 'remove'](
                                'next'
                            );
                });
            }
            Array.from(this.grid.children).forEach((e, t) => {
                const i = l(this.start, t),
                    n = new Date(i),
                    s = n.getDay(),
                    a = [];
                this.today === i && a.push('today'),
                    this.daysOfWeekHighlighted.includes(s) &&
                        a.push('highlighted'),
                    this.renderCell(
                        e,
                        n.getDate(),
                        i,
                        i,
                        this,
                        i < this.minDate ||
                            i > this.maxDate ||
                            this.daysOfWeekDisabled.includes(s),
                        a
                    );
            });
        }
        refresh() {
            const e = this.range || [];
            Array.from(this.grid.children).forEach((t) => {
                this.refreshCell(t, Number(t.dataset.date), this.selected, e);
            });
        }
        refreshFocus() {
            this.changeFocusedCell(
                Math.round((this.focused - this.start) / 864e5)
            );
        }
    }
    function le(e, t) {
        if (!e || !e[0] || !e[1]) return;
        const [[i, n], [s, a]] = e;
        return i > t || s < t ? void 0 : [i === t ? n : -1, s === t ? a : 12];
    }
    class he extends de {
        constructor(e) {
            super(e, { id: 1, name: 'months', cellClass: 'month' });
        }
        init(e, t = !0) {
            t &&
                ((this.grid = this.element),
                this.element.classList.add('months', 'datepicker-grid'),
                this.grid.appendChild(
                    L(a('span', 12, { 'data-month': (e) => e }))
                ),
                (this.first = 0),
                (this.last = 11)),
                super.init(e);
        }
        setOptions(e) {
            if (
                (e.locale && (this.monthNames = e.locale.monthsShort),
                'minDate' in e)
            )
                if (void 0 === e.minDate)
                    this.minYear = this.minMonth = this.minDate = void 0;
                else {
                    const t = new Date(e.minDate);
                    (this.minYear = t.getFullYear()),
                        (this.minMonth = t.getMonth()),
                        (this.minDate = t.setDate(1));
                }
            if ('maxDate' in e)
                if (void 0 === e.maxDate)
                    this.maxYear = this.maxMonth = this.maxDate = void 0;
                else {
                    const t = new Date(e.maxDate);
                    (this.maxYear = t.getFullYear()),
                        (this.maxMonth = t.getMonth()),
                        (this.maxDate = c(this.maxYear, this.maxMonth + 1, 0));
                }
            e.checkDisabled &&
                (this.checkDisabled =
                    this.isMinView || null === e.datesDisabled
                        ? e.checkDisabled
                        : () => !1),
                'beforeShowMonth' in e &&
                    (this.beforeShow =
                        'function' == typeof e.beforeShowMonth
                            ? e.beforeShowMonth
                            : void 0);
        }
        updateFocus() {
            const e = new Date(this.picker.viewDate);
            (this.year = e.getFullYear()), (this.focused = e.getMonth());
        }
        updateSelection() {
            const { dates: e, rangepicker: i } = this.picker.datepicker;
            (this.selected = e.reduce((e, i) => {
                const n = new Date(i),
                    s = n.getFullYear(),
                    a = n.getMonth();
                return void 0 === e[s] ? (e[s] = [a]) : t(e[s], a), e;
            }, {})),
                i &&
                    i.dates &&
                    (this.range = i.dates.map((e) => {
                        const t = new Date(e);
                        return isNaN(t)
                            ? void 0
                            : [t.getFullYear(), t.getMonth()];
                    }));
        }
        render() {
            this.prepareForRender(
                this.year,
                this.year <= this.minYear,
                this.year >= this.maxYear
            );
            const e = this.selected[this.year] || [],
                t = this.year < this.minYear || this.year > this.maxYear,
                i = this.year === this.minYear,
                n = this.year === this.maxYear,
                s = le(this.range, this.year);
            Array.from(this.grid.children).forEach((a, r) => {
                const o = b(new Date(this.year, r, 1), 1, this.isRangeEnd);
                this.renderCell(
                    a,
                    this.monthNames[r],
                    r,
                    o,
                    { selected: e, range: s },
                    t || (i && r < this.minMonth) || (n && r > this.maxMonth)
                );
            });
        }
        refresh() {
            const e = this.selected[this.year] || [],
                t = le(this.range, this.year) || [];
            Array.from(this.grid.children).forEach((i, n) => {
                this.refreshCell(i, n, e, t);
            });
        }
        refreshFocus() {
            this.changeFocusedCell(this.focused);
        }
    }
    class ue extends de {
        constructor(e, t) {
            super(e, t);
        }
        init(e, t = !0) {
            var i;
            t &&
                ((this.navStep = 10 * this.step),
                (this.beforeShowOption = `beforeShow${
                    ((i = this.cellClass),
                    [...i].reduce(
                        (e, t, i) => e + (i ? t : t.toUpperCase()),
                        ''
                    ))
                }`),
                (this.grid = this.element),
                this.element.classList.add(this.name, 'datepicker-grid'),
                this.grid.appendChild(L(a('span', 12)))),
                super.init(e);
        }
        setOptions(e) {
            if (
                ('minDate' in e &&
                    (void 0 === e.minDate
                        ? (this.minYear = this.minDate = void 0)
                        : ((this.minYear = k(e.minDate, this.step)),
                          (this.minDate = c(this.minYear, 0, 1)))),
                'maxDate' in e &&
                    (void 0 === e.maxDate
                        ? (this.maxYear = this.maxDate = void 0)
                        : ((this.maxYear = k(e.maxDate, this.step)),
                          (this.maxDate = c(this.maxYear, 11, 31)))),
                e.checkDisabled &&
                    (this.checkDisabled =
                        this.isMinView || null === e.datesDisabled
                            ? e.checkDisabled
                            : () => !1),
                this.beforeShowOption in e)
            ) {
                const t = e[this.beforeShowOption];
                this.beforeShow = 'function' == typeof t ? t : void 0;
            }
        }
        updateFocus() {
            const e = new Date(this.picker.viewDate),
                t = k(e, this.navStep),
                i = t + 9 * this.step;
            (this.first = t),
                (this.last = i),
                (this.start = t - this.step),
                (this.focused = k(e, this.step));
        }
        updateSelection() {
            const { dates: e, rangepicker: i } = this.picker.datepicker;
            (this.selected = e.reduce((e, i) => t(e, k(i, this.step)), [])),
                i &&
                    i.dates &&
                    (this.range = i.dates.map((e) => {
                        if (void 0 !== e) return k(e, this.step);
                    }));
        }
        render() {
            this.prepareForRender(
                `${this.first}-${this.last}`,
                this.first <= this.minYear,
                this.last >= this.maxYear
            ),
                Array.from(this.grid.children).forEach((e, t) => {
                    const i = this.start + t * this.step,
                        n = b(new Date(i, 0, 1), 2, this.isRangeEnd);
                    (e.dataset.year = i),
                        this.renderCell(
                            e,
                            i,
                            i,
                            n,
                            this,
                            i < this.minYear || i > this.maxYear
                        );
                });
        }
        refresh() {
            const e = this.range || [];
            Array.from(this.grid.children).forEach((t) => {
                this.refreshCell(t, Number(t.textContent), this.selected, e);
            });
        }
        refreshFocus() {
            this.changeFocusedCell(
                Math.round((this.focused - this.start) / this.step)
            );
        }
    }
    function fe(e, t) {
        const i = {
            bubbles: !0,
            cancelable: !0,
            detail: {
                date: e.getDate(),
                viewDate: new Date(e.picker.viewDate),
                viewId: e.picker.currentView.id,
                datepicker: e,
            },
        };
        e.element.dispatchEvent(new CustomEvent(t, i));
    }
    function pe(e, t) {
        const { config: i, picker: n } = e,
            { currentView: a, viewDate: r } = n;
        let o;
        switch (a.id) {
            case 0:
                o = h(r, t);
                break;
            case 1:
                o = u(r, t);
                break;
            default:
                o = u(r, t * a.navStep);
        }
        (o = s(o, i.minDate, i.maxDate)), n.changeFocus(o).render();
    }
    function me(e) {
        const t = e.picker.currentView.id;
        t !== e.config.maxView && e.picker.changeView(t + 1).render();
    }
    function we(e) {
        e.setDate({ clear: !0 });
    }
    function ge(e) {
        const t = d();
        1 === e.config.todayButtonMode
            ? e.setDate(t, { forceRefresh: !0, viewDate: t })
            : e.setFocusedDate(t, !0);
    }
    function ye(e) {
        const t = () => {
                e.config.updateOnBlur
                    ? e.update({ revert: !0 })
                    : e.refresh('input'),
                    e.hide();
            },
            i = e.element;
        Y(i) ? i.addEventListener('blur', t, { once: !0 }) : t();
    }
    function De(e, t) {
        const i = e.picker,
            n = new Date(i.viewDate),
            s = i.currentView.id,
            a = 1 === s ? h(n, t - n.getMonth()) : u(n, t - n.getFullYear());
        i.changeFocus(a)
            .changeView(s - 1)
            .render();
    }
    function ke(e) {
        me(e);
    }
    function be(e) {
        pe(e, -1);
    }
    function ve(e) {
        pe(e, 1);
    }
    function xe(e, t) {
        const i = I(t, '.datepicker-cell');
        if (!i || i.classList.contains('disabled')) return;
        const { id: n, isMinView: s } = e.picker.currentView,
            a = i.dataset;
        s
            ? e.setDate(Number(a.date))
            : De(e, Number(1 === n ? a.month : a.year));
    }
    function Me(e) {
        e.preventDefault();
    }
    const Ne = ['left', 'top', 'right', 'bottom'].reduce(
            (e, t) => ((e[t] = `datepicker-orient-${t}`), e),
            {}
        ),
        Se = (e) => (e ? `${e}px` : e);
    function Oe(e, t) {
        if (
            ('title' in t &&
                (t.title
                    ? ((e.controls.title.textContent = t.title),
                      K(e.controls.title))
                    : ((e.controls.title.textContent = ''),
                      W(e.controls.title))),
            t.prevArrow)
        ) {
            const i = e.controls.prevButton;
            _(i),
                t.prevArrow.forEach((e) => {
                    i.appendChild(e.cloneNode(!0));
                });
        }
        if (t.nextArrow) {
            const i = e.controls.nextButton;
            _(i),
                t.nextArrow.forEach((e) => {
                    i.appendChild(e.cloneNode(!0));
                });
        }
        if (
            (t.locale &&
                ((e.controls.todayButton.textContent = t.locale.today),
                (e.controls.clearButton.textContent = t.locale.clear)),
            'todayButton' in t &&
                (t.todayButton
                    ? K(e.controls.todayButton)
                    : W(e.controls.todayButton)),
            'minDate' in t || 'maxDate' in t)
        ) {
            const { minDate: t, maxDate: i } = e.datepicker.config;
            e.controls.todayButton.disabled = !n(d(), t, i);
        }
        'clearButton' in t &&
            (t.clearButton
                ? K(e.controls.clearButton)
                : W(e.controls.clearButton));
    }
    function Ce(t) {
        const { dates: i, config: n, rangeSideIndex: a } = t;
        return s(
            i.length > 0 ? e(i) : b(n.defaultViewDate, n.pickLevel, a),
            n.minDate,
            n.maxDate
        );
    }
    function Fe(e, t) {
        '_oldViewDate' in e ||
            t === e.viewDate ||
            (e._oldViewDate = e.viewDate),
            (e.viewDate = t);
        const { id: i, year: n, first: s, last: a } = e.currentView,
            r = new Date(t).getFullYear();
        switch (i) {
            case 0:
                return t < s || t > a;
            case 1:
                return r !== n;
            default:
                return r < s || r > a;
        }
    }
    function Ve(e) {
        return window.getComputedStyle(e).direction;
    }
    function Be(e) {
        const t = A(e);
        if (t !== document.body && t)
            return 'visible' !== window.getComputedStyle(t).overflow
                ? t
                : Be(t);
    }
    class Ee {
        constructor(e) {
            const { config: t, inputField: i } = (this.datepicker = e),
                n = ae.replace(/%buttonClass%/g, t.buttonClass),
                s = (this.element = L(n).firstChild),
                [a, r, o] = s.firstChild.children,
                d = a.firstElementChild,
                [c, l, h] = a.lastElementChild.children,
                [u, f] = o.firstChild.children,
                p = {
                    title: d,
                    prevButton: c,
                    viewSwitch: l,
                    nextButton: h,
                    todayButton: u,
                    clearButton: f,
                };
            (this.main = r), (this.controls = p);
            const m = i ? 'dropdown' : 'inline';
            s.classList.add(`datepicker-${m}`),
                Oe(this, t),
                (this.viewDate = Ce(e)),
                R(e, [
                    [s, 'mousedown', Me],
                    [r, 'click', xe.bind(null, e)],
                    [p.viewSwitch, 'click', ke.bind(null, e)],
                    [p.prevButton, 'click', be.bind(null, e)],
                    [p.nextButton, 'click', ve.bind(null, e)],
                    [p.todayButton, 'click', ge.bind(null, e)],
                    [p.clearButton, 'click', we.bind(null, e)],
                ]),
                (this.views = [
                    new ce(this),
                    new he(this),
                    new ue(this, {
                        id: 2,
                        name: 'years',
                        cellClass: 'year',
                        step: 1,
                    }),
                    new ue(this, {
                        id: 3,
                        name: 'decades',
                        cellClass: 'decade',
                        step: 10,
                    }),
                ]),
                (this.currentView = this.views[t.startView]),
                this.currentView.render(),
                this.main.appendChild(this.currentView.element),
                t.container
                    ? t.container.appendChild(this.element)
                    : i.after(this.element);
        }
        setOptions(e) {
            Oe(this, e),
                this.views.forEach((t) => {
                    t.init(e, !1);
                }),
                this.currentView.render();
        }
        detach() {
            this.element.remove();
        }
        show() {
            if (this.active) return;
            const { datepicker: e, element: t } = this,
                i = e.inputField;
            if (i) {
                const n = Ve(i);
                n !== Ve(A(t))
                    ? (t.dir = n)
                    : t.dir && t.removeAttribute('dir'),
                    this.place(),
                    t.classList.add('active'),
                    e.config.disableTouchKeyboard && i.blur();
            } else t.classList.add('active');
            (this.active = !0), fe(e, 'show');
        }
        hide() {
            this.active &&
                (this.datepicker.exitEditMode(),
                this.element.classList.remove('active'),
                (this.active = !1),
                fe(this.datepicker, 'hide'));
        }
        place() {
            const { classList: e, style: t } = this.element;
            t.display = 'block';
            const { width: i, height: n } =
                    this.element.getBoundingClientRect(),
                s = this.element.offsetParent;
            t.display = '';
            const { config: a, inputField: r } = this.datepicker,
                {
                    left: o,
                    top: d,
                    right: c,
                    bottom: l,
                    width: h,
                    height: u,
                } = r.getBoundingClientRect();
            let { x: f, y: p } = a.orientation,
                m = o,
                w = d;
            if (s !== document.body && s) {
                const e = s.getBoundingClientRect();
                (m -= e.left - s.scrollLeft), (w -= e.top - s.scrollTop);
            } else (m += window.scrollX), (w += window.scrollY);
            const g = Be(r);
            let y = 0,
                D = 0,
                { clientWidth: k, clientHeight: b } = document.documentElement;
            if (g) {
                const e = g.getBoundingClientRect();
                e.top > 0 && (D = e.top),
                    e.left > 0 && (y = e.left),
                    e.right < k && (k = e.right),
                    e.bottom < b && (b = e.bottom);
            }
            let v = 0;
            'auto' === f &&
                (o < y
                    ? ((f = 'left'), (v = y - o))
                    : o + i > k
                    ? ((f = 'right'), k < c && (v = k - c))
                    : (f =
                          'rtl' === Ve(r)
                              ? c - i < y
                                  ? 'left'
                                  : 'right'
                              : 'left')),
                'right' === f && (m += h - i),
                (m += v),
                'auto' === p && (p = d - n > D && l + n > b ? 'top' : 'bottom'),
                'top' === p ? (w -= n) : (w += u),
                e.remove(...Object.values(Ne)),
                e.add(Ne[f], Ne[p]),
                (t.left = Se(m)),
                (t.top = Se(w));
        }
        setViewSwitchLabel(e) {
            this.controls.viewSwitch.textContent = e;
        }
        setPrevButtonDisabled(e) {
            this.controls.prevButton.disabled = e;
        }
        setNextButtonDisabled(e) {
            this.controls.nextButton.disabled = e;
        }
        changeView(e) {
            const t = this.currentView;
            return (
                e !== t.id &&
                    (this._oldView || (this._oldView = t),
                    (this.currentView = this.views[e]),
                    (this._renderMethod = 'render')),
                this
            );
        }
        changeFocus(e) {
            return (
                (this._renderMethod = Fe(this, e) ? 'render' : 'refreshFocus'),
                this.views.forEach((e) => {
                    e.updateFocus();
                }),
                this
            );
        }
        update(e = void 0) {
            const t = void 0 === e ? Ce(this.datepicker) : e;
            return (
                (this._renderMethod = Fe(this, t) ? 'render' : 'refresh'),
                this.views.forEach((e) => {
                    e.updateFocus(), e.updateSelection();
                }),
                this
            );
        }
        render(e = !0) {
            const { currentView: t, datepicker: i, _oldView: n } = this,
                s = new Date(this._oldViewDate),
                a = (e && this._renderMethod) || 'render';
            if (
                (delete this._oldView,
                delete this._oldViewDate,
                delete this._renderMethod,
                t[a](),
                n &&
                    (this.main.replaceChild(t.element, n.element),
                    fe(i, 'changeView')),
                !isNaN(s))
            ) {
                const e = new Date(this.viewDate);
                e.getFullYear() !== s.getFullYear() && fe(i, 'changeYear'),
                    e.getMonth() !== s.getMonth() && fe(i, 'changeMonth');
            }
        }
    }
    function Le(e, t, i, s, a, r) {
        if (n(e, a, r)) {
            if (s(e)) {
                return Le(t(e, i), t, i, s, a, r);
            }
            return e;
        }
    }
    function Ae(e, t, i) {
        const n = e.picker,
            s = n.currentView,
            a = s.step || 1;
        let r,
            o = n.viewDate;
        switch (s.id) {
            case 0:
                (o = l(o, i ? 7 * t : t)), (r = l);
                break;
            case 1:
                (o = h(o, i ? 4 * t : t)), (r = h);
                break;
            default:
                (o = u(o, t * (i ? 4 : 1) * a)), (r = u);
        }
        (o = Le(
            o,
            r,
            t < 0 ? -a : a,
            (e) => s.disabled.includes(e),
            s.minDate,
            s.maxDate
        )),
            void 0 !== o && n.changeFocus(o).render();
    }
    function Ye(e, t) {
        const { config: i, picker: n, editMode: s } = e,
            a = n.active,
            { key: r, altKey: o, shiftKey: d } = t,
            c = t.ctrlKey || t.metaKey,
            l = () => {
                t.preventDefault(), t.stopPropagation();
            };
        if ('Tab' === r) return void ye(e);
        if ('Enter' === r) {
            if (a)
                if (s) e.exitEditMode({ update: !0, autohide: i.autohide });
                else {
                    const t = n.currentView;
                    t.isMinView
                        ? e.setDate(n.viewDate)
                        : (n.changeView(t.id - 1).render(), l());
                }
            else e.update();
            return;
        }
        const h = i.shortcutKeys,
            u = { key: r, ctrlOrMetaKey: c, altKey: o, shiftKey: d },
            f = Object.keys(h).find((e) => {
                const t = h[e];
                return !Object.keys(t).find((e) => t[e] !== u[e]);
            });
        if (f) {
            let t;
            if (
                ('toggle' === f
                    ? (t = f)
                    : s
                    ? 'exitEditMode' === f && (t = f)
                    : a
                    ? 'hide' === f
                        ? (t = f)
                        : 'prevButton' === f
                        ? (t = [pe, [e, -1]])
                        : 'nextButton' === f
                        ? (t = [pe, [e, 1]])
                        : 'viewSwitch' === f
                        ? (t = [me, [e]])
                        : i.clearButton && 'clearButton' === f
                        ? (t = [we, [e]])
                        : i.todayButton &&
                          'todayButton' === f &&
                          (t = [ge, [e]])
                    : 'show' === f && (t = f),
                t)
            )
                return (
                    Array.isArray(t) ? t[0].apply(null, t[1]) : e[t](), void l()
                );
        }
        if (!a || s) return;
        const p = (i, n) => {
            d || c || o ? e.enterEditMode() : (Ae(e, i, n), t.preventDefault());
        };
        'ArrowLeft' === r
            ? p(-1, !1)
            : 'ArrowRight' === r
            ? p(1, !1)
            : 'ArrowUp' === r
            ? p(-1, !0)
            : 'ArrowDown' === r
            ? p(1, !0)
            : ('Backspace' === r ||
                  'Delete' === r ||
                  (r && 1 === r.length && !c)) &&
              e.enterEditMode();
    }
    function We(e) {
        e.config.showOnFocus && !e._showing && e.show();
    }
    function Ke(e, t) {
        const i = t.target;
        (e.picker.active || e.config.showOnClick) &&
            ((i._active = Y(i)),
            (i._clicking = setTimeout(() => {
                delete i._active, delete i._clicking;
            }, 2e3)));
    }
    function _e(e, t) {
        const i = t.target;
        i._clicking &&
            (clearTimeout(i._clicking),
            delete i._clicking,
            i._active && e.enterEditMode(),
            delete i._active,
            e.config.showOnClick && e.show());
    }
    function Te(e, t) {
        t.clipboardData.types.includes('text/plain') && e.enterEditMode();
    }
    function He(e, t) {
        const { element: i, picker: n } = e;
        if (!n.active && !Y(i)) return;
        const s = n.element;
        I(t, (e) => e === i || e === s) || ye(e);
    }
    function je(e, t) {
        return e.map((e) => B(e, t.format, t.locale)).join(t.dateDelimiter);
    }
    function Re(e, t, i = !1) {
        if (0 === t.length) return i ? [] : void 0;
        const { config: s, dates: a, rangeSideIndex: r } = e,
            { pickLevel: o, maxNumberOfDates: d } = s;
        let c = t.reduce((e, t) => {
            let i = V(t, s.format, s.locale);
            return (
                void 0 === i ||
                    ((i = b(i, o, r)),
                    !n(i, s.minDate, s.maxDate) ||
                        e.includes(i) ||
                        s.checkDisabled(i, o) ||
                        (!(o > 0) &&
                            s.daysOfWeekDisabled.includes(
                                new Date(i).getDay()
                            )) ||
                        e.push(i)),
                e
            );
        }, []);
        return 0 !== c.length
            ? (s.multidate &&
                  !i &&
                  (c = c.reduce(
                      (e, t) => (a.includes(t) || e.push(t), e),
                      a.filter((e) => !c.includes(e))
                  )),
              d && c.length > d ? c.slice(-1 * d) : c)
            : void 0;
    }
    function $e(e, t = 3, i = !0, n = void 0) {
        const { config: s, picker: a, inputField: r } = e;
        if (2 & t) {
            const e = a.active ? s.pickLevel : s.startView;
            a.update(n).changeView(e).render(i);
        }
        1 & t && r && (r.value = je(e.dates, s));
    }
    function Ie(e, t, i) {
        const n = e.config;
        let {
            clear: s,
            render: a,
            autohide: r,
            revert: o,
            forceRefresh: d,
            viewDate: c,
        } = i;
        void 0 === a && (a = !0),
            a ? void 0 === r && (r = n.autohide) : (r = d = !1),
            (c = V(c, n.format, n.locale));
        const l = Re(e, t, s);
        (l || o) &&
            (l && l.toString() !== e.dates.toString()
                ? ((e.dates = l), $e(e, a ? 3 : 1, !0, c), fe(e, 'changeDate'))
                : $e(e, d ? 3 : 1, !0, c),
            r && e.hide());
    }
    function Pe(e, t) {
        return t ? (i) => B(i, t, e.config.locale) : (e) => new Date(e);
    }
    return class {
        constructor(e, t = {}, n = void 0) {
            (e.datepicker = this), (this.element = e), (this.dates = []);
            const s = (this.config = Object.assign(
                {
                    buttonClass:
                        (t.buttonClass && String(t.buttonClass)) || 'button',
                    container: null,
                    defaultViewDate: d(),
                    maxDate: void 0,
                    minDate: void 0,
                },
                ie(J, this)
            ));
            let a;
            if (
                ('INPUT' === e.tagName
                    ? ((a = this.inputField = e),
                      a.classList.add('datepicker-input'),
                      t.container &&
                          (s.container =
                              t.container instanceof HTMLElement
                                  ? t.container
                                  : document.querySelector(t.container)))
                    : (s.container = e),
                n)
            ) {
                const e = n.inputs.indexOf(a),
                    t = n.datepickers;
                if (e < 0 || e > 1 || !Array.isArray(t))
                    throw Error('Invalid rangepicker object.');
                (t[e] = this),
                    (this.rangepicker = n),
                    (this.rangeSideIndex = e);
            }
            (this._options = t),
                Object.assign(s, ie(t, this)),
                (s.shortcutKeys = (function (e) {
                    return Object.keys(ne).reduce((t, i) => {
                        const n = void 0 === e[i] ? ne[i] : e[i],
                            s = n && n.key;
                        if (!s || 'string' != typeof s) return t;
                        const a = {
                            key: s,
                            ctrlOrMetaKey: !!(
                                n.ctrlOrMetaKey ||
                                n.ctrlKey ||
                                n.metaKey
                            ),
                        };
                        return (
                            s.length > 1 &&
                                ((a.altKey = !!n.altKey),
                                (a.shiftKey = !!n.shiftKey)),
                            (t[i] = a),
                            t
                        );
                    }, {});
                })(t.shortcutKeys || {}));
            const r = i(e.value || e.dataset.date, s.dateDelimiter);
            delete e.dataset.date;
            const o = Re(this, r);
            o && o.length > 0 && (this.dates = o),
                a && (a.value = je(this.dates, s));
            const c = (this.picker = new Ee(this)),
                l = [e, 'keydown', Ye.bind(null, this)];
            a
                ? R(this, [
                      l,
                      [a, 'focus', We.bind(null, this)],
                      [a, 'mousedown', Ke.bind(null, this)],
                      [a, 'click', _e.bind(null, this)],
                      [a, 'paste', Te.bind(null, this)],
                      [document, 'mousedown', He.bind(null, this)],
                      [window, 'resize', c.place.bind(c)],
                  ])
                : (R(this, [l]), this.show());
        }
        static formatDate(e, t, i) {
            return B(e, t, (i && P[i]) || P.en);
        }
        static parseDate(e, t, i) {
            return V(e, t, (i && P[i]) || P.en);
        }
        static get locales() {
            return P;
        }
        get active() {
            return !(!this.picker || !this.picker.active);
        }
        get pickerElement() {
            return this.picker ? this.picker.element : void 0;
        }
        setOptions(e) {
            const t = ie(e, this);
            Object.assign(this._options, e),
                Object.assign(this.config, t),
                this.picker.setOptions(t),
                $e(this, 3);
        }
        show() {
            if (this.inputField) {
                const { config: e, inputField: t } = this;
                if (t.disabled || (t.readOnly && !e.enableOnReadonly)) return;
                Y(t) ||
                    e.disableTouchKeyboard ||
                    ((this._showing = !0), t.focus(), delete this._showing);
            }
            this.picker.show();
        }
        hide() {
            this.inputField &&
                (this.picker.hide(),
                this.picker
                    .update()
                    .changeView(this.config.startView)
                    .render());
        }
        toggle() {
            this.picker.active
                ? this.inputField && this.picker.hide()
                : this.show();
        }
        destroy() {
            this.hide(),
                (function (e) {
                    let t = T.get(e);
                    t &&
                        (t.forEach((e) => {
                            j.call(...e);
                        }),
                        T.delete(e));
                })(this),
                this.picker.detach();
            const e = this.element;
            return (
                e.classList.remove('datepicker-input'),
                delete e.datepicker,
                this
            );
        }
        getDate(e = void 0) {
            const t = Pe(this, e);
            return this.config.multidate
                ? this.dates.map(t)
                : this.dates.length > 0
                ? t(this.dates[0])
                : void 0;
        }
        setDate(...t) {
            const i = [...t],
                n = {},
                s = e(t);
            !s ||
                'object' != typeof s ||
                Array.isArray(s) ||
                s instanceof Date ||
                Object.assign(n, i.pop());
            Ie(this, Array.isArray(i[0]) ? i[0] : i, n);
        }
        update(e = void 0) {
            if (!this.inputField) return;
            const t = Object.assign(e || {}, {
                clear: !0,
                render: !0,
                viewDate: void 0,
            });
            Ie(this, i(this.inputField.value, this.config.dateDelimiter), t);
        }
        getFocusedDate(e = void 0) {
            return Pe(this, e)(this.picker.viewDate);
        }
        setFocusedDate(e, t = !1) {
            const { config: i, picker: n, active: s, rangeSideIndex: a } = this,
                r = i.pickLevel,
                o = V(e, i.format, i.locale);
            void 0 !== o &&
                (n.changeFocus(b(o, r, a)),
                s && t && n.changeView(r),
                n.render());
        }
        refresh(e = void 0, t = !1) {
            let i;
            e && 'string' != typeof e && ((t = e), (e = void 0)),
                (i = 'picker' === e ? 2 : 'input' === e ? 1 : 3),
                $e(this, i, !t);
        }
        enterEditMode() {
            const e = this.inputField;
            e &&
                !e.readOnly &&
                this.picker.active &&
                !this.editMode &&
                ((this.editMode = !0), e.classList.add('in-edit'));
        }
        exitEditMode(e = void 0) {
            if (!this.inputField || !this.editMode) return;
            const t = Object.assign({ update: !1 }, e);
            delete this.editMode,
                this.inputField.classList.remove('in-edit'),
                t.update && this.update(t);
        }
    };
})();

/**
 * Russian translation for bootstrap-datepicker
 * Victor Taranenko <darwin@snowdale.com>
 */
(function () {
    Datepicker.locales.ru = {
        days: [
            'Воскресенье',
            'Понедельник',
            'Вторник',
            'Среда',
            'Четверг',
            'Пятница',
            'Суббота',
        ],
        daysShort: ['Вск', 'Пнд', 'Втр', 'Срд', 'Чтв', 'Птн', 'Суб'],
        daysMin: ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
        months: [
            'Январь',
            'Февраль',
            'Март',
            'Апрель',
            'Май',
            'Июнь',
            'Июль',
            'Август',
            'Сентябрь',
            'Октябрь',
            'Ноябрь',
            'Декабрь',
        ],
        monthsShort: [
            'Янв',
            'Фев',
            'Мар',
            'Апр',
            'Май',
            'Июн',
            'Июл',
            'Авг',
            'Сен',
            'Окт',
            'Ноя',
            'Дек',
        ],
        today: 'Сегодня',
        clear: 'Очистить',
        format: 'dd.mm.yyyy',
        weekStart: 1,
        monthsTitle: 'Месяцы',
    };
})();
