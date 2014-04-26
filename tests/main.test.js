describe('MbDi', function() {
    var MbDi;

    beforeEach(function() {
        MbDi = window.MbDi;
    });

    it('should exist', function() {
        expect(MbDi).toEqual(jasmine.any(Function));
    });

    describe('constructor', function() {
        var source, di;

        it('should set the "source" property', function() {
            source = {
                $location: 'a thing',
                myService: function() {}
            };

            di = new MbDi(source);

            expect(di.source).toBe(source);
        });

        it('should default the "source" property to an empty object', function() {
            di = new MbDi();

            expect(di.source).toEqual({});
        });
    });

    describe('inject()', function() {
        var source, di;

        beforeEach(function() {
            source = {
                $location: 'a thing',
                myService: function() {}
            };

            di = new MbDi(source);
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

        describe('should inject the specified arguments', function() {
            it('variant 1', function() {
                var fn = function($location, myService) {
                    return Array.prototype.slice.call(arguments);
                };

                var args = di.inject(fn);

                expect(args).toEqual([source.$location, source.myService]);
            });

            it('variant 2', function() {
                source = {
                    myAwesomeFunction: function(){},
                    theThing: { isHulk: false },
                    name: 'my source'
                };
                di = new MbDi(source);
                var fn = function(name, myAwesomeFunction, theThing) {
                    return Array.prototype.slice.call(arguments);
                };

                var args = di.inject(fn);

                expect(args).toEqual([source.name, source.myAwesomeFunction, source.theThing]);
            });
        });

        it('should throw an error if any arguments do not exist on the source', function() {
            var fn = function(thingThatDoesntExistOnSource) {
                return Array.prototype.slice.call(arguments);
            };

            expect(function(){
                di.inject(fn)
            }).toThrowError("MbDi: 'thingThatDoesntExistOnSource' does not exist on the source object!");
        });

        it('should not fail if "source" is empty', function() {
            di = new MbDi();

            var fn = function() {
                return 'empty';
            };

            var args = di.inject(fn);

            expect(args).toEqual('empty');
        });
    });
});