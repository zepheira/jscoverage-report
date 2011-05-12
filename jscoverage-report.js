/**
 * Derived from JSCoverage.
 * http://siliconforks.com/jscoverage/
 * https://github.com/rhunter/jscoverage/
 * This is free software, distributed under the GNU General Public License.
 * See LICENSE.txt.
 */

var jscoverage_pad = function(s) {
    return '0000'.substr(s.length) + s;
};

var jscoverage_quote = function(s) {
    return '"' + s.replace(/[\u0000-\u001f"\\\u007f-\uffff]/g, function (c) {
        switch (c) {
        case '\b':
            return '\\b';
        case '\f':
            return '\\f';
        case '\n':
            return '\\n';
        case '\r':
            return '\\r';
        case '\t':
            return '\\t';
        case '\v':
            return '\\v';
        case '"':
            return '\\"';
        case '\\':
            return '\\\\';
        default:
            return '\\u' + jscoverage_pad(c.charCodeAt(0).toString(16));
        }
    }) + '"';
}; 

var jscoverage_serializeCoverageToJSON = function() {
    var json = [];
    for (var file in _$jscoverage) {
        if (! _$jscoverage.hasOwnProperty(file)) {
            continue;
        }
        var coverage = _$jscoverage[file];
        var array = [];
        var length = coverage.length;
        for (var line = 0; line < length; line++) {
            var value = coverage[line];
            if (value === undefined || value === null) {
                value = 'null';
            }
            array.push(value);
        }
        var source = coverage.source;
        var lines = [];
        length = source.length;
        for (var line = 0; line < length; line++) {
            lines.push(jscoverage_quote(source[line]));
        }
        json.push(jscoverage_quote(file) + ':{"coverage":[' + array.join(',') + '],"source":[' + lines.join(',') + ']}');
    }
    return '{' + json.join(',') + '}';
};

var jscoverage_store = function() {
    var request = new XMLHttpRequest();
    request.open('POST', '/jscoverage-store', true);
    request.onreadystatechange = function (event) {
        if (request.readyState === 4) {
            var message;
            try {
                if (request.status !== 200 && request.status !== 201 && request.status !== 204) {
                    throw request.status;
                }
                message = request.responseText;
            }
            catch (e) {
                if (e.toString().search(/^\d{3}$/) === 0) {
                    message = e + ': ' + request.responseText;
                }
                else {
                    message = 'Could not connect to server: ' + e;
                }
            }
        }
    };
    request.setRequestHeader('Content-Type', 'application/json');
    var json = jscoverage_serializeCoverageToJSON();
    request.setRequestHeader('Content-Length', json.length.toString());
    request.send(json);
};
