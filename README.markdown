JSCoverage Report
=================

This fragment of [JSCoverage][1] ([code][2]) is responsible for writing
out a coverage report.  The framework JSCoverage sets forth, generally
requiring user interaction, does not work well in a headless environemnt,
for instance in [Env.js][3].  Including this fragment with JSCoverage-
instrumented code in "inverted mode" allows you to automate the process.

Env.js
------

For instance, an Env.js setup using [QUnit][4] could load this code and
run the coverage report generation and storage when QUnit concludes,
given the source code has already been instrumented:

```javascript
load("jscoverage-report.js");

Envjs({
    afterScriptLoad: {
        "qunit": function() {
            QUnit.done = function() {
                jscoverage_store();
            };
        }
    }
});
```

[1]: http://siliconforks.com/jscoverage/
[2]: https://github.com/rhunter/jscoverage/
[3]: http://www.envjs.com/
[4]: http://docs.jquery.com/QUnit
