/*
   Copyright (c) 2010-2011 Ivo Wetzel.

   Permission is hereby granted, free of charge, to any person obtaining a copy
   of this software and associated documentation files (the "Software"), to deal
   in the Software without restriction, including without limitation the rights
   to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
   copies of the Software, and to permit persons to whom the Software is
   furnished to do so, subject to the following conditions:

   The above copyright notice and this permission notice shall be included in
   all copies or substantial portions of the Software.

   THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
   IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
   FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
   AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
   LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
   OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
   THE SOFTWARE.
*/

(function(undefined) {
    var chr = String.fromCharCode;
    var tok = new Array(65536);
    for (var i = 0; i < 65536; i++) {
        tok[i] = chr(i);
    }

    var enc = '';
    function _encode(data, top) {
        if (typeof data === 'number') {

            // Floats
            var m = data | 0;
            if (m !== data) {
                var add = 0, r = (data - m) * 100;
                if (r < 0) {
                    add = (r + 1 | 0) - r;
                    r = (add >= 1.0 && add <= 1.5) ? r | 0 : r - 1 | 0;

                } else {
                    add = r | 0;
                    r = r - add >= 0.5 ? r + 1 | 0 : add;
                }

                add = 0;
                if (data < 0) {
                    m = 0 - m;
                    r = 0 - r;
                    add = 1;
                }

                if (m < 65536) {
                    if (m === 0) {
                        enc += tok[13 + add] + tok[r + 128];

                    } else {
                        enc += tok[13 + add] + tok[r] + tok[m];
                    }

                } else {
                    enc += tok[15 + add] + tok[m >> 16 & 0xffff]
                                         + tok[m & 0xffff] + tok[r];
                }

            // Fixed
            } else {
                var add = 0;
                if (data <= 0) {
                    data = 0 - data;
                    add = 1;

                } else {
                    data--;
                }

                if (data < 116) {
                    enc += tok[17 + data + add * 116];

                } else if (data < 65536) {
                    enc += tok[1 + add] + tok[data];

                } else {
                    enc += tok[3 + add] + tok[data >> 16 & 0xffff]
                                        + tok[data & 0xffff];
                }
            }

        // Strings
        } else if (typeof data === 'string') {
            var l = data.length;
            enc += tok[7];
            while (l >= 65535) {
                l -= 65535;
                enc += tok[65535];
            }
            enc += tok[l] + data;

        // Booleans
        } else if (data === true) {
            enc += tok[5];

        } else if (data === false) {
            enc += tok[6];

        // Null
        } else if (data === null) {
            enc += tok[0];

        // Arrays
        } else if (data instanceof Array) {
            enc += tok[8];
            for (var i = 0, l = data.length; i < l; i++) {
                _encode(data[i], false);
            }
            if (!top) {
                enc += tok[9];
            }

        // Objects
        } else if (data instanceof Object) {
            enc += tok[10];
            for (var e in data) {
                enc += tok[17 + e.length] + e;
                _encode(data[e], false);
            }
            if (!top) {
                enc += tok[11];
            }
        }
    }

    function encode(data) {
        enc = '';
        _encode(data, true);
        return enc;
    }

    function decode(data) {
        var p = 0, l = data.length;
        var stack = [], dec = undefined, f = null, t = 0, i = -1;
        var dict = false, set = false;
        var key = '', e = null, r = 0;
        while (p < l) {
            t = data.charCodeAt(p++);
            f = stack[i];

            // Keys
            if (dict && set && t > 16) {
                key = data.substring(p, p + t - 17);
                p += t - 17;
                set = false;

            // Array / Objects
            } else if (t === 8 || t === 10) {
                e = t === 8 ? new Array() : new Object();
                set = dict = t === 10;
                dec !== undefined ? f instanceof Array ? f.push(e)
                                                       : f[key] = e : dec = e;

                stack.push(e);
                i++;

            } else if (t === 11 || t === 9) {
                stack.pop();
                set = dict = !(stack[--i] instanceof Array);

            // Fixed
            } else if (t > 16) {
                t = t - 17;
                t = t > 115 ? (0 - t + 116) : t + 1;
                f instanceof Array ? f.push(t) : f[key] = t;
                set = true;

            } else if (t > 0 && t < 5) {
                if (((t - 1) / 2 | 0) === 0) {
                    e = data.charCodeAt(p);
                    p++;

                } else {
                    e = (data.charCodeAt(p) << 16) + data.charCodeAt(p + 1);
                    p += 2;
                }
                e = t % 2 ? e + 1 : 0 - e;
                f instanceof Array ? f.push(e) : f[key] = e;
                set = true;

            // Floats
            } else if (t > 12 && t < 17) {
                if (((t - 13) / 2 | 0) === 0) {
                    r = data.charCodeAt(p);
                    if (r > 127) {
                        e = 0;
                        r -= 128;
                        p++;

                    } else {
                        e = data.charCodeAt(p + 1);
                        p += 2;
                    }

                } else {
                    e = (data.charCodeAt(p) << 16) + data.charCodeAt(p + 1);
                    r = data.charCodeAt(p + 2);
                    p += 3;
                }

                e = t % 2 ? e + r * 0.01 : 0 - (e + r * 0.01);
                f instanceof Array ? f.push(e) : f[key] = e;
                set = true;

            // Booleans
            } else if (t > 4 && t < 7) {
                f instanceof Array ? f.push(t === 5) : f[key] = t === 5;
                set = true;

            // Null
            } else if (t === 0) {
                f instanceof Array ? f.push(null) : f[key] = null;
                set = true;

            // Strings
            } else if (t === 7) {
                e = 0;
                while (data.charCodeAt(p) === 65535) {
                    e += 65535;
                    p++;
                }
                e += data.charCodeAt(p++);
                f instanceof Array ? f.push(data.substr(p, e))
                                   : f[key] = data.substr(p, e);

                p += e;
                set = true;
            }
        }
        return dec;
    }

    if (typeof window === 'undefined') {
        exports.encode = encode;
        exports.decode = decode;

    } else {
        window.BISON = {
            encode: encode,
            decode: decode
        };
    }
})();

