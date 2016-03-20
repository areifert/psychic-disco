var wsMsgHandlers = {
    DefaultHandler: function(msg, ws) {
        console.log('No message handler defined for \'' + msg.type + '\'');
        console.log(msg);
    },

    TestMessage: function(msg, ws) {
        ws.send(JSON.stringify({
            type: 'TestMessageResponse',
            data: 'Got it'
        }), function(err) {
            if(err) {
                console.error('Unable to send TestMessageResponse:');
                console.error(err);
            }
        });
    }
};

module.exports = wsMsgHandlers;
