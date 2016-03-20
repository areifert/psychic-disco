var wsMsgHandlers = {
    DefaultHandler: function(msg, ws) {
        console.log('No message handler defined for \'' + msg.type + '\'');
    }
};

module.exports = wsMsgHandlers;
