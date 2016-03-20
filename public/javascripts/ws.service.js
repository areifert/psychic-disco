var WSService = function($location, $timeout) {
    var ws = {
        connection: null,
        queue: [],

        init: function(cb) {
            if(ws.connection) {
                if(ws.connection.readyState === WebSocket.OPEN) {
                    // WebSocket is already connected, call the callback
                    if(cb) {
                        cb();
                    }

                } else {
                    if(cb) {
                        // Queue the callback for later
                        ws.queue.push(cb);
                    }
                }

            } else {
                if(cb) {
                    // Queue the callback for later
                    ws.queue.push(cb);
                }

                // Create the connection
                ws.connection = new WebSocket('ws://' + [$location.host(), $location.port()].join(':'));

                ws.connection.onopen = function(evt) {
                    console.log('Connection established');
                    console.log(evt);

                    // Run callbacks in queue
                    while(ws.queue.length > 0) {
                        ws.queue.shift()();
                    }
                };

                ws.connection.onclose = function(evt) {
                    console.log('Connection closed');
                    console.log(evt);

                    ws.connection = null;

                    // Attempt to reconnect in 5 seconds
                    $timeout(function() {
                        console.log('Attempting to reestablish connection with server');
                        ws.init();
                    }, 5000);
                };

                ws.connection.onerror = function(evt) {
                    console.log('Error with connection');
                    console.log(evt);

                    console.log('Closing connection');
                    ws.connection.close();
                };

                ws.connection.onmessage = function(msg) {
                    console.log('Message received');
                    console.log(msg);

                    var msgObj = JSON.parse(msg.data);
                    if(msgObj.type) {
                        // If a message handler for this message type exists
                        if(ws.msgHandlers.handlers[msgObj.type]) {
                            ws.msgHandlers.handlers[msgObj.type].forEach(function(handler) {
                                handler(msgObj);
                            });

                        // Otherwise, use the default handler(s)
                        } else {
                            ws.msgHandlers.handlers.DefaultHandler.forEach(function(handler) {
                                handler(msgObj);
                            });
                        }

                    } else {
                        console.log('Unable to process message, no type specified:');
                        console.log(msg);
                    }
                };
            }
        },
        send: function(msg) {
            ws.init(function() {
                ws.connection.send(JSON.stringify(msg));
            });
        },

        msgHandlers: {
            add: function(msgType, handler) {
                if(!this.handlers[msgType]) {
                    this.handlers[msgType] = [];
                }

                this.handlers[msgType].push(handler);
            },

            handlers: {
                DefaultHandler: [
                    function(msg) {
                        console.log('No handler for message type \'' + msg.type + '\'');
                        console.log(msg);
                    }
                ]
            }
        }
    };

    return ws;
};
