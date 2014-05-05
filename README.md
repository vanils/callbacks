# Callbacks

A simple library for javaScript callbacks. Does not have dependency on any other library. Allows adding, removing and firing callbacks. Works also with Node.

## Quick start

    <script type="text/javascript" src="callbacks.min.js"></script>
    <script type="text/javascript">

    Callbacks.on('my-event', function () {
        console.log('fired!');
    });

    Callbacks.fire('my-event');

    </script>

## Adding callbacks

#### Basic usage

    Callbacks.on('my-event', function () {
        // do something
    });

#### Saving reference to listener object

    var callback = Callbacks.on('my-event', function () {
        // do something
    });

#### Shorthand

    C.on('my-event', function () {
        // do something
    });

## Firing callbacks

#### Basic usage

    Callbacks.fire('my-event');
    
#### Firing with single argument

    Callbacks.on('my-event', function (arg) {
        console.log('Argument: ' + arg);
    });

    Callbacks.fire('my-event', 'Hello World!');
    
#### Firing with multiple arguments

    Callbacks.on('my-event', function (arg1, arg2) {
        console.log('1. argument: ' + arg1);
        console.log('2. argument: ' + arg2);
    });

    Callbacks.fire('my-event', ['Hello', 'World!']);

#### Shorthand

    C.fire('my-event');
    
## Removing callbacks

#### Basic usage

    var callback = Callbacks.on('my-event', function () {
        // do something
    });
    
    callback.remove();

#### Remove within callback function

    Callbacks.on('my-event', function () {
        this.remove();
    });
    
    Callbacks.fire('my-event');

#### Remove all callbacks of certain type

    Callbacks.remove('my-event');
    
#### Shorthand

    C.remove('my-event');
