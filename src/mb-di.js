mbDi = {};

mbDi.source = null;

mbDi.registerSource = function(source) {
    this.source = source;
};

mbDi.parseParameters = function(fn) {
    var fnStr = (fn || '').toString();
    return fnStr.slice(fnStr.indexOf('(') + 1, fnStr.indexOf(')')).match(/([^\s,]+)/g) || [];
};

mbDi.inject = function(fn) {
    var params = mbDi.parseParameters(fn)
        , args = [];

    for(var i in params) {
        var p = params[i];

        if( !mbDi.source.hasOwnProperty(p) ) {
            throw new Error("mbDi: '"+p+"' does not exist on the registered source object!")
        }
        var a = mbDi.source[p];

        args.push( a );
    }

    return fn.apply(null, args);
};