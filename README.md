# mb-injector

Super-lightweight dependency injection system for JavaScript.

Allows for injection of variables from a source object into functions based on the parameter names.

## Usage

(Optional) Assign `Injector` to `mb.Injector` for easier use.

    window.Injector = mb.Injector;

Create a new Injector instance with any Object.

    var sources = {
        name: 'My Awesome Thing',
        myFunc: function() {
            return 'do something'
        },
        config: {
            thingEnabled: true
        }
    };

    var injector = new Injector(sources);

Now that you have an instance with a registered source, you can start injecting variables into functions.

    // Simply add the key of the variable you want
    injector.inject(function(name) {
        // My app's name is: My Awesome Thing!
        console.log("My app's name is: %s!", name);
    });

    // Order doesn't matter, the DI is triggered by the paremeter names
    injector.inject(function(config, name, myFunc) {
        // My app's name is: My Awesome Thing!
        console.log("My app's name is: %s!", name);

        // My app should do something
        console.log("My app should %s!", myFunc());

        // Is the thing enabled? Yes
        console.log("Is the thing enabled? %s", config.thingEnabled ? 'Yes' : 'No');
    });


## Configuration

The way that the injector finds its injected values can be customized by passing a function as the second constructor argument

    var sources = {
        plugin: {
            name: 'some plugin',
            value: function() {
                return 'foobar';
            }
        }
    }

    var injector = new Injector(sources, function(source) {
        return source.value;
    });

    // Also does the same thing:
    injector.extract = function(source) {
        return source.value;
    }

    injector.inject(function(plugin) {
        // The plugin's name is: foobar
        console.log("The plugin's value is: %s!", plugin());
    });

## "How do I break it?"

If you try to access a key that does not exist, the app will throw an error, rather than return undefined.

    // Error: mb.Injector: 'thingThatDoesntExist' does not exist on the source object!
    injector.inject(function(thingThatDoesntExist) {

    });

That's it! Easy peasy, and no mess.

## Contact & License Info

Author: Matthew Balmer  
Twitter: [@mattbalmer](http://twitter.com/mattbalmer)  
Website: [http://mattbalmer.com](http://mattbalmer.com)  
License: MIT
