var MbDi = function(source) {
    this.source = source || null;
};

MbDi.prototype.inject = (function() {
    function parseParameters(fn) {
        var fnStr = (fn || '').toString();
        return fnStr.slice(fnStr.indexOf('(') + 1, fnStr.indexOf(')')).match(/([^\s,]+)/g) || [];
    }

    return function(fn) {
        var args = [], params = parseParameters(fn);

        for(var i in params) {
            var p = params[i];

            if( !this.source.hasOwnProperty(p) ) {
                throw new Error("MbDi: '"+p+"' does not exist on the registered source object!")
            }

            args.push( this.source[p] );
        }

        return fn.apply(null, args);
    }
}());