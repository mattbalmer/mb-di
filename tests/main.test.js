describe('Injector', function() {
    var Injector;

    beforeEach(function() {
        Injector = window.mb.Injector;
    });

    it('should be attached to window.mb', function() {
        expect(Injector).toEqual(window.mb.Injector);
    });

    it('should exist', function() {
        expect(Injector).toEqual(jasmine.any(Function));
    });

    describe('constructor', function() {
        var source, injector;

        it('should set the "source" property', function() {
            source = {
                $location: 'a thing',
                myService: function() {}
            };

            injector = new Injector(source);

            expect(injector.source).toBe(source);
        });

        it('should default the "source" property to an empty object', function() {
            injector = new Injector();

            expect(injector.source).toEqual({});
        });
    });

    describe('inject()', function() {
        var source, injector;

        beforeEach(function() {
            source = {
                $location: 'a thing',
                myService: function() {}
            };

            injector = new Injector(source);
        });

        it('should exist', function() {
            expect(injector.inject).toEqual(jasmine.any(Function));
        });

        it('should return the return-value of the given function', function() {
            var fn = function() {
                return 'A very important message!';
            };

            var result = injector.inject(fn);

            expect(result).toEqual('A very important message!');
        });

        describe('should inject the specified arguments', function() {
            it('variant 1', function() {
                var fn = function($location, myService) {
                    return Array.prototype.slice.call(arguments);
                };

                var args = injector.inject(fn);

                expect(args).toEqual([source.$location, source.myService]);
            });

            it('variant 2', function() {
                source = {
                    myAwesomeFunction: function(){},
                    theThing: { isHulk: false },
                    name: 'my source'
                };
                injector = new Injector(source);
                var fn = function(name, myAwesomeFunction, theThing) {
                    return Array.prototype.slice.call(arguments);
                };

                var args = injector.inject(fn);

                expect(args).toEqual([source.name, source.myAwesomeFunction, source.theThing]);
            });
        });

        it('should throw an error if any arguments do not exist on the source', function() {
            var fn = function(thingThatDoesntExistOnSource) {
                return Array.prototype.slice.call(arguments);
            };

            expect(function(){
                injector.inject(fn)
            }).toThrowError("mb.Injector: 'thingThatDoesntExistOnSource' does not exist on the source object!");
        });

        it('should not fail if "source" is empty', function() {
            injector = new Injector();

            var fn = function() {
                return 'empty';
            };

            var args = injector.inject(fn);

            expect(args).toEqual('empty');
        });

        it('should not leak internal method parseParameters()', function() {
            injector = new Injector({
                foo: 'bar'
            });

            injector.inject(function(foo){ });

            expect(function(){
                parseParameters()
            }).toThrowError("parseParameters is not defined");
        })
    });
});