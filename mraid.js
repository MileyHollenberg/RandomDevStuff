var MRAID = function() {
                var state = 'loading';

                var listeners = {
                    ready: [],
                    error: [],
                    stateChange: [],
                    viewableChange: [],
                    sizeChange: [],
                    permissionChange: [],
                    showFallback: [],
                    showAR: []
                };

                var viewable = false;

                var orientationProperties = {
                    allowOrientationChange: true,
                    forceOrientation: 'none'
                };

                var permissions = {};

                var trigger = function(event, parameters) {
                    if(!parameters) {
                        parameters = [];
                    }
                    if(event in listeners) {
                        for (var len = listeners[event].length, i = len - 1; i >= 0; i--) {
                            var listener = listeners[event][i];
                            try {
                                listener.apply(window, parameters);
                            } catch (e) {
                                console.log('Got error ', e);
                                window.parent.postMessage({
                                    type: 'diagnosticError',
                                    error: {
                                        message: e.message
                                    }
                                }, '*');
                            }
                        }
                    }
                };

                var triggerExperienceType = function(permissionType, status) {
                    if (permissionType === 'Camera') {
                        if (status === true) {
                            trigger('showAR');
                        } else {
                            trigger('showFallback');
                        }
                    }
                };

                var width = window.innerWidth;
                var height = window.innerHeight;

                var playableConfiguration = {};

                var setState = function(newState) {
                    state = newState;
                    trigger('stateChange', [newState]);
                };

                window.addEventListener('message', function(event) {
                    switch(event.data.type) {
                        case 'viewable':
                            viewable = event.data.value;
                            trigger('viewableChange', [viewable]);
                            break;

                        case 'resize':
                            window.innerWidth = width = event.data.width;
                            window.innerHeight = height = event.data.height;
                            trigger('sizeChange', [width, height]);
                            break;

                        case 'permission':
                            permissions[event.data.value.type] = event.data.value.status;
                            trigger('permissionChange', [event.data.value.type, event.data.value.status]);
                            triggerExperienceType(event.data.value.type, event.data.value.status);
                            break;

                        default:
                            break;
                    }
                }, false);

                window.addEventListener('resize', function(e) {
                    width = window.innerWidth;
                    height = window.innerHeight;
                    trigger('sizeChange', [width, height]);
                });

                window.addEventListener('DOMContentLoaded', function() {
                    window.parent.postMessage({
                        type: 'loaded'
                    }, '*');
                    setState('default');
                    trigger('ready');
                }, false);

                this.onShowAR = function(listener) {
                    if (permissions['Camera'] === true) {
                        listener();
                    } else {
                        this.addEventListener('showAR', listener);
                    }
                };

                this.onShowFallback = function(listener) {
                    if (permissions['Camera'] === false) {
                        listener();
                    } else {
                        this.addEventListener('showFallback', listener);
                    }
                };

                this.readyToShowAR = function() {
                    window.parent.postMessage({
                        type: 'arReadyShow',
                    }, '*');
                };

                this.hideArButton = function() {
                    window.parent.postMessage({
                        type: 'hideArButton',
                    }, '*');
                };

                this.addEventListener = function(event, listener) {
                    if(event in listeners) {
                        listeners[event].push(listener);
                    }
                };

                this.createCalendarEvent = function() {
                    trigger('error', ['not implemented', 'createCalendarEvent']);
                };

                this.close = function() {
                    setState('hidden');
                    window.parent.postMessage({
                        type: 'close'
                    }, '*');
                };

                this.expand = function() {
                    trigger('error', ['not implemented', 'expand']);
                };

                this.getCurrentPosition = this.getDefaultPosition = function() {
                    return {
                        x: 0,
                        y: 0,
                        width: width,
                        height: height
                    };
                };

                this.getExpandProperties = function() {
                    trigger('error', ['not implemented', 'getExpandProperties']);
                };

                this.getMaxSize = this.getScreenSize = function() {
                    return {
                        width: width,
                        height: height
                    };
                };

                this.getOrientationProperties = function() {
                    return orientationProperties;
                };

                this.getPlacementType = function() {
                    return 'interstitial';
                };

                this.getResizeProperties = function() {
                    trigger('error', ['not implemented', 'getResizeProperties']);
                };

                this.getState = function() {
                    return state;
                };

                this.getVersion = function() {
                    return '2.0';
                };

                this.isViewable = function() {
                    return viewable;
                };

                this.getCreativeURL = function() {
                    return '{{ CREATIVE_URL }}';
                };

                this.open = function(url) {
                    window.parent.postMessage({
                        type: 'open',
                        url: url
                    }, '*');
                };

                this.playVideo = function() {
                    trigger('error', ['not implemented', 'playVideo']);
                };

                this.removeEventListener = function(event, listener) {
                    if(event in listeners) {
                        var index = listeners[event].indexOf(listener);
                        if(index !== -1) {
                            listeners[event].splice(index, 1);
                        }
                    }
                };

                this.resize = function() {
                    trigger('error', ['not implemented', 'resize']);
                };

                this.setExpandProperties = function() {
                    trigger('error', ['not implemented', 'setExpandProperties']);
                };

                this.setOrientationProperties = function(properties) {
                    orientationProperties = properties;
                    window.parent.postMessage({
                        type: 'orientation',
                        properties: properties
                    }, '*');
                };

                this.setResizeProperties = function() {
                    trigger('error', ['not implemented', 'setResizeProperties']);
                };

                this.storePicture = function() {
                    trigger('error', ['not implemented', 'storePicture']);
                };

                this.useCustomClose = function(hideClose) {
                    window.parent.postMessage({
                        type: 'useCustomClose',
                        hideClose: hideClose,
                    }, '*');
                };

                this.sendAnalyticsEvent = function(event, eventData) {
                    window.parent.postMessage({
                        type: 'analyticsEvent',
                        event: event,
                        eventData: eventData
                    }, '*');
                };

                this.setCustomMraidState = function(state) {
                    window.parent.postMessage({
                        type: 'customMraidState',
                        state: state
                    }, '*');
                };

                this.getConfiguration = function() {
                    return playableConfiguration;
                };

                this.getPermissionStatus = function(type) {
                    return permissions[type];
                };

                this.supports = function() {
                    return false;
                };
            };
            window.mraid = new MRAID();
