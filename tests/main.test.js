describe('mbDi', function() {
    var di;

    beforeEach(function() {
        di = mbDi;
    });

    it('should exist', function() {
        expect(di).toEqual(jasmine.any(Object));
    });

    describe('properties', function(){
        it('should have a "source" object', function() {
            expect(di.source).toBe(null);
        });
    });

    describe('registerSource()', function() {
        it('should exist', function() {
            expect(di.registerSource).toEqual(jasmine.any(Function));
        });

        it('should set the "source" property', function() {
            var source = {foo:'bar'};

            di.registerSource(source);

            expect(di.source).toBe(source);
        });
    });

    describe('parseParameters()', function() {
        it('should exist', function() {
            expect(di.parseParameters).toEqual(jasmine.any(Function));
        });

        it('should return an array of the parameters of the given function', function() {
            var fn = function(arg1, arg2, somethingElse, $location) {}

            var result = di.parseParameters(fn);

            expect(result).toEqual(['arg1', 'arg2', 'somethingElse', '$location']);
        });

        it('should return an empty array if no parameters or no function given', function() {
            var result = di.parseParameters();

            expect(result).toEqual([]);
        });
    });

    describe('inject()', function() {
        var source;

        beforeEach(function() {
            source = {
                $location: 'a thing',
                myService: function() {}
            };

            di.registerSource(source);
        });

        it('should exist', function() {
            expect(di.inject).toEqual(jasmine.any(Function));
        });

        it('should return the return-value of the given function', function() {
            var fn = function() {
                return 'A very important message!';
            };

            var result = di.inject(fn);

            expect(result).toEqual('A very important message!');
        });

        it('should inject the specified arguments', function() {
            var fn = function($location, myService) {
                return Array.prototype.slice.call(arguments);
            };

            var args = di.inject(fn);

            expect(args).toEqual([source.$location, source.myService]);
        });

        it('should throw an error if any arguments do not exist on the source', function() {
            var fn = function(thingThatDoesntExistOnSource) {
                return Array.prototype.slice.call(arguments);
            };

            expect(function(){
                di.inject(fn)
            }).toThrowError("mbDi: 'thingThatDoesntExistOnSource' does not exist on the registered source object!");
        });
    });
});