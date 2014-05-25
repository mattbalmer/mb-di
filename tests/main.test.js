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
        var sources, injector;

        it('should set the "sources" property', function() {
            sources = {
                $location: 'a thing',
                myService: function() {}
            };

            injector = new Injector(sources);

            expect(injector.sources).toBe(sources);
        });

        it('should default the "sources" property to an empty object', function() {
            injector = new Injector();

            expect(injector.sources).toEqual({});
        });

        it('should assign the extract function from the second argument', function() {
            var extractor = function(source) {
                return source.value;
            };
            var source = {
                foo: {
                    value: 'bar'
                }
            };

            var injector = new Injector(source, extractor);

            expect(injector.extract).toBe(extractor);
        });

        it('should not assign the extract function if the second argument is not a function', function() {
            var injector = new Injector({}, 'huehue');

            expect(injector.extract).not.toEqual('huehue');
            expect(injector.extract).toBe(Injector.prototype.extract);
        });
    });

    describe('inject()', function() {
        var sources, injector;

        beforeEach(function() {
            sources = {
                $location: 'a thing',
                myService: function() {}
            };

            injector = new Injector(sources);
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

                expect(args).toEqual([sources.$location, sources.myService]);
            });

            it('variant 2', function() {
                sources = {
                    myAwesomeFunction: function(){},
                    theThing: { isHulk: false },
                    name: 'my sources'
                };
                injector = new Injector(sources);
                var fn = function(name, myAwesomeFunction, theThing) {
                    return Array.prototype.slice.call(arguments);
                };

                var args = injector.inject(fn);

                expect(args).toEqual([sources.name, sources.myAwesomeFunction, sources.theThing]);
            });
        });

        it('should throw an error if any arguments do not exist on the sources', function() {
            var fn = function(thingThatDoesntExistOnSource) {
                return Array.prototype.slice.call(arguments);
            };

            expect(function(){
                injector.inject(fn)
            }).toThrowError("mb.Injector: 'thingThatDoesntExistOnSource' does not exist in the source map!");
        });

        it('should not fail if "sources" is empty', function() {
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
        });

        it('should be able to inject variables added to the sources after the injector is created', function() {
            sources = {
                foo: 'bar'
            };

            injector = new Injector(sources);
            sources.bar = function() {
                return 'foobar!';
            };

            var args = injector.inject(function(foo, bar) {
                return Array.prototype.slice.call(arguments);
            });

            expect(args).toEqual([sources.foo, sources.bar]);
        })
    });

    describe('extract()', function() {
        var injector, sources;

        beforeEach(function() {
            sources = {
                $location: 'a thing',
                myService: {
                    name: 'a service',
                    value: function() {
                        return 'value';
                    }
                }
            };

            injector = new Injector(sources);
        });

        it('should call this.extract(source) when injecting a source', function() {
            var spy = spyOn(injector, 'extract').and.callThrough();

            injector.inject(function($location) { });

            expect(spy).toHaveBeenCalled();
        });

        it('should default to return what was given', function() {
            var result = injector.inject(function($location) {
                return $location;
            });

            expect(result).toBe(sources.$location);
        });

        it('should accept custom extract functions', function() {
            injector.extract = function(source) {
                return source.value;
            };

            var result = injector.inject(function(myService) {
                return myService;
            });

            expect(result).toBe(sources.myService.value);
        });
    })
});