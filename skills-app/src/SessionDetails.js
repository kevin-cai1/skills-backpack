import React from 'react';
import ls from 'local-storage';

// functions for session management
var SessionDetails = (function() {
    var full_email = "";
    var user_type = "";
    var full_name = "";

    // getting email from local storage
    var getEmail = function() {
        full_email = ls.get('email') || [];
        return full_email;
    };

    // setting email in local storage
    var setEmail = function(email) {
        full_email = email;
        ls.set('email', email);
    };

    // removing email from local storage
    var removeEmail = function() {
        ls.set('email', '');
    };

    // getting user type from local storage
    var getType = function() {
        user_type = ls.get('user_type') || [];
        return user_type;
    };

    // setting user type from local storage
    var setType = function(type) {
        user_type = type;
        ls.set('user_type', user_type);
    };

    // removing user type from local storage
    var removeType = function() {
        ls.set('user_type', '');
    };

    // getting name from local storage
    var getName = function() {
        full_name = ls.get('name') || [];
        return full_name;
    };

    // setting name in local storage
    var setName = function(name) {
        full_name = name;
        ls.set('name', name);
    };

    // removing name from local storage
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
