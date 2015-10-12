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

























var Dazzle = {

	init : function() {
        this.headerShare.init();
        if(typeof ajax_gallery !== "undefined") {
            ajax_gallery.abort();
        }
        if(typeof ajax_map !== "undefined"){
            ajax_map.abort();
        }

		if($("#gallery-page").length !== 0) {
            Dazzle.gallery.settings.map_visible = true;
			this.gallery.init();
		} else if($("#single-gallery-item").length !== 0) {
            Dazzle.gallery.settings.map_visible = false;
            this.singleGalleryItem.init();
        } else {
            return;
        }
	},

    'geolocation' : {
		settings : {
            options : { enableHighAccuracy: false, timeout: 5000 }
        },

        success : function(position) {
            Dazzle.gallery.settings.location_coords = {
                latitude    : position.coords.latitude,
                longitude   : position.coords.longitude
            };
        },

        error : function() {
            window.alert('Ooops, something went wrong while getting your location. Please try again.');
        }
    },

    'headerShare': {
        settings: {
            $tweet  : $(".links .tweet")
        },

        init : function() {
            this.bindEvents();
        },

        bindEvents: function() {
            Dazzle.headerShare.settings.$tweet.on('click', Dazzle.headerShare.tweet);
        },

        tweet: function() {
            window.open('http://twitter.com/home?status=%401418NOW%20%23dazzleit&original_referer='+window.location.href+'"', 'twitterwindow', 'height=450, width=550, top='+($(window).height()/2 - 225) +', left='+$(window).width()/2 +', toolbar=0, location=0, menubar=0, directories=0, scrollbars=0');
        }
    },

    'share': {
        settings : {
            social_title    : 'Check out my Dazzle',
            tweet_hashtag   : 'dazzleit',
            tweet_via       : '1418NOW'
        },

        generateShare: function(e) {
            e.preventDefault();
            var open_string, window_name, window_vars, share_text,
                short_url   = $(this).closest('ul').data('bitly'),
                long_url    = $(this).closest('ul').data('link'),
                image_url   = $(this).closest('article').find('img').attr('src'),
                share_type  = e.data.share_type,
                post_id     = $(this).closest('ul').data('post');

            if(share_type === 'twitter') {
                share_text  = encodeURIComponent(Dazzle.share.settings.social_title);
                open_string = 'https://twitter.com/intent/tweet?url='+short_url+'&via='+Dazzle.share.settings.tweet_via+'&text='+share_text+'&hashtags='+Dazzle.share.settings.tweet_hashtag+'&original_referer='+window.location.href;
                window_name = 'twitterwindow';
                window_vars = 'height=450, width=550, top='+($(window).height()/2 - 225) +', left='+$(window).width()/2 +', toolbar=0, location=0, menubar=0, directories=0, scrollbars=0';
                Tracking.trackEvent('Gallery','Share Button','Twitter',post_id);
            } else if(share_type === 'facebook') {
                open_string = 'https://www.facebook.com/sharer/sharer.php?u='+long_url;
                window_name = 'facebookwindow';
                window_vars = 'height=600, width=600, top='+($(window).height()/2 - 300) +', left='+$(window).width()/2 +',toolbar=0, location=0, menubar=0, directories=0, scrollbars=0';
                Tracking.trackEvent('Gallery','Share Button','Facebook',post_id);
            } else if(share_type === 'pinterest') {
                share_text  = encodeURIComponent(Dazzle.share.settings.social_title+' '+short_url);
                open_string = 'https://pinterest.com/pin/create/button/?url='+long_url+'&media='+image_url+'&description='+share_text;
                window_name = 'pinwindow';
                window_vars = 'height=590, width=760, top='+($(window).height()/2 - 375) +', left='+$(window).width()/2 +',toolbar=0, location=0, menubar=0, directories=0, scrollbars=0';
                Tracking.trackEvent('Gallery','Share Button','Pinterest',post_id);
            } else if(share_type === 'google') {
                open_string = 'https://plus.google.com/share?url='+long_url;
                window_name = 'googlewindow';
                window_vars = 'height=600, width=600, top='+($(window).height()/2 - 300) +', left='+$(window).width()/2 +',toolbar=0, location=0, menubar=0, directories=0, scrollbars=0';
                Tracking.trackEvent('Gallery','Share Button','Google+',post_id);
            } else {
                return false;
            }
            Dazzle.share.openShareWindow(open_string, window_name, window_vars);
        },

        openShareWindow: function(open_string, window_name, window_vars ) {
            window.open(open_string, window_name, window_vars);
        }
    },

    'singleGalleryItem': {
        settings : {
            map             : null,
            $map_canvas     : $('#map-canvas'),
            $like           : $('.like'),
            $btn_facebook   : $('.social-facebook'),
            $btn_twitter    : $('.social-twitter'),
            $btn_google     : $('.social-google'),
            $btn_pinterest  : $('.social-pinterest')
        },

        init: function() {
            this.bindEvents();
            if(Dazzle.singleGalleryItem.settings.$map_canvas.length !== 0) {
                google.maps.event.addDomListener(window, 'load', this.initializeMap);
            }
        },

        bindEvents: function() {
            Dazzle.singleGalleryItem.settings.$like.on('click', Dazzle.gallery.likeItem);
            Dazzle.singleGalleryItem.settings.$btn_facebook.on('click', {share_type:'facebook'}, Dazzle.share.generateShare);
            Dazzle.singleGalleryItem.settings.$btn_twitter.on('click', {share_type:'twitter'}, Dazzle.share.generateShare);
            Dazzle.singleGalleryItem.settings.$btn_google.on('click', {share_type:'google'}, Dazzle.share.generateShare);
            Dazzle.singleGalleryItem.settings.$btn_pinterest.on('click', {share_type:'pinterest'}, Dazzle.share.generateShare);
        },

        initializeMap: function() {
            var lat = Dazzle.singleGalleryItem.settings.$map_canvas.data('lat'),
                lon = Dazzle.singleGalleryItem.settings.$map_canvas.data('lon'),
                map_options = {
                    zoom: 8,
                    mapTypeControl: false,
                    center: new google.maps.LatLng(lat,lon)
                },
                map_marker,
                map_infowindow;

            Dazzle.singleGalleryItem.settings.map = new google.maps.Map(document.getElementById('map-canvas'), map_options);

            map_marker = new google.maps.Marker({
                draggable: false,
                animation: google.maps.Animation.DROP,
                position: new google.maps.LatLng(lat,lon),
                map: Dazzle.singleGalleryItem.settings.map,
                title: Dazzle.singleGalleryItem.settings.dazzle_title
            });

            map_infowindow = new google.maps.InfoWindow({
                content: '<div class="info-content"><img src="'+markerdetails[5]+'" width="150" height="150" alt="'+markerdetails[0]+'" /></div>',
                maxWidth: 500
            });

            google.maps.event.addListener(map_marker, 'click', function() {
                map_infowindow.open(Dazzle.singleGalleryItem.settings.map,map_marker);
            });
        }
    },

    'gallery': {
        settings : {
            $gallery_content    : $('#gallery-content'),
            $gallery_content_nav: $('#gallery-content nav'),
            $filter             : $('#filter'),
            $filter_li          : $('#filter ul li'),
            $filter_order       : $('#filter-order'),
            $filter_object      : $('#filter-object'),
            $filter_pattern     : $('#filter-pattern'),
            $show_map           : $('#map'),
            gallery_card        : '.gallery-card',
            gallery_map         : null,
            location_coords     : null,
            open_infowindow     : null,
            markers             : [],
            markers_obj         : [],
            like                : '.like',
            pagination          : '.pagination',
            post_data           : '',
            btn_facebook        : '.social-facebook',
            btn_twitter         : '.social-twitter',
            btn_google          : '.social-google',
            btn_pinterest       : '.social-pinterest',
            btn_report          : '.flag',
            items_per_page      : 9,
            show_map_text       : 'View map locations',
            show_gallery_text   : 'Hide map',
            small_css           : {width : "90%", margin: "0 auto"},
            normal_css          : {width : "100%", margin: "0"},
            map_visible         : false
        },

        init: function(e) {
            this.bindEvents();
            if(window.location.hash) {
                var hash = window.location.hash.substring(1);

                if(typeof ajax_gallery !== "undefined") {
                    ajax_gallery.abort();
                }
                if(typeof ajax_map !== "undefined"){
                    ajax_map.abort();
                }

                if(hash === "dazzle-map") {
                    Dazzle.gallery.settings.map_visible = true;
                    Dazzle.gallery.initMap();
                    Dazzle.gallery.settings.$show_map.text(Dazzle.gallery.settings.show_gallery_text);
                    Dazzle.gallery.settings.$filter_li.slideUp();
                } else {
                    Dazzle.gallery.settings.map_visible = false;
                    window.location.hash = '';
                    history.pushState('', document.title, window.location.pathname);
                    $('#filter-object').selectedIndex = 0;
                    $('#filter-pattern').selectedIndex = 0;
                    $('#filter-order').selectedIndex = 0;
                    Dazzle.gallery.initGallery();
                }
            } else {
                Dazzle.gallery.settings.map_visible = false;
                $('#filter-object')[0].selectedIndex = 0;
                $('#filter-pattern')[0].selectedIndex = 0;
                $('#filter-order')[0].selectedIndex = 0;
                Dazzle.gallery.initGallery();
            }
        },

        bindEvents: function() {
            Dazzle.gallery.settings.$gallery_content.on('click', Dazzle.gallery.settings.pagination, this.paginationGallery);
            Dazzle.gallery.settings.$show_map.on('click', this.checkFilterBar);
            Dazzle.gallery.settings.$filter_order.on('change', this.filterGallery);
            Dazzle.gallery.settings.$filter_object.on('change', this.filterGallery);
            Dazzle.gallery.settings.$filter_pattern.on('change', this.filterGallery);
        },

        sizeContent: function(size) {
            if(size === "small"){
                Dazzle.gallery.settings.$gallery_content.css(Dazzle.gallery.settings.small_css);
            } else {
                Dazzle.gallery.settings.$gallery_content.css(Dazzle.gallery.settings.normal_css);
            }
        },

        checkFilterBar: function(e) {
            if(window.location.hash) {
                var hash = window.location.hash.substring(1);
                if(hash === "dazzle-map") {
                    window.location.hash = "#";
                    if(typeof ajax_gallery !== "undefined")
                        ajax_gallery.abort();

                    Dazzle.gallery.settings.map_visible = false;
                    Dazzle.gallery.showGallery();
                    $('#filter-object')[0].selectedIndex = 0;
                    $('#filter-pattern')[0].selectedIndex = 0;
                    $('#filter-order')[0].selectedIndex = 0;
                } else {
                    Dazzle.gallery.settings.map_visible = true;
                    Dazzle.gallery.showMap();
                }
            } else {
                Dazzle.gallery.settings.map_visible = true;
                Dazzle.gallery.showMap();
            }

            e.preventDefault();
            return false;
        },

        showMap : function(){
            $('.gallery-cards').remove();
            Dazzle.gallery.settings.$filter_li.slideUp();
            Dazzle.gallery.settings.$show_map.text(Dazzle.gallery.settings.show_gallery_text);
            Dazzle.gallery.initMap();
        },
        showGallery : function() {
            Dazzle.gallery.removeMapMarkers();
            Dazzle.gallery.removeBoundsListener();
            Dazzle.gallery.settings.$filter_li.slideDown();
            Dazzle.gallery.settings.$show_map.text(Dazzle.gallery.settings.show_map_text);
            Dazzle.gallery.sizeContent(null);
            Dazzle.gallery.initGallery();
        },

        updateCoordinate: function() {
            navigator.geolocation.getCurrentPosition(Dazzle.geolocation.success, Dazzle.geolocation.error, Dazzle.geolocation.settings.options);
        },

        initMap: function() {
// clear everything here
            Dazzle.gallery.settings.map_visible = true;
            var map_centre, map_zoom, map_options;

            if(Dazzle.gallery.settings.location_coords) {
                map_centre  = new google.maps.LatLng(Dazzle.gallery.settings.location_coords.latitude,Dazzle.gallery.settings.location_coords.longitude);
                map_zoom    = 5;
            } else {
                map_centre  = new google.maps.LatLng(20.0000,0.0000);
                map_zoom    = 3;
            }

            map_options = {
                zoom: map_zoom,
                mapTypeControl: false,
                center: map_centre
            };

            Dazzle.gallery.settings.$gallery_content.empty();
            Dazzle.gallery.settings.$gallery_content.css('height','600px');
            Dazzle.gallery.settings.gallery_map = new google.maps.Map(document.getElementById('gallery-content'), map_options);
            Dazzle.gallery.drawMapMarkers();
            return false;
        },

        drawMapMarkers: function() {
            var infowindow = null, marker, marker_icon, i;

            Dazzle.gallery.settings.post_data = {action:'get_map_items'};
            window.location.hash = '#dazzle-map';
            ajax_map = $.ajax({
                url  : dazzle_script.ajax_url,
                type :'post',
                data : Dazzle.gallery.settings.post_data,
                dataType : 'json',
                cache: false,
                success : function(data){
                    $.each(data, function() {
                        Dazzle.gallery.settings.markers.push([this.item_title, this.item_lat, this.item_long, this.item_link, this.post_id, this.item_image]);
                    });
                },
                error : function(){
                    // ('Ooops, something went wrong while getting Dazzle Images! Please try again.');
                },
                complete : function(data){

                    for(i=0; i<Dazzle.gallery.settings.markers.length; i++) {

                        if(window.location.protocol !== 'https:') {
                            marker_icon = 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png';
                        } else {
                            marker_icon = 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png';
                        }
                        marker = new google.maps.Marker({
                            position: new google.maps.LatLng(Dazzle.gallery.settings.markers[i][1], Dazzle.gallery.settings.markers[i][2]),
                            map: Dazzle.gallery.settings.gallery_map,
                            title: Dazzle.gallery.settings.markers[i][0],
                            animation: google.maps.Animation.DROP,
                            icon: marker_icon
                        });

                        // window.location.hash = 'dazzle-map';
                        Dazzle.gallery.settings.markers_obj.push(marker);

                        google.maps.event.addListener(Dazzle.gallery.settings.gallery_map, 'center_changed', Dazzle.gallery.addBoundsListener);
                        google.maps.event.addListener(marker, 'click', Dazzle.gallery.addMarkerListener(marker, infowindow, Dazzle.gallery.settings.markers[i]));
                    }
                    
                    Sizing.mapSize();
                }
            });
        },

        removeMapMarkers: function() {
            for(var i=0; i<Dazzle.gallery.settings.markers_obj.length; i++) {
                // Dazzle.gallery.settings.markers_obj[i].setMap(null);
            }
            // Dazzle.gallery.settings.markers.length = 0;
            // Dazzle.gallery.settings.markers_obj.length = 0;
            google.maps.event.clearListeners(Dazzle.gallery.settings.gallery_map, 'click');
        },

        addBoundsListener : function() {
            Dazzle.gallery.checkMapBounds(Dazzle.gallery.settings.gallery_map);
        },

        removeBoundsListener : function() {
            google.maps.event.clearListeners(Dazzle.gallery.settings.gallery_map, 'center_changed');
        },

        addMarkerListener : function(pointer, bubble, markerdetails){
            return function() {
                if(Dazzle.gallery.settings.open_infowindow) {
                    Dazzle.gallery.settings.open_infowindow.close();
                    Dazzle.gallery.settings.open_infowindow = null;
                }

                bubble = new google.maps.InfoWindow({
                    content: '<div class="info-content"><img src="'+markerdetails[5]+'" width="150" height="150" alt="'+markerdetails[0]+'" /></div>',
                    maxWidth: 500
                });
                bubble.open(Dazzle.gallery.settings.gallery_map, pointer);
                Dazzle.gallery.settings.open_infowindow = bubble;
            };
        },

        checkMapBounds : function(map) {
            var lat_north = map.getBounds().getNorthEast().lat(),
                lat_south = map.getBounds().getSouthWest().lat(),
                new_lat, new_center;

            if(lat_north<85 && lat_south>-85) {
                return;
            } else {
                if(lat_north>85 && lat_south<-85) {
                    return;
                }
                else {
                    if(lat_north>85) {
                        new_lat = map.getCenter().lat() - (lat_north-85);
                    }
                    if(lat_south<-85) {
                        new_lat = map.getCenter().lat() - (lat_south+85);
                    }
                }
            }
            if(new_lat) {
                new_center = new google.maps.LatLng(new_lat, map.getCenter().lng());
                map.setCenter(new_center);
            }
        },

        initGallery: function() {
            Dazzle.gallery.settings.$gallery_content.css('height','100%');

            Dazzle.gallery.settings.$gallery_content.animate({opacity: 0}, 250, function() {
                Dazzle.gallery.clearGallery();

                Dazzle.gallery.settings.post_data = {
                    action: 'get_gallery_items',
                    orderby: 'like',
                    itemsperpage: Dazzle.gallery.settings.items_per_page
                };
                Dazzle.gallery.getGalleryItems(Dazzle.gallery.settings.post_data);
            });
        },

        filterGallery: function(){
            Dazzle.gallery.settings.$gallery_content.animate({opacity: 0}, 250, function() {
                Dazzle.gallery.clearGallery();
                Dazzle.gallery.settings.post_data = {
                    action:         'get_gallery_items',
                    model:          $('#filter-object').val(),
                    pattern:        $('#filter-pattern').val(),
                    orderby:        $('#filter-order').val(),
                    itemsperpage:   Dazzle.gallery.settings.items_per_page
                };
                Dazzle.gallery.getGalleryItems(Dazzle.gallery.settings.post_data);
            });
        },

        paginationGallery: function() {
            Dazzle.gallery.settings.post_data.pagenumber = $(this).data('page');

            Dazzle.gallery.settings.$gallery_content.animate({opacity: 0}, 250, function() {
                Dazzle.gallery.clearGallery();
                Dazzle.gallery.getGalleryItems(Dazzle.gallery.settings.post_data);
            });
        },
        getGalleryItems: function(post_data) {
            var $gallery_cards, article, unlike, like_class, button_val, nav, i, t, report_mailto, n1, n2, p1, p2;

            $(Dazzle.gallery.settings.gallery_card).find('.front, .back').removeClass('gallery-easing');

            ajax_gallery = $.ajax({
                url  : dazzle_script.ajax_url,
                type : 'post',
                data : post_data,
                dataType: 'json',
                cache: false,
                success : function(data){
                    if(Dazzle.gallery.settings.map_visible) return;
                    $gallery_cards = $('<div>', {class: 'gallery-cards'});
                    Dazzle.gallery.settings.$gallery_content.append($gallery_cards);

                    if(data.length <= 1) {
                        article = '<article class="no-results"> Sorry no matching results found</article>';
                        $gallery_cards.append(article);
                    } else {
                        $.each(data, function() {
                            if(this.hasOwnProperty('post_id')){
                                if(this.liked === true) {
                                    unlike        = 'unlike';
                                    like_class    = 'liked-bg';
                                    button_val    = 'UNLIKE';
                                } else {
                                    unlike        = '';
                                    like_class    = 'like-bg';
                                    button_val    = 'LIKE';
                                }
                                t = Math.round(+new Date()/1000);

                                report_mailto = 'mailto:info@1418now.org.uk?bcc=info@thecogency.com&subject=Dazzle%20It%20gallery-inappropriate%20content&body=I%20would%20like%20to%20flag%20this%20image%20as%20inappropriate%20content:\n\nImageId:%20'+this.post_id+'\n\nImage URL:%20'+this.item_link;

                                article = '<article class="gallery-card" itemscope itemType="http://schema.org/CreativeWork">'+
                                            '<div class="front loader">'+
                                                '<div class="img-flip">'+
                                                    '<img src="'+this.item_image+'" alt="'+this.item_title+'" itemprop="image" class="dz full" />'+
                                                '</div>'+
                                                '<div class="flip"><img src="'+template_directory+'/assets/img/flip.png" alt="flip" /></div>'+
                                            '</div>'+
                                            '<div class="back">'+
                                                '<div>'+
                                                    '<h3>Share</h3>'+
                                                    '<ul data-link="'+this.item_link+'" data-bitly="'+this.item_bitly+'">'+
                                                        '<li class="social facebook-bg"><a href="#" class="social-facebook"><img src="'+template_directory+'/assets/img/share-facebook.png" alt="Facebook" /></a></li>'+
                                                        '<li class="social twitter-bg"><a href="#" class="social-twitter"><img src="'+template_directory+'/assets/img/share-twitter.png" alt="Twitter" /></a></li>'+
                                                        '<li class="social pinterest-bg"><a href="#" class="social-pinterest"><img src="'+template_directory+'/assets/img/share-pinterest.png" alt="Pinterest" /></a></li>'+
                                                    '</ul>'+
                                                    '<div class="'+like_class+'">'+
                                                        '<a href="#" class="u-capitalize like '+unlike+'" data-item="'+this.post_id+'">'+button_val+'</a>'+
                                                    '</div>'+
                                                    '<span class="close"><img src="'+template_directory+'/assets/img/close.png" alt="close"></span>'+
                                                    '<span class="flip"><a class="flag" href="'+report_mailto+'" target="_blank"><img src="'+template_directory+'/assets/img/flag.png" alt="flag" /></a></span>'+
                                                '</div>'+
                                            '</div>'+
                                        '</article>';

                                $gallery_cards.append(article);
                                article = '';
                            } else {
                                //Build navigations
                                _pagesToShow = 5;

                                nav = '<nav class="gallery-pagination"><ul>';
                                if(this.current_page !== 1) {
                                    nav += '<li><a href="#" class="pagination first" data-page="1"><span class="text">First</span></a></li>';
                                }

                                if(this.current_page-1 > 0){
                                    p1 = this.current_page - 1;
                                    nav += '<li><a href="#" class="pagination prev" data-page="'+p1+'"><span class="text">Previous</span></a></li>';
                                }
                                if(this.total_pages > _pagesToShow) {
                                    var _jumpToNextMod = (this.current_page%_pagesToShow);
                                    var startAt = (_jumpToNextMod == 1) ? this.current_page : this.current_page - (_jumpToNextMod-1);

                                    startAt = (_jumpToNextMod == 0 ) ? this.current_page-(_pagesToShow-1):startAt;
                                    for(var i= 0; i < _pagesToShow; i++) {
                                        if( startAt+(i) === this.current_page) {
                                            nav += '<li><a href="#" class="pagination active" data-page="'+(startAt+(i))+'">'+(startAt+(i))+'</a></li>';
                                        } else {
                                            nav += '<li><a href="#" class="pagination" data-page="'+(startAt+(i))+'">'+(startAt+(i))+'</a></li>';
                                        }
                                    }

                                    // if(this.current_page-2 > 0){
                                    //     p2 = this.current_page - 2;
                                    //     nav += '<li><a href="#" class="pagination" data-page="'+p2+'">'+p2+'</a></li>';
                                    // }
                                    // if(this.current_page-1 > 0){
                                    //     p1 = this.current_page - 1;
                                    //     nav += '<li><a href="#" class="pagination" data-page="'+p1+'">'+p1+'</a></li>';
                                    // }

                                    // nav += '<li class="active"><a href="#" class="pagination active" data-page="'+this.current_page+'">'+this.current_page+'</a></li>';

                                    // if(this.current_page+1 < this.total_pages){
                                    //     n1 = this.current_page + 1;
                                    //     nav += '<li><a href="#" class="pagination" data-page="'+n1+'">'+n1+'</a></li>';
                                    // }
                                    // if(this.current_page+2 < this.total_pages){
                                    //     n2 = this.current_page + 2;
                                    //     nav += '<li><a href="#" class="pagination" data-page="'+n2+'">'+n2+'</a></li>';
                                    // }
                                } else {
                                    for(i=1; i <= this.total_pages; i++) {
                                        if(i === this.current_page) {
                                            nav += '<li><a href="#" class="pagination active" data-page="'+i+'">'+i+'</a></li>';
                                        } else {
                                            nav += '<li><a href="#" class="pagination" data-page="'+i+'">'+i+'</a></li>';
                                        }
                                    }
                                }
                                if(this.current_page < this.total_pages){
                                    n1 = this.current_page + 1;
                                    nav += '<li><a href="#" class="pagination next" data-page="'+n1+'"><span class="text">Next</span></a></li>';
                                    nav += '<li><a href="#" class="pagination last" data-page="'+this.total_pages+'"><span class="text">Last</span></a></li>';
                                }


                                nav +='</ul></nav>';
                                Dazzle.gallery.settings.$gallery_content.append(nav);
                                nav = '';


                            }
                        });
                    }
                },
                error : function(){
                    $gallery_cards = $('<div>', {class: 'gallery-cards'});
                    Dazzle.gallery.settings.$gallery_content.append($gallery_cards);
                    article = '<article class="error">Ooops! Something went wrong. Please try again</article>';
                    $gallery_cards.append(article);
                },
                complete : function(){
                    $(Dazzle.gallery.settings.gallery_card).flip();

                    Dazzle.gallery.imageLoader();

                    Dazzle.gallery.settings.$gallery_content.animate({opacity: 1}, 250, function() {
                        Dazzle.gallery.bindGalleryEvents();
                        Dazzle.gallery.settings.$gallery_content.css('height','100%');
                        $(Dazzle.gallery.settings.gallery_card).find('.front, .back').addClass('gallery-easing');
                    });
                }
            });

        },

        imageLoader: function() {
            var content = Dazzle.gallery.settings.$gallery_content;
            if(Dazzle.gallery.settings.map_visible !== true){
                content.find('.dz').each(function() {
                    if ($(this).prop('complete')) {
                        $(this).closest('.front').removeClass('loader');
                        $(this).addClass('full');
                    } else {
                        $(this).on('load', function(){
                            $(this).closest('.front').removeClass('loader');
                            $(this).addClass('full');
                        });
                    }
                });
            }
        },

        bindGalleryEvents: function() {
            var content = Dazzle.gallery.settings.$gallery_content;

            content.find(Dazzle.gallery.settings.gallery_card).on('click', Dazzle.gallery.flipCard);
            content.find(Dazzle.gallery.settings.like).on('click', Dazzle.gallery.likeItem);
            content.find(Dazzle.gallery.settings.btn_twitter).on('click', {share_type:'twitter'}, Dazzle.share.generateShare);
            content.find(Dazzle.gallery.settings.btn_facebook).on('click', {share_type:'facebook'}, Dazzle.share.generateShare);
            content.find(Dazzle.gallery.settings.btn_google).on('click', {share_type:'google'}, Dazzle.share.generateShare);
            content.find(Dazzle.gallery.settings.btn_pinterest).on('click', {share_type:'pinterest'}, Dazzle.share.generateShare);
            content.find(Dazzle.gallery.settings.btn_report).on('click', Dazzle.gallery.reportGalleryItem);
        },

        clearGallery: function() {
            var content = Dazzle.gallery.settings.$gallery_content;

            content.find(Dazzle.gallery.settings.gallery_card).off('click', Dazzle.gallery.flipCard);
            content.find(Dazzle.gallery.settings.like).off('click', Dazzle.gallery.likeItem);
            content.find(Dazzle.gallery.settings.btn_facebook).off('click', Dazzle.gallery.generateShare);
            content.find(Dazzle.gallery.settings.btn_twitter).off('click', Dazzle.gallery.generateShare);
            content.find(Dazzle.gallery.settings.btn_google).off('click', Dazzle.gallery.generateShare);
            content.find(Dazzle.gallery.settings.btn_pinterest).off('click', Dazzle.gallery.generateShare);
            content.find(Dazzle.gallery.settings.btn_report).off('click', Dazzle.gallery.reportGalleryItem);

            content.empty();
        },

        flipCard: function(){
            $(this).flip({
                axis: 'y',
                trigger: 'click'
            });
        },

        reportGalleryItem: function() {
            var post_id = $(this).closest('article').find('ul').data('post');
            Tracking.trackEvent('Gallery','Report Button','Report',post_id);
        },

        likeItem: function(e) {
            e.preventDefault();

            var post_id   = $(this).data('item'),
                liked     = false,
                $likeLink = $(this),
                ga_like;

            if($likeLink.hasClass('unlike')) {
                liked = false;
                ga_like = 'Unlike';
            } else {
                liked = true;
                ga_like = 'Like';
            }

            Tracking.trackEvent('Gallery','Like Button',ga_like,post_id);

            Dazzle.gallery.settings.post_data = {post_id:post_id, liked:liked, action:'like_dazzle'};

            if($likeLink.hasClass('unlike')) {
                $likeLink.parent().removeClass('liked-bg').addClass('like-bg');
                $likeLink.removeClass('unlike').text('LIKE');
            } else {
                $likeLink.parent().removeClass('like-bg').addClass('liked-bg');
                $likeLink.addClass('unlike').text('UNLIKE');
            }


            $.ajax({
                url  : dazzle_script.ajax_url,
                type :'post',
                data : Dazzle.gallery.settings.post_data,
                cache : false,
                success : function(data){
                    $('span[data-like="'+post_id+'"]').text(data);
                },
                error : function(){
                    window.alert('Ooops, something went wrong when Liking this Dazzle! Please try again.');
                    if(!($likeLink.hasClass('unlike'))) {
                        $likeLink.parent().removeClass('liked-bg').addClass('like-bg');
                        $likeLink.removeClass('unlike').text('LIKE');
                    } else {
                        $likeLink.parent().removeClass('like-bg').addClass('liked-bg');
                        $likeLink.addClass('unlike').text('UNLIKE');
                    }

                },
                complete : function(){
                }
            });
        }
    }
};

var Tracking = {
    trackEvent: function(category,action,label,post_id) {
        if(post_id !== null) {
            ga('send', {
                'hitType': 'event',
                'eventCategory': category,
                'eventAction': action,
                'eventLabel': label,
                'eventValue': 1,
                'dimension1': post_id
            });
        } else {
            ga('send', {
                'hitType': 'event',
                'eventCategory': category,
                'eventAction': action,
                'eventLabel': label
            });
        }
    }
};

$(function(){
    GaEvents.init();
    Sizing.init();
	Slider.init();
	Dazzle.init();
});