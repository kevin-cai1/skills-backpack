import React from 'react';
import ls from 'local-storage';

var SessionDetails = (function() {
    var full_email = "";
    var user_type = "";
    var full_name = "";

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

    var getName = function() {
        full_name = ls.get('name') || [];
        return full_name;
    };

    var setName = function(name) {
        full_name = name;
        ls.set('name', name);
    };

    var removeName = function() {
        ls.set('name', '');
    };

    return {
        getEmail: getEmail,
        setEmail: setEmail,
        removeEmail: removeEmail,
        getType: getType,
        setType: setType,
        removeType: removeType,
        getName: getName,
        setName: setName,
        removeName: removeName
    }

})();

export default SessionDetails;
