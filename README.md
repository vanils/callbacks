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
    
#### Firing with argument

    Callbacks.on('my-event', function (a) {
        console.log(a);
    });

    Callbacks.fire('my-event', 'Hello World!');
    Callbacks.fire('my-event', {
        key1: 'value',
        key2: 'value'
    });
    
#### Shorthand

    C.fire('my-event');
    
## Removing callbacks

#### Basic usage

    var callback = Callbacks.on('my-event', function () {
        // do something
    });
    
    callback.remove();

#### Remove within callback function

    Callbacks.on('my-event', function (a, callback) {
        callback.remove();
    });
    
    Callbacks.fire('my-event');

#### Remove all callbacks of certain type

    Callbacks.remove('my-event');
    
#### Shorthand

    C.remove('my-event');
