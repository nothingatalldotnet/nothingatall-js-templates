/**
 * Title:   General JS Template main.js
 * Author:  R Jones
 * Version: 1.0
*/

// Ugh... Globals if necessary
var some_global;

var GaEvents = {
    settings : {
    },

    init: function() {
        this.bindEvents();
    },

    bindEvents: function() {
        GaEvents.settings.$element.on('click', {detail_type:'Something', link_location:'Somewhere', event_type:'Something'}, GaEvents.track);
    },

    track: function(e) {
        Tracking.trackEvent(e.data.link_location, e.data.event_type, e.data.detail_type);
    }
};

var Sizing = {
    settings : {
        $window : $(window)
    },

    init : function() {
        this.bindEvents();
    },

    bindEvents : function() {
        Sizing.settings.$window.on('resize', $.proxy(this.resize, this));
    },

    resize : function() {
    }
};


var General = {
    init : function() {
        this.something();
    },

    'something': {
        settings : {
        },

        init: function(e) {
            this.bindEvents();
        },

        bindEvents: function() {

        }
    }
};

var Tracking = {
    trackEvent: function(category,action,label) {
        ga('send', {
            'hitType': 'event',
            'eventCategory': category,
            'eventAction': action,
            'eventLabel': label
        });
    }
};

$(function(){
    GaEvents.init();
    Sizing.init();
    General.init();
});





