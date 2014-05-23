# mb-injector

Super-lightweight dependency injection system for JavaScript.

Allows for injection of variables from a source object into functions based on the parameter names.

## Usage

(Optional)

Assign `Injector` to `mb.Injector` for easier use.

    window.Injector = mb.Injector;

Create a new Injector instance with any Object.

    var source = {
        name: 'My Awesome Thing',
        myFunc: function() {
            return 'do something'
        },
        config: {
            thingEnabled: true
        }
    };

    var di = new Injector(source);

Now that you have an instance with a registered source, you can start injecting variables into functions.

    // Simply add the key of the variable you want
    di.inject(function(name) {
        // My app's name is: My Awesome Thing!
        console.log("My app's name is: %s!", name);
    });

    // Order doesn't matter, the DI is triggered by the paremeter names
    di.inject(function(config, name, myFunc) {
        // My app's name is: My Awesome Thing!
        console.log("My app's name is: %s!", name);

        // My app should do something
        console.log("My app should %s!", myFunc());

        // Is the thing enabled? Yes
        console.log("Is the thing enabled? %s", config.thingEnabled ? 'Yes' : 'No');
    });

## "How do I break it?"

If you try to access a key that does not exist, the app will throw an error, rather than return undefined.

    // Error: mb.Injector: 'thingThatDoesntExist' does not exist on the source object!
    di.inject(function(thingThatDoesntExist) {

    });

That's it! Easy peasy, and no mess.

## Contact & License Info

Author: Matthew Balmer  
Twitter: [@mattbalmer](http://twitter.com/mattbalmer)  
Website: [http://mattbalmer.com](http://mattbalmer.com)  
License: MIT
