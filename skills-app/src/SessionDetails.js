import React from 'react';
import ls from 'local-storage';

var SessionDetails = (function() {
    var full_email = "";
    var user_type = "";

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

    var getType = function() {
        user_type = ls.get('user_type') || [];
        return user_type;
    };

    var setType = function(type) {
        user_type = type;
        ls.set('user_type', user_type);
    };

    var removeType = function() {
        ls.set('user_type', '');
    };

    return {
        getEmail: getEmail,
        setEmail: setEmail,
        removeEmail: removeEmail,
        getType: getType,
        setType: setType,
        removeType: removeType
    }

})();

export default SessionDetails;
