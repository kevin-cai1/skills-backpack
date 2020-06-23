import React from 'react';
import ls from 'local-storage';

var SessionDetails = (function() {
    var full_email = "";

    var getEmail = function() {
        full_email = ls.get('email') || [];
        return full_email;
    };

    var setEmail = function(email) {
        full_email = email;
        ls.set('email', email);
    };

    var removeEmail = function() {
        ls.set('email', '');
    };

    return {
        getEmail: getEmail,
        setEmail: setEmail,
        removeEmail: removeEmail
    }

})();

export default SessionDetails;