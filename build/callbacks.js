/*
 *
 * Callbacks v1.0.0
 * http://github.com/vanils/callbacks
 *
 * Copyright 2014, Matti Mehtonen
 * Licensed under the MIT license.
 * http://github.com/vanils/callbacks/blob/master/LICENSE
 *
 */

(function (window) {

"use strict";

var Callbacks,
    callbacks,
    Listener,
    loops,
    index;

/*
 *
 * Adding Callbacks to window object if namespaces are available.
 *
 */
if (typeof window !== 'undefined') {
    if (!window.Callbacks && !window.C) {
        Callbacks = window.Callbacks = window.C = {};
    } else if (!window.Callbacks) {
        Callbacks = window.Callbacks = {};
    } else if (!window.C) {
        Callbacks = window.C = {};
    } else {
        throw new Error('Namespaces \'Callbacks\' and \'C\' are already ' +
            'taken on window object. Cannot load Callbacks.js.');
    }

/*
 *
 * If no window is present, assuming environment to be Node
 *
 */
} else {
    Callbacks = exports;
}

/*
 *
 * Private object which holds all listeners (notice lowercase).
 *
 */
callbacks = {};

/*
 *
 * List of loops to tell when certain type of listeners are currently
 * being looped.
 *
 */
loops = {};

/*
 *
 * Simple object to contain information about listener.
 *
 */
Listener = function (type, callback) {

    /*
     *
     * Type of listener. This has to be along the listener object to make it
     * much easier to find it from callbacks object.
     *
     */
    this._type = type;

    /*
     *
     * Callback to call when listener is fired.
     *
     */
    this._callback = callback;
};

/*
 *
 * By default, listeners are always alive.
 *
 */
Listener.prototype._alive = true;

/*
 *
 * Every listener contains remove method, which removes listener. If type of
 * listener is looping it is not immediately removed from callbacks list. It is
 * just marked not-alive. It will not be fired after that.
 *
 */
Listener.prototype.remove = function () {

    if (loops[this._type]) {
        this._alive = false;
    } else {
        callbacks.splice(index(callbacks[this._type], this), 1);
    }
};

/*
 *
 * Not all browsers (IE...) support array indexOf method.
 *
 */
if (typeof Array.prototype.indexOf === 'function') {
    index = function (array, value) {
        return array.indexOf(value);
    };

} else {
    index = function (array, value) {

        var i,
            j;

        for (i = 0, j = array.length; i < j; i++) {
            if (array[i] === value) {
                return i;
            }
        }

        return -1;
    };
}

/*
 *
 * Public method. Add new listener.
 *
 */
Callbacks.on = function (type, callback) {

    var listener;

    if (typeof type !== 'string') {
        throw new Error('Incorrect arguments. Type must be string.');
    }

    if (typeof callback !== 'function') {
        throw new Error('Incorrect arguments. Callback must be function.');
    }

    listener = new Listener(type, callback);

    if (!callbacks[type]) {

        /*
         *
         * If this type of listeners are not on callbacks object yet, empty
         * array must be created.
         *
         */
        callbacks[type] = [];

        /*
         *
         * Cannot be looping because listener type was just created.
         *
         */
        loops[type] = false;
    }

    callbacks[type].push(listener);

    return listener;
};

/*
 *
 * Public method. Removes listener. String can be used as argument to remove
 * all listeners of certain type. Listener itself can be used to remove it from
 * listeners object.
 *
 */
Callbacks.remove = function (selector) {

    var i;

    /*
     *
     * String selector deletes all listener of certain type.
     *
     */
    if (typeof selector === 'string') {

        if (callbacks[selector]) {

            /*
             *
             * If listener type is currently looping, all its listeners has to
             * to be marked dead. They cannot be removed immediately.
             *
             */
            if (loops[selector]) {
                for (i = callbacks[selector].length; i--; ) {
                    callbacks[selector][i]._alive = false;
                }

            /*
             *
             * If listener type is not currently looping, list can easily be
             * just wiped out.
             *
             */
            } else {
                callbacks[selector] = [];
            }
        }

    /*
     *
     * If listener itself have been used as argument, it should be removed.
     *
     */
    } else if (selector && selector._type && callbacks[selector._type]) {
        i = index(callbacks[selector._type], selector);

        if (i !== -1) {
            callbacks[selector._type][i].remove();
        }
    }
};

/*
 *
 * Public method. Fires a listener.
 *
 */
Callbacks.fire = function (type, args) {

    var i,
        j;

    if (!callbacks[type]) {
        return;
    }

    /*
     *
     * Loop is starting... Listeners should not be removed while looping. They
     * can be marked as dead, but not removed. Otherwise errors will arise.
     *
     */
    loops[type] = true;

    /*
     *
     * Invoking every callback function.
     *
     */
    for (i = 0, j = callbacks[type].length; i < j; i++) {
        if (callbacks[type][i]._alive) {
            callbacks[type][i]._callback(args, callbacks[type][i]);
        }
    }

    /*
     *
     * Loop ended. Listeners can be removed from callback list again...
     *
     */
    loops[type] = false;

    /*
     *
     * ...and so they shall. Looping all listeners and removing all dead ones.
     *
     */
    for (i = callbacks[type].length; i--; ) {
        if (!callbacks[type][i]._alive) {
            callbacks[type].splice(i, 1);
        }
    }
};

}(typeof window !== 'undefined' ? window : undefined));