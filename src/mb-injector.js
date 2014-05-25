(function() {
    // === Helpers ===
    function parseParameters(fn) {
        var fnStr = (fn || '').toString();
        return fnStr.slice(fnStr.indexOf('(') + 1, fnStr.indexOf(')')).match(/([^\s,]+)/g) || [];
    }

    // === Injector ===
    var Injector = function(sources, extract) {
        this.sources = sources || {};

        if(typeof extract === 'function')
            this.extract = extract;
    };

    Injector.prototype.inject = function(fn) {
        var args = [], params = parseParameters(fn);

        for(var i in params) {
            var p = params[i];

            if( !this.sources.hasOwnProperty(p) ) {
                throw new Error("mb.Injector: '"+p+"' does not exist in the source map!")
            }

            args.push( this.extract(this.sources[p]) );
        }

        return fn.apply(null, args);
    };

    Injector.prototype.extract = function(source) {
        return source;
    };

    // === Export ===
    if(typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
        module.exports = Injector;
    }
    else {
        window.mb = window.mb || {};
        window.mb.Injector = Injector;
    }
}());