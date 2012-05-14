var anima = {};

anima.version = '0.9.2 build 1';

anima.isIE = false;
anima.isIE8 = false;
if ($.browser.msie) {
    anima.isIE = true;
    var version = parseInt($.browser.version[0]);
    anima.isIE8 = (version <= 8);
}

anima.cssVendorPrefix = '';
anima.cssTransitionEndEvent = '';
if ($.browser.webkit || $.browser.safari) {
    anima.cssVendorPrefix = '-webkit-';
} else if ($.browser.mozilla) {
    anima.cssVendorPrefix = '-moz-';
} else if ($.browser.opera) {
    anima.cssVendorPrefix = '-o-';
} else if ($.browser.msie) {
    anima.cssVendorPrefix = '-ms-';
}

anima.cssTransitionEndEvent = null;
if ($.support.cssTransitions) {
    if ($.browser.webkit || $.browser.safari) {
        anima.cssTransitionEndEvent = 'webkitTransitionEnd';
    } else if ($.browser.mozilla) {
        anima.cssTransitionEndEvent = 'transitionend';
    } else if ($.browser.opera) {
        anima.cssTransitionEndEvent = 'oTransitionEnd';
    } else if ($.browser.msie) {
        anima.cssTransitionEndEvent = 'MSTransitionEnd';
    } else {
        anima.cssTransitionEndEvent = 'transitionend';
    }
}

anima.isWebkit = ($.browser.webkit || $.browser.safari);

anima.frameRate = 30; // fps
anima.physicsFrameRate = 2 * anima.frameRate;

if (!window.requestAnimationFrame) {
    window.requestAnimationFrame = (function () {

        return window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.oRequestAnimationFrame ||
            window.msRequestAnimationFrame ||
            function (callback, callbackCode) {
                if (!$.browser.msie) {
                    window.setTimeout(callback, 1000 / anima.frameRate);
                } else {
                    window.setTimeout(callbackCode, 1000 / anima.frameRate);
                }
            };
    })();
}

anima.getRequestParameter = function (name, defaultValue) {

    name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
    var regexS = "[\\?&]" + name + "=([^&#]*)";
    var regex = new RegExp(regexS);
    var results = regex.exec(window.location.search);
    if (results == null)
        return defaultValue;
    else
        return decodeURIComponent(results[1].replace(/\+/g, " "));
};

anima.debug = anima.getRequestParameter('debug');

anima.log = null;
anima.logException = null;
if (anima.isIE && console && (typeof console.log == 'object')) {
    anima.log = function (msg) {
        if (anima.debug) {
            alert(msg);
        }
    };
    anima.logException = function (e) {
        anima.log(e);
    };

} else {
    anima.log = function (msg) {
        console.log(msg);
        if (msg.stack) {
            console.log(msg.stack);
        }
    };
    anima.logException = function (e) {
        if (console.exception) {
            console.exception(e);
        } else {
            anima.log(e);
        }
    };
}

if (typeof String.prototype.startsWith != 'function') {
    String.prototype.startsWith = function (str) {
        return this.indexOf(str) == 0;
    };
}

anima.nowTime = function () {

    return new Date().getTime();
};

anima.isArray = function (value) {

    return $.isArray(value);
}

anima.isNumber = function (value) {

    return $.type(value) === "number";
};

anima.isString = function (value) {

    return $.type(value) === "string";
};

anima.isObject = function (value) {

    return $.isPlainObject(value);
};

anima.isVisible = function (element$) {

    return element$ ? (element$.css("display") != "none") : false;
};

anima.isMapEmpty = function (map) {

    var name;
    for (name in map) {
        return false;
    }
    return true
};

anima.getMapSize = function (map) {

    var count = 0;
    for (name in map) {
        count++;
    }
    return count;
};

anima.clone = function (obj) {

    return $.extend({}, obj);
};

// ultra fast rounding (tip: inline for max. performance)
anima.round = function (value) {

    return ((value + 0.5) << 0);
};

anima.toDegrees = function (radians) {

    return radians * 180.0 / Math.PI;
}

anima.toRadians = function (degrees) {

    return degrees * Math.PI / 180.0;
}

anima.preventDefault = function (event) {

    if (anima.isIE) {
        event.returnValue = false;
    } else if (event.preventDefault) {
        event.preventDefault();
    }
}

anima.getScript = function (url, options) {

    options = $.extend(options || {}, {
        dataType:"script",
        cache:true,
        url:url
    });

    return $.ajax(options);
};

anima.formatDate = function (date1) {

    return date1.getFullYear() + '-' +
        (date1.getMonth() < 9 ? '0' : '') + (date1.getMonth() + 1) + '-' +
        (date1.getDate() < 10 ? '0' : '') + date1.getDate();
}

anima.allowNumbersOnly = function (event) {

    // Allow: backspace, delete, tab and escape
    if (event.keyCode == 46 || event.keyCode == 8 || event.keyCode == 9 || event.keyCode == 27 ||
        // Allow: Ctrl+A
        (event.keyCode == 65 && event.ctrlKey === true) ||
        // Allow: home, end, left, right
        (event.keyCode >= 35 && event.keyCode <= 39)) {
        // let it happen, don't do anything
        return;
    }
    else {
        // Ensure that it is a number and stop the keypress
        if ((event.keyCode < 48 || event.keyCode > 57) && (event.keyCode < 96 || event.keyCode > 105 )) {
            event.preventDefault();
        }
    }
}

anima.isValidEmail = function (email) {

    var emailReg = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    return emailReg.test(email);
}

anima.parseDate = function (str) {

    var date = null;
    try {
        date = Date.parse(str);
    } catch (e) {
    }
    return date;
}

anima.ext = {};

var b2Vec2 = Box2D.Common.Math.b2Vec2,
    b2BodyDef = Box2D.Dynamics.b2BodyDef,
    b2Body = Box2D.Dynamics.b2Body,
    b2FixtureDef = Box2D.Dynamics.b2FixtureDef,
    b2Fixture = Box2D.Dynamics.b2Fixture,
    b2World = Box2D.Dynamics.b2World,
    b2MassData = Box2D.Collision.Shapes.b2MassData,
    b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape,
    b2CircleShape = Box2D.Collision.Shapes.b2CircleShape,
    b2DebugDraw = Box2D.Dynamics.b2DebugDraw,
    b2RevoluteJointDef = Box2D.Dynamics.Joints.b2RevoluteJointDef,
    b2PI = Box2D.Common.Math.PI;

/* Simple JavaScript Inheritance
 * By John Resig http://ejohn.org/
 * MIT Licensed.
 */
// http://ejohn.org/blog/simple-javascript-inheritance/
// http://blog.buymeasoda.com/understanding-john-resigs-simple-javascript-i
// Inspired by base2 and Prototype
// IE8 fixes by Kostas Karolemeas
(function () {
    var initializing = false;

    // Test for methods including _super calls
    var fnTest = anima.isIE8 ? {test:function () {
        return true;
    }} : /xyz/.test((function () {
        xyz;
    }).toString()) ? /\b_super\b/ : /.*/;

    // The base Class implementation (does nothing)
    this.Class = function () {
    };

    // Create a new Class that inherits from this class
    Class.extend = function (prop) {
        var _super = this.prototype;

        // Instantiate a base class (but only create the instance,
        // don't run the init constructor)
        initializing = true;
        var prototype = new this();
        initializing = false;

        // Copy the properties over onto the new prototype
        for (var name in prop) {
            // Check if we're overwriting an existing function
            prototype[name] = typeof prop[name] == "function" &&
                typeof _super[name] == "function" && fnTest.test(prop[name]) ?
                (function (name, fn) {
                    return function () {
                        var tmp = this._super;

                        // Add a new ._super() method that is the same method
                        // but on the super-class
                        this._super = _super[name];

                        // The method only need to be bound temporarily, so we
                        // remove it when we're done executing
                        var ret = fn.apply(this, arguments);
                        this._super = tmp;

                        return ret;
                    };
                })(name, prop[name]) :
                prop[name];
        }

        // The dummy class constructor
        function Class() {
            // All construction is actually done in the init method
            if (!initializing && this.init)
                this.init.apply(this, arguments);
        }

        // Populate our constructed prototype object
        Class.prototype = prototype;

        // Enforce the constructor to be what we expect
        Class.prototype.constructor = Class;

        // And make this class extendable
        Class.extend = arguments.callee;

        return Class;
    };
})();
anima.Sound = Class.extend({

    init:function (id, url, loop) {

        this._id = id;
        this._url = url;
        this._loop = loop;

        this._sound = null;
    },

    toggle:function () {

        if (this.isPlaying()) {
            this.stop();
            return false;
        } else {
            this.play();
            return true;
        }
    },

    isPlaying:function () {

        if (!this._sound) {
            this._load();
        }

        return this._sound ? this._sound.playState : false;
    },

    stop:function () {

        if (!this._sound) {
            this._load();
        }

        if (this._sound) {
            this._sound.stop();
        }
    },

    play:function (options) {

        if (!this._sound) {
            this._load();
        }

        if (this._sound) {
            var options = $.extend({}, options);
            if (this._loop) {
                options.onfinish = function () {
                    this.play(options);
                }
            }

            this._sound.play(options);
        }
    },

    pause:function () {

        if (!this._sound) {
            this._load();
        }

        if (this._sound) {
            this._sound.pause();
        }
    },

    /* internal methods */

    _load:function () {

        if (window.soundManager != undefined) {
            this._sound = soundManager.createSound({
                id:this._id,
                url:this._url,
                autoload:true
            });
        }
    }
});

anima._initializeSound = function (callback) {

    window.SM2_DEFER = true;

    anima.getScript('js/lib/soundmanager2-nodebug.js', // 'js/lib/soundmanager2-nodebug-jsmin.js',
        {
            "success":function (data, textStatus, jqXHR) {

                try {
                    window.soundManager = new SoundManager();
                    soundManager.url = 'resources/swf';

                    soundManager.onready(callback);
                    soundManager.ontimeout(callback);

                    soundManager.beginDelayedInit();
                } catch (e) {
                    callback();
                }
            },

            "error":function (jqXHR, textStatus, errorThrown) {

                callback();
            }
        });
};
anima.RendererCSS3 = Class.extend({

    init:function () {

    },

    css:function (node, properties) {

        node._element$.css(properties);
    },

    html:function (node, html) {

        node._element$.html(html);
    },

    createCanvas:function (canvas) {

        var parent$ = $('#pageContent');
        parent$.append('<div id="' + canvas._id + '"></div>');
        canvas._element$ = $('#' + canvas._id);

        canvas._element$.css({
            'padding':'0px',
            'margin':'0px',
            'width':'100%',
            'height':'100%',
            'overflow':'hidden',
            'position':'absolute'
        });
    },

    addHtml5Canvas:function (canvas) {

        if (!canvas._type == 'canvas') {
            return;
        }

        var html5Canvas = document.createElement("canvas");
        html5Canvas.id = canvas._id + '_html5Canvas';
        canvas._element$.append(html5Canvas);
        canvas._html5canvas$ = $('#' + html5Canvas.id);

        canvas._html5canvas$.css({
            'position':'absolute',
            'left':'0px',
            'top':'0px',
            'padding':'0px',
            'margin':'0px'
        });

        canvas._html5canvas$.css({
            'width':'100%',
            'height':'100%',
            'min-height':'100%',
            'max-height':'100%'
        });

        canvas._html5canvas$.css({
            'overflow':'hidden',
            'pointer-events':'none',
            'z-index':10000
        });
    },

    getHtml5CanvasContext:function (canvas) {

        if (canvas._html5canvas$) {
            return canvas._html5canvas$[0].getContext("2d");
        } else {
            return null;
        }
    },

    getElementIdContext:function (parent) {

        var id = '';
        if (!parent) {
            return id;
        }

        do {
            id = parent._id + '_' + id;
            parent = parent.getParent();
        } while (parent != null);

        return id;
    },

    getElementId:function (node) {

        return this.getElementIdContext(node.getParent()) + node._id;
    },

    createElement:function (parent, node) {

        var elementId = this.getElementIdContext(parent) + node._id;

        var html = null;
        if (node._elementType == 'box') {
            html = '<div id="' + elementId + '"></div>';
        } else {
            var dataRole = 'data-role="none"';
            var placeHolder = node._editPlaceHolder ? ' placeholder="' + node._editPlaceHolder + '"' : '';
            if (node._elementType == 'text') {
                html = '<input ' + dataRole + placeHolder + ' id="' + elementId + '"></input>';
            } else if (node._elementType == 'number') {
                html = '<input ' + dataRole + placeHolder + ' id="' + elementId + '"></input>';
            } else if (node._elementType == 'email') {
                html = '<input ' + dataRole + placeHolder + ' id="' + elementId + '"></input>';
            } else if (node._elementType == 'telephone') {
                html = '<input ' + dataRole + placeHolder + ' id="' + elementId + '"></input>';
            } else if (node._elementType == 'textarea') {
                html = '<textarea ' + dataRole + placeHolder + ' id="' + elementId + '"></textarea>';
            } else if (node._elementType == 'date') {
                html = '<input ' + dataRole + placeHolder + ' id="' + elementId + '"></input>';
            } else if (node._elementType == 'time') {
                html = '<input ' + dataRole + placeHolder + ' id="' + elementId + '"></input>';
            }
        }

        if (node._renderMode == 'fast') {
            var appended = false;
            if (parent._type == 'Layer') {
                var count = parent._nodes.length;
                if (count > 0) {
                    parent._nodes[count - 1]._element$.after(html);
                    appended = true;
                }
            }
            if (!appended) {
                this.getElement(parent).append(html);
            }
        } else if (node._renderMode == 'accurate') {
            var topElement$ = node._canvas._element$.parent();
            topElement$.append(html);
        }

        node._element$ = $('#' + elementId);

        node._element$.css({
            'position':'absolute'
        });
    },

    getParentElementSize:function (node) {

        var parent$ = this.getElement(node).parent();
        return {
            width:parent$.width(),
            height:parent$.height()
        }
    },

    setBackground:function (node) {

        if (!node._element$) {
            return;
        }

        var css = {};

        var background = '';
        if (node._background.color) {
            background += node._background.color;
        }
        if (node._background.url) {
            background += ' url(' + node._background.url + ')';
        }
        if (background.length > 0) {
            css['background'] = background;
        }

        if (node._background.url) {
            css['background-repeat'] = 'no-repeat';
            css['background-position'] = 'left top';
        }

        node._element$.css(css);
    },

    setCurrentSprite:function (node, index) {

        if (node._background.url) {
            var spriteSheet = node._background.spriteSheet;
            if (spriteSheet) {
                index = anima.round(index);
                if (index >= 0 && index < spriteSheet.totalSprites) {
                    var rows = spriteSheet.rows;
                    var columns = spriteSheet.columns;

                    var row = Math.floor(index / columns);
                    var column = index - (row * columns);

                    var position = (-column * node._size.width) + 'px '
                        + (-row * node._size.height) + 'px';

                    node._element$.css('background-position', position);
                }
            }
        }
    },

    setFont:function (node) {

        node._element$.css({
            'font-family':node._font.family,
            'font-size':node._font.size,
            'font-weight':node._font.weight,
            'color':node._font.color
        });
    },

    getElement:function (node) {

        while (node != null && !node._element$) {
            node = node.getParent();
        }
        return (node != null) ? node._element$ : null;
    },

    updateTransform:function (node) {

        if (node._renderMode == 'fast') {
            this._applyCSS3Transform(node);
        } else if (node._renderMode == 'accurate') {
            this._applyCSS2Transform(node);
        }

        this._updateAccurateNodes(node);
    },

    updateOrigin:function (node) {

        var origin = (node._origin.x * 100) + '% ' + (node._origin.y * 100) + '%';
        node._element$.css(anima.cssVendorPrefix + 'transform-origin', origin);
    },

    updateSize:function (node) {

        node._element$.css({
            'width':node._size.width,
            'height':node._size.height
        });

        if (node._resizeHandler && node.isVisible()) {
            node._resizeHandler(node);
        }
    },

    updateHtml5Canvas:function (node) {

        if (node._html5canvas$) {
            var canvas = node._html5canvas$[0];
            canvas.width = node._size.width;
            canvas.height = node._size.height;
        }
    },

    updateAll:function (node) {

        this.updateOrigin(node);
        this.updateSize(node);
        this.updateTransform(node);

        this.updateHtml5Canvas(node);
    },

    on:function (node, eventType, handler) {

        node._element$.bind(eventType, node, handler);
    },

    off:function (node, eventType, handler) {

        node._element$.unbind(eventType, handler);
    },

    removeElement:function (node) {

        node._element$.remove();
    },

    /* internal methods */

    _updateAccurateNodes:function (node) {

        var accurateNodes = node._accurateNodes;
        if (accurateNodes) {
            var accurateNode, renderer;
            var count = accurateNodes.length;
            for (var i = 0; i < count; i++) {
                accurateNode = accurateNodes[i];
                accurateNode._renderer.updateTransform(accurateNode);
            }
        }
    },

    _applyCSS3Transform:function (node) {

        var x = (node._position.x - node._origin.x * node._size.width + 0.5) << 0;
        var y = (node._position.y - node._origin.y * node._size.height + 0.5) << 0;
        var translation = 'translate(' + x + 'px, ' + y + 'px)';

        var scale = ' scale(' + node._scale.x + ', ' + node._scale.y + ')';

        var rotation = '';
        if (node._angle && node._angle != 0) {
            var degrees = -anima.toDegrees(node._angle);
            rotation = 'rotate(' + degrees + 'deg) ';
        }

        var acceleration = anima.isWebkit ? ' translateZ(0)' : '';

        var transformation = translation + scale + rotation + acceleration;
        node._element$.css(anima.cssVendorPrefix + 'transform', transformation);

        if (node._resizeHandler && node.isVisible()) {
            node._resizeHandler(node);
        }
    },

    _applyCSS2Transform:function (node) {

        var box = node._getScaledBox(true);
        if (!box) {
            return;
        }

        node._element$.css({
            'left':(box.x + 0.5) << 0,
            'top':(box.y + 0.5) << 0,
            'width':(box.width + 0.5) << 0,
            'height':(box.height + 0.5) << 0
        });

        if (node._resizeHandler && node.isVisible()) {
            node._resizeHandler(node);
        }
    }
});

anima.RendererIE = anima.RendererCSS3.extend({

    addHtml5Canvas:function (canvas) {

    },

    getHtml5CanvasContext:function (canvas) {

        return null;
    },

    setBackground:function (node) {

        if (!node._element$) {
            return;
        }

        var css = {};

        var background = '';
        var scaleFilter = '';

        if (node._background.color) {
            background += node._background.color;
        }
        if (node._background.url) {
            var scaleFilter = "progid:DXImageTransform.Microsoft.AlphaImageLoader(src='"
                + node._background.url
                + "',sizingMethod='scale')";
        }
        if (background.length > 0) {
            css['background'] = background;
        }

        if (node._background.url) {
            css['background-repeat'] = 'no-repeat';
            css['background-position'] = 'left top';

            css['filter'] = scaleFilter;
            css['-ms-filter'] = scaleFilter;
        }

        node._element$.css(css);
    },

    updateTransform:function (node) {

        node.forEachNode(node, this._applyCSS2Transform);
    },

    updateOrigin:function (node) {

    },

    updateSize:function (node) {

        if (node._resizeHandler && node.isVisible()) {
            node._resizeHandler(node);
        }
    },

    updateHtml5Canvas:function (node) {

    },

    /* internal methods */

    _applyCSS2Transform:function (node) {

        var box = node._getScaledBox();
        if (!box) {
            return;
        }

        node._element$.css({
            'left':(box.x + 0.5) << 0,
            'top':(box.y + 0.5) << 0,
            'width':(box.width + 0.5) << 0,
            'height':(box.height + 0.5) << 0
        });

        if (node._resizeHandler && node.isVisible()) {
            node._resizeHandler(node);
        }
    }
});

anima.defaultRenderer = anima.isIE8 ? new anima.RendererIE() : new anima.RendererCSS3();

anima.Node = Class.extend({

    init:function (id, options) {

        this._id = id;

        this._type = 'Node';

        if (!options) {
            options = {};
        }
        this._elementType = options.elementType || 'box';
        this._editPlaceHolder = options.placeHolder;
        this._renderMode = options.renderMode || 'fast';
        if (anima.isIE8) {
            this._renderMode = 'fast';
        }

        this._position = {
            x:0,
            y:0
        };
        this._size = {
            width:0,
            height:0
        };
        this._scale = {
            x:1.0,
            y:1.0
        };
        this._origin = {
            x:0.0,
            y:0.0
        };
        this._angle = 0;

        this._font = {
            size:'12px',
            family:'Arial, sans-serif',
            weight:'normal'
        };

        this._backgrounds = {};
        this._background = null;

        this._data = {};

        this._renderer = anima.defaultRenderer;

        this._dragging = false;
        this._dragged = false;
        this._draggingHandler = null;

        this._resizeHandler = null;
    },

    getId:function () {

        return this._id;
    },

    isVisible:function () {

        return anima.isVisible(this.getElement());
    },

    css:function (properties) {

        this._renderer.css(this, properties);
    },

    html:function (html) {

        this._renderer.html(this, html);
    },

    getElementType:function () {

        return this._elementType;
    },

    getEditPlaceHolder:function () {

        return this._editPlaceHolder;
    },

    getLayer:function () {

        return this._layer;
    },

    getParent:function () {

        return this._layer;
    },

    getCanvas:function () {

        return this._canvas;
    },

    getElement:function () {

        return this._renderer.getElement(this);
    },

    get:function (propertyName) {

        return this._data[propertyName];
    },

    set:function (propertyName, value) {

        if (value) {
            this._data[propertyName] = value;
        } else {
            delete this._data[propertyName];
        }
    },

    hide:function () {

        this.getElement().hide();
    },

    show:function () {

        this.getElement().show();
    },

    fadeIn:function (duration, callbackFn) {

        if (!duration) {
            duration = 400;
        }

        this.getElement().css('opacity', 0.0);
        this.show();

        var me = this;
        return this._animator.addAnimation({
            interpolateValuesFn:function (animator, t) {
                var opacity = animator.interpolate(0.0, 1.0, t);
                me.getElement().css('opacity', opacity);
            },
            duration:duration,
            easing:anima.Easing.easeInOutSine,
            onAnimationEndedFn:callbackFn});
    },

    fadeOut:function (duration, callbackFn) {

        if (!duration) {
            duration = 400;
        }

        var me = this;
        return this._animator.addAnimation({
            interpolateValuesFn:function (animator, t) {
                var opacity = animator.interpolate(1.0, 0.0, t);
                me.getElement().css('opacity', opacity);
            },
            duration:duration,
            easing:anima.Easing.easeInOutSine,
            onAnimationEndedFn:function (animation) {
                me.hide();
                if (callbackFn) {
                    callbackFn();
                }
            }});
    },

    setSize:function (width, height, postponeTransform) {

        if (this._layer) {
            if (!width) {
                width = this._layer._scene._size.width;
            }
            if (!height) {
                height = this._layer._scene._size.height;
            }
        }
        this._size.width = width;
        this._size.height = height;

        if (!postponeTransform) {
            this._renderer.updateAll(this);
        }
    },

    addBackground:function (color, url, spriteSheet, name) {

        if (!name) {
            name = 'default';
        }

        var first = anima.isMapEmpty(this._backgrounds);

        this._backgrounds[name] = {
            color:color,
            url:url,
            spriteSheet:anima.clone(spriteSheet),
            lastSpriteIndex:-1
        };

        if (first) {
            this.setActiveBackground(name);
        }
    },

    setActiveBackground:function (name) {

        var background = this._backgrounds[name];
        if (background) {
            this._background = background;
            this._renderer.setBackground(this);
        }
    },

    getTotalSprites:function () {

        if (this._background) {
            if (this._background.spriteSheet) {
                return this._background.spriteSheet.totalSprites;
            } else {
                return 1;
            }
        } else {
            return 0;
        }
    },

    getSpriteSheetDuration:function () {

        if (this._background) {
            if (this._background.spriteSheet) {
                var duration = this._background.spriteSheet.duration;
                return duration ? duration : 2000;
            } else {
                return 0;
            }
        } else {
            return 0;
        }
    },

    setCurrentSprite:function (index) {

        if (this._background) {
            var spriteSheet = this._background.spriteSheet;
            if (spriteSheet) {
                index = (index + 0.5) << 0;
                if (spriteSheet.lastSpriteIndex == index) {
                    return;
                }
                spriteSheet.lastSpriteIndex = index;
                this._renderer.setCurrentSprite(this, index);
            }
        }
    },

    animateSpriteSheet:function (startFrame, endFrame, duration, onAnimationEndedFn) {

        if (!startFrame && !endFrame) {
            startFrame = 0;
            endFrame = this.getTotalSprites() - 1;
        }
        if (!duration) {
            duration = this.getSpriteSheetDuration();
        }

        var me = this;
        var animationId = this._animator.addAnimation({
            interpolateValuesFn:function (animator, t) {
                var index = (startFrame + t * (endFrame - startFrame)) / duration;
                me.setCurrentSprite(index);
            },
            duration:duration,
            onAnimationEndedFn:onAnimationEndedFn
        });
    },

    getSize:function () {

        return this._size;
    },

    setOrigin:function (origin) {

        this._origin = anima.clone(origin);
        this._renderer.updateOrigin(this);
    },

    getOrigin:function () {

        return this._origin;
    },

    setPosition:function (position) {

        this._position = anima.clone(position);
        this._renderer.updateTransform(this);
    },

    getPosition:function () {

        return this._position;
    },

    move:function (dx, dy) {

        this._position.x += dx;
        this._position.y += dy;
        this._renderer.updateTransform(this);
    },

    setScale:function (scale) {

        this._scale = anima.clone(scale);
        this._renderer.updateTransform(this);
    },

    getScale:function () {

        return this._scale;
    },

    scale:function (dsx, dsy) {

        this._scale.x *= dsx;
        this._scale.y *= dsy;
        this._renderer.updateTransform(this);
    },

    setAngle:function (angle) {

        this._angle = angle;
        this._renderer.updateTransform(this);
    },

    getAngle:function () {

        return this._angle;
    },

    rotate:function (da) {

        this._angle += da;
        this._renderer.updateTransform(this);
    },

    setFont:function (font) {

        this._font = $.extend(this._font, font);
        this._renderer.setFont(this);
    },

    getFont:function () {

        return this._font;
    },

    on:function (eventType, handler) {

        if (eventType == 'vdrag') {
            this._draggingHandler = handler;
            this._renderer.on(this, 'vmousedown', anima._dragHandler);
            this._renderer.on(this, 'vmousemove', anima._dragHandler);
            this._renderer.on(this, 'vmouseup', anima._dragHandler);
        } else if (eventType == 'resize') {
            this._resizeHandler = handler;
        } else {
            this._renderer.on(this, eventType, handler);
        }
    },

    off:function (eventType, handler) {

        if (eventType == 'vdrag') {
            this._draggingHandler = null;
            this._renderer.off(this, 'vmousedown', anima._dragHandler);
            this._renderer.off(this, 'vmousemove', anima._dragHandler);
            this._renderer.off(this, 'vmouseup', anima._dragHandler);
        } else {
            this._renderer.off(this, eventType, handler);
        }
    },

    canvasPosition:function (event) {

        var canvas = this._canvas;
        return {
            'x':(event.pageX - canvas._position.x) / canvas._scale.x,
            'y':(event.pageY - canvas._position.y) / canvas._scale.y
        }
    },

    getAnimator:function () {

        return this._animator;
    },

    forEachNode:function (root, callbackFn) {

        var type = root._type;
        if (type == 'Node') {
            callbackFn(root);
        } else if (type == 'Layer') {
            for (var i = 0; i < root._nodes.length; i++) {
                callbackFn(root._nodes[i]);
            }
        } else if (type == 'Scene') {
            callbackFn(root);
            for (var i = 0; i < root._layers.length; i++) {
                this.forEachNode(root._layers[i], callbackFn);
            }
        } else if (type == 'Canvas') {
            callbackFn(root);
            for (var i = 0; i < root._scenes.length; i++) {
                this.forEachNode(root._scenes[i], callbackFn);
            }
        }
    },

    /* internal methods */

    _getImageUrls:function (urls) {

        for (var name in this._backgrounds) {
            var url = this._backgrounds[name].url;
            if (url) {
                urls.push(url);
            }
        }
    },

    _getScaledBox:function (absolute) {

        if (!this._position) {
            return null;
        }

        var layer = this._layer;
        var scene = layer._scene;
        var canvas = scene._canvas;

        var me = this;
        if (absolute) {
            return {
                x:((me._position.x * scene._scale.x + scene._position.x) * canvas._scale.x + canvas._position.x),
                y:((me._position.y * scene._scale.y + scene._position.y) * canvas._scale.y + canvas._position.y),
                width:me._size.width * me._scale.x * scene._scale.x * canvas._scale.x,
                height:me._size.height * me._scale.y * scene._scale.y * canvas._scale.y
            };
        } else {
            return {
                x:me._position.x * scene._scale.x * canvas._scale.x,
                y:me._position.y * scene._scale.y * canvas._scale.y,
                width:me._size.width * me._scale.x * scene._scale.x * canvas._scale.x,
                height:me._size.height * me._scale.y * scene._scale.y * canvas._scale.y
            };
        }
    },

    _removeElement:function () {

        this._renderer.removeElement(this);
    }
});

anima._dragHandler = function (event) {

    var node = event.data;

    var type = event.type;
    var which = event.which;
    switch (type) {
        case 'vmousedown':
            if (which == 1 || which == 0) {
                if (node._dragging && node._dragged) {
                    node._dragging = false;
                    node._dragged = false;
                    if (node._draggingHandler) {
                        node._draggingHandler(event, 'dragend', node);
                    }
                } else {
                    node._dragging = true;
                    node._dragged = false;
                    if (node._draggingHandler) {
                        node._draggingHandler(event, 'dragstart', node);
                    }
                }
            }
            break;
        case 'vmousemove':
            if (node._dragging) {
                event.stopPropagation();
                anima.preventDefault(event);

                node._dragged = true;
                if (node._dragging && node._draggingHandler) {
                    node._draggingHandler(event, 'dragmove', node);
                }
            }
            break;
        case 'vmouseup':
            if (which == 1 || which == 0) {
                if (node._dragging && node._dragged) {
                    event.stopPropagation();
                    anima.preventDefault(event);

                    node._dragging = false;
                    node._dragged = false;
                    if (node._draggingHandler) {
                        node._draggingHandler(event, 'dragend', node);
                    }
                }
            }
            break;
    }
}
anima.Layer = Class.extend({

    init:function (id) {

        this._id = id;

        this._type = 'Layer';

        this._data = {};

        this._nodes = [];
        this._nodeMap = [];

        this._renderer = anima.defaultRenderer;
    },

    getId:function () {

        return this._id;
    },

    getScene:function () {

        return this._scene;
    },

    getParent:function () {

        return this._scene;
    },

    getElement:function () {

        return this._renderer.getElement(this);
    },

    get:function (propertyName) {

        return this._data[propertyName];
    },

    set:function (propertyName, value) {

        if (value) {
            this._data[propertyName] = value;
        } else {
            delete this._data[propertyName];
        }
    },

    addNode:function (node) {

        node._layer = this;
        node._animator = this._animator;
        node._canvas = this._canvas;

        this._renderer.createElement(this, node);

        this._nodes.push(node);
        this._nodeMap[node._id] = node;

        if (node._renderMode == 'accurate') {
            this._scene._accurateNodes.push(node);
        }

        if (node.logic) {
            node.getLevel()._addNodeWithLogic(node);
        }
    },

    getNode:function (id) {

        return this._nodeMap[id];
    },

    removeNode:function (id) {

        var node = this.getNode();
        if (node) {
            var count = this._nodes.length;
            for (var i = 0; i < count; i++) {
                if (this._nodes[i]._id = id) {
                    this._nodes.splice(i, 1);
                    delete this._nodeMap[id];
                    node._removeElement();
                    return;
                }
            }
            node._layer = null;
        }
    },

    getAnimator:function () {

        return this._animator;
    },

    /* internal methods */

    _getImageUrls:function (urls) {

        var count = this._nodes.length;
        for (var i = 0; i < count; i++) {
            this._nodes[i]._getImageUrls(urls);
        }
    },

    _removeElement:function () {

        var count = this._nodes.length;
        for (var i = 0; i < count; i++) {
            this._nodes[i].removeElement();
        }
        this._nodes = [];
        this._nodeMap = [];
    }
});
anima.Scene = anima.Node.extend({

    init:function (id) {

        this._super(id);

        this._type = 'Scene';

        this._origin.x = 0;
        this._origin.y = 0;

        this._layers = [];
        this._layerMap = [];

        this._viewport = null;

        this._accurateNodes = [];
    },

    getCanvas:function () {

        return this._canvas;
    },

    getParent:function () {

        return this._canvas;
    },

    addLayer:function (layer) {

        this._layers.push(layer);
        this._layerMap[layer._id] = layer;

        layer._scene = this;
        layer._animator = this._animator;
        layer._canvas = this._canvas;
    },

    getLayer:function (id) {

        return this._layerMap[id];
    },

    removeLayer:function (id) {

        var layer = this.getLayer();
        if (layer) {
            var count = this._layers.length;
            for (var i = 0; i < count; i++) {
                if (this._layers[i]._id = id) {
                    this._layers.splice(i, 1);
                    delete this._layerMap[id];
                    layer._removeElement();
                    return;
                }
            }
            layer._scene = null;
        }
    },

    setSize:function (postponeTransform) {

        this._super(this._canvas._size.width, this._canvas._size.height, true);

        if (!postponeTransform) {
            this._renderer.updateAll(this);
        }
    },

    setViewport:function (viewport, duration, easing, callbackFn) {

        var reset = false;
        if (!viewport) {
            viewport = {
                x1:0,
                y1:0,
                x2:this._canvas._size.width,
                y2:this._canvas._size.height
            };
            reset = true;
        }

        if (!duration) {
            duration = 0;
        }
        if (!easing) {
            easing = anima.Easing.transition['ease-in-out-sine'];
        }

        viewport = this._adjustViewAspectRatio(viewport);

        var x1 = this._position.x;
        var y1 = this._position.y;
        var x2 = -viewport.x1 * viewport.scale;
        var y2 = -viewport.y1 * viewport.scale;

        var s1 = this._scale.x;
        var s2 = viewport.scale;

        var element$ = this.getElement();

        if (duration == 0) {
            this._scale.x = this._scale.y = s2;
            this._position.x = x2;
            this._position.y = y2;
            this._renderer.updateTransform(this);
        } else {
            var me = this;

            if (anima.cssTransitionEndEvent && anima.isObject(easing)) {
                var css = {};
                css[anima.cssVendorPrefix + 'transition-properties'] = 'transform';
                css[anima.cssVendorPrefix + 'transition-duration'] = duration + 'ms';
                css[anima.cssVendorPrefix + 'transition-timing-function'] = easing.css;
                me.css(css);

                element$.bind(anima.cssTransitionEndEvent, function () {
                    element$.unbind(anima.cssTransitionEndEvent);

                    var css = {};
                    css[anima.cssVendorPrefix + 'transition-property'] = '';
                    css[anima.cssVendorPrefix + 'transition-duration'] = '';
                    css[anima.cssVendorPrefix + 'transition-timing-function'] = '';
                    me.css(css);

                    if (callbackFn) {
                        callbackFn(null, viewport);
                    }
                });

                this._scale.x = this._scale.y = s2;
                this._position.x = x2;
                this._position.y = y2;
                this._renderer.updateTransform(me);
            } else {
                this._canvas._animator.addAnimation({
                    interpolateValuesFn:function (animator, dt) {

                        me._scale.x = me._scale.y = animator.interpolate(s1, s2, dt);
                        me._position.x = animator.interpolate(x1, x2, dt);
                        me._position.y = animator.interpolate(y1, y2, dt);

                        me._renderer.updateTransform(me);
                    },
                    duration:duration,
                    easing:easing,
                    onAnimationEndedFn:function (animation) {
                        if (callbackFn) {
                            callbackFn(animation, viewport);
                        }
                    }});
            }
        }

        this._viewport = reset ? null : viewport;
    },

    getViewport:function () {

        return anima.clone(_view);
    },

    inViewport:function () {

        return (this._viewport != null);
    },

    /* internal methods */

    _getScaledBox:function () {

        if (!this._position) {
            return null;
        }

        var canvas = this._canvas;

        var me = this;
        return {
            x:me._position.x * canvas._scale.x,
            y:me._position.y * canvas._scale.y,
            width:me._size.width * me._scale.x * canvas._scale.x,
            height:me._size.height * me._scale.y * canvas._scale.y
        };
    },

    _adjustViewAspectRatio:function (view) {

        var adjustedBox = anima.clone(view);

        var boxWidth = view.x2 - view.x1;
        var boxHeight = view.y2 - view.y1;

        var sceneRatio = this._size.width / this._size.height;
        if (sceneRatio < 1) {
            var newBoxHeight = boxWidth / sceneRatio;
            var offset = ((newBoxHeight - boxHeight) / 2 + 0.5) << 0;
            adjustedBox.y1 -= offset;
            adjustedBox.y2 += offset;
        } else {
            var newBoxWidth = boxHeight * sceneRatio;
            var offset = ((newBoxWidth - boxWidth) / 2 + 0.5) << 0;
            adjustedBox.x1 -= offset;
            adjustedBox.x2 += offset;
        }

        adjustedBox.scale = this._size.width / (adjustedBox.x2 - adjustedBox.x1);

        return adjustedBox;
    },

    _getImageUrls:function (urls) {

        var url = this._background.url;
        if (url) {
            urls.push(url);
        }

        var count = this._layers.length;
        for (var i = 0; i < count; i++) {
            this._layers[i]._getImageUrls(urls);
        }
    },

    _removeElement:function () {

        var count = this._layers.length;
        for (var i = 0; i < count; i++) {
            this._layers[i].removeElement();
        }
        this._layers = [];
        this._layerMap = [];

        this._super();
    },

    /* unsupported methods */

    setOrigin:function (origin) {

        throw "unsupported operation";
    },

    getOrigin:function () {

        throw "unsupported operation";
    },

    setPosition:function (position) {

        throw "unsupported operation";
    },

    getPosition:function () {

        throw "unsupported operation";
    },

    move:function (dx, dy) {

        throw "unsupported operation";
    },

    setScale:function (scale) {

        throw "unsupported operation";
    },

    getScale:function () {

        throw "unsupported operation";
    },

    scale:function (dsx, dsy) {

        throw "unsupported operation";
    },

    setAngle:function (angle) {

        throw "unsupported operation";
    },

    getAngle:function () {

        throw "unsupported operation";
    },

    rotate:function (da) {

        throw "unsupported operation";
    }
});
/*!
 * Bez @VERSION
 * http://github.com/rdallasgray/bez
 *
 * A plugin to convert CSS3 cubic-bezier co-ordinates to jQuery-compatible easing functions
 *
 * With thanks to Nikolay Nemshilov for clarification on the cubic-bezier maths
 * See http://st-on-it.blogspot.com/2011/05/calculating-cubic-bezier-function.html
 *
 * Copyright @YEAR Robert Dallas Gray. All rights reserved.
 * Provided under the FreeBSD license: https://github.com/rdallasgray/bez/blob/master/LICENSE.txt
 */
jQuery.extend({ bez:function (coOrdArray) {
    var encodedFuncName = "bez_" + $.makeArray(arguments).join("_").replace(".", "p");
    if (typeof jQuery.easing[encodedFuncName] !== "function") {
        var polyBez = function (p1, p2) {
            var A = [null, null], B = [null, null], C = [null, null],
                bezCoOrd = function (t, ax) {
                    C[ax] = 3 * p1[ax], B[ax] = 3 * (p2[ax] - p1[ax]) - C[ax], A[ax] = 1 - C[ax] - B[ax];
                    return t * (C[ax] + t * (B[ax] + t * A[ax]));
                },
                xDeriv = function (t) {
                    return C[0] + t * (2 * B[0] + 3 * A[0] * t);
                },
                xForT = function (t) {
                    var x = t, i = 0, z;
                    while (++i < 14) {
                        z = bezCoOrd(x, 0) - t;
                        if (Math.abs(z) < 1e-3) break;
                        x -= z / xDeriv(x);
                    }
                    return x;
                };
            return function (t) {
                return bezCoOrd(xForT(t), 1);
            }
        };
        jQuery.easing[encodedFuncName] = function (x, t, b, c, d) {
            return c * polyBez([coOrdArray[0], coOrdArray[1]], [coOrdArray[2], coOrdArray[3]])(t / d) + b;
        }
    }
    return jQuery.easing[encodedFuncName];
}});

anima.Easing = {

    // jQuery Easing Function Parameters
    // x: current time normalized [0..1]
    // t: current time in ms since animation start
    // b: start value, usually = 0
    // c: change from the start value to the end value, usually = 1
    // d: animation duration

    easeInQuad:function (x, t, b, c, d) {
        return c * (t /= d) * t + b;
    },

    easeOutQuad:function (x, t, b, c, d) {
        return -c * (t /= d) * (t - 2) + b;
    },

    easeInOutQuad:function (x, t, b, c, d) {
        if ((t /= d / 2) < 1) return c / 2 * t * t + b;
        return -c / 2 * ((--t) * (t - 2) - 1) + b;
    },

    easeInCubic:function (x, t, b, c, d) {
        return c * (t /= d) * t * t + b;
    },

    easeOutCubic:function (x, t, b, c, d) {
        return c * ((t = t / d - 1) * t * t + 1) + b;
    },

    easeInOutCubic:function (x, t, b, c, d) {
        if ((t /= d / 2) < 1) return c / 2 * t * t * t + b;
        return c / 2 * ((t -= 2) * t * t + 2) + b;
    },

    easeInQuart:function (x, t, b, c, d) {
        return c * (t /= d) * t * t * t + b;
    },

    easeOutQuart:function (x, t, b, c, d) {
        return -c * ((t = t / d - 1) * t * t * t - 1) + b;
    },

    easeInOutQuart:function (x, t, b, c, d) {
        if ((t /= d / 2) < 1) return c / 2 * t * t * t * t + b;
        return -c / 2 * ((t -= 2) * t * t * t - 2) + b;
    },

    easeInQuint:function (x, t, b, c, d) {
        return c * (t /= d) * t * t * t * t + b;
    },

    easeOutQuint:function (x, t, b, c, d) {
        return c * ((t = t / d - 1) * t * t * t * t + 1) + b;
    },

    easeInOutQuint:function (x, t, b, c, d) {
        if ((t /= d / 2) < 1) return c / 2 * t * t * t * t * t + b;
        return c / 2 * ((t -= 2) * t * t * t * t + 2) + b;
    },

    easeInSine:function (x, t, b, c, d) {
        return -c * Math.cos(t / d * (Math.PI / 2)) + c + b;
    },

    easeOutSine:function (x, t, b, c, d) {
        return c * Math.sin(t / d * (Math.PI / 2)) + b;
    },

    easeInOutSine:function (x, t, b, c, d) {
        return -c / 2 * (Math.cos(Math.PI * t / d) - 1) + b;
    },

    easeInExpo:function (x, t, b, c, d) {
        return (t == 0) ? b : c * Math.pow(2, 10 * (t / d - 1)) + b;
    },

    easeOutExpo:function (x, t, b, c, d) {
        return (t == d) ? b + c : c * (-Math.pow(2, -10 * t / d) + 1) + b;
    },

    easeInOutExpo:function (x, t, b, c, d) {
        if (t == 0) return b;
        if (t == d) return b + c;
        if ((t /= d / 2) < 1) return c / 2 * Math.pow(2, 10 * (t - 1)) + b;
        return c / 2 * (-Math.pow(2, -10 * --t) + 2) + b;
    },

    easeInCirc:function (x, t, b, c, d) {
        return -c * (Math.sqrt(1 - (t /= d) * t) - 1) + b;
    },

    easeOutCirc:function (x, t, b, c, d) {
        return c * Math.sqrt(1 - (t = t / d - 1) * t) + b;
    },

    easeInOutCirc:function (x, t, b, c, d) {
        if ((t /= d / 2) < 1) return -c / 2 * (Math.sqrt(1 - t * t) - 1) + b;
        return c / 2 * (Math.sqrt(1 - (t -= 2) * t) + 1) + b;
    },

    easeInElastic:function (x, t, b, c, d) {
        var s = 1.70158;
        var p = 0;
        var a = c;
        if (t == 0) return b;
        if ((t /= d) == 1) return b + c;
        if (!p) p = d * .3;
        if (a < Math.abs(c)) {
            a = c;
            var s = p / 4;
        }
        else var s = p / (2 * Math.PI) * Math.asin(c / a);
        return -(a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
    },

    easeOutElastic:function (x, t, b, c, d) {
        var s = 1.70158;
        var p = 0;
        var a = c;
        if (t == 0) return b;
        if ((t /= d) == 1) return b + c;
        if (!p) p = d * .3;
        if (a < Math.abs(c)) {
            a = c;
            var s = p / 4;
        }
        else var s = p / (2 * Math.PI) * Math.asin(c / a);
        return a * Math.pow(2, -10 * t) * Math.sin((t * d - s) * (2 * Math.PI) / p) + c + b;
    },

    easeInOutElastic:function (x, t, b, c, d) {
        var s = 1.70158;
        var p = 0;
        var a = c;
        if (t == 0) return b;
        if ((t /= d / 2) == 2) return b + c;
        if (!p) p = d * (.3 * 1.5);
        if (a < Math.abs(c)) {
            a = c;
            var s = p / 4;
        }
        else var s = p / (2 * Math.PI) * Math.asin(c / a);
        if (t < 1) return -.5 * (a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
        return a * Math.pow(2, -10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p) * .5 + c + b;
    },

    easeInBack:function (x, t, b, c, d, s) {
        if (s == undefined) s = 1.70158;
        return c * (t /= d) * t * ((s + 1) * t - s) + b;
    },

    easeOutBack:function (x, t, b, c, d, s) {
        if (s == undefined) s = 1.70158;
        return c * ((t = t / d - 1) * t * ((s + 1) * t + s) + 1) + b;
    },

    easeInOutBack:function (x, t, b, c, d, s) {
        if (s == undefined) s = 1.70158;
        if ((t /= d / 2) < 1) return c / 2 * (t * t * (((s *= (1.525)) + 1) * t - s)) + b;
        return c / 2 * ((t -= 2) * t * (((s *= (1.525)) + 1) * t + s) + 2) + b;
    },

    easeInBounce:function (x, t, b, c, d) {
        return c - anima.Easing.easeOutBounce(x, d - t, 0, c, d) + b;
    },

    easeOutBounce:function (x, t, b, c, d) {
        if ((t /= d) < (1 / 2.75)) {
            return c * (7.5625 * t * t) + b;
        } else if (t < (2 / 2.75)) {
            return c * (7.5625 * (t -= (1.5 / 2.75)) * t + .75) + b;
        } else if (t < (2.5 / 2.75)) {
            return c * (7.5625 * (t -= (2.25 / 2.75)) * t + .9375) + b;
        } else {
            return c * (7.5625 * (t -= (2.625 / 2.75)) * t + .984375) + b;
        }
    },

    easeInOutBounce:function (x, t, b, c, d) {
        if (t < d / 2) return anima.Easing.easeInBounce(x, t * 2, 0, c, d) * .5 + b;
        return anima.Easing.easeOutBounce(x, t * 2 - d, 0, c, d) * .5 + c * .5 + b;
    },

    transition:{
        'in':{css:'ease-in', fn:this.easeInQuad},
        'out':{css:'ease-out', fn:this.easeOutQuad},
        'in-out':{css:'ease-in-out', fn:this.easeInOutQuad},
        'snap':{css:'cubic-bezier(0,1,.5,1)', fn:$.bez([0, 1, .5, 1])},
        'linear':{css:'cubic-bezier(0.250, 0.250, 0.750, 0.750)', fn:$.bez([0.250, 0.250, 0.750, 0.750])},
        'ease-in-quad':{css:'cubic-bezier(0.550, 0.085, 0.680, 0.530)', fn:$.bez([0.550, 0.085, 0.680, 0.530])},
        'ease-in-cubic':{css:'cubic-bezier(0.550, 0.055, 0.675, 0.190)', fn:$.bez([0.550, 0.055, 0.675, 0.190])},
        'ease-in-quart':{css:'cubic-bezier(0.895, 0.030, 0.685, 0.220)', fn:$.bez([0.895, 0.030, 0.685, 0.220])},
        'ease-in-quint':{css:'cubic-bezier(0.755, 0.050, 0.855, 0.060)', fn:$.bez([0.755, 0.050, 0.855, 0.060])},
        'ease-in-sine':{css:'cubic-bezier(0.470, 0.000, 0.745, 0.715)', fn:$.bez([0.470, 0.000, 0.745, 0.715])},
        'ease-in-expo':{css:'cubic-bezier(0.950, 0.050, 0.795, 0.035)', fn:$.bez([0.950, 0.050, 0.795, 0.035])},
        'ease-in-circ':{css:'cubic-bezier(0.600, 0.040, 0.980, 0.335)', fn:$.bez([0.600, 0.040, 0.980, 0.335])},
        'ease-in-back':{css:'cubic-bezier(0.600, -0.280, 0.735, 0.045)', fn:$.bez([0.600, -0.280, 0.735, 0.045])},
        'ease-out-quad':{css:'cubic-bezier(0.250, 0.460, 0.450, 0.940)', fn:$.bez([0.250, 0.460, 0.450, 0.940])},
        'ease-out-cubic':{css:'cubic-bezier(0.215, 0.610, 0.355, 1.000)', fn:$.bez([0.215, 0.610, 0.355, 1.000])},
        'ease-out-quart':{css:'cubic-bezier(0.165, 0.840, 0.440, 1.000)', fn:$.bez([0.165, 0.840, 0.440, 1.000])},
        'ease-out-quint':{css:'cubic-bezier(0.230, 1.000, 0.320, 1.000)', fn:$.bez([0.230, 1.000, 0.320, 1.000])},
        'ease-out-sine':{css:'cubic-bezier(0.390, 0.575, 0.565, 1.000)', fn:$.bez([0.390, 0.575, 0.565, 1.000])},
        'ease-out-expo':{css:'cubic-bezier(0.190, 1.000, 0.220, 1.000)', fn:$.bez([0.190, 1.000, 0.220, 1.000])},
        'ease-out-circ':{css:'cubic-bezier(0.075, 0.820, 0.165, 1.000)', fn:$.bez([0.075, 0.820, 0.165, 1.000])},
        'ease-out-back':{css:'cubic-bezier(0.175, 0.885, 0.320, 1.275)', fn:$.bez([0.175, 0.885, 0.320, 1.275])},
        'ease-out-quad':{css:'cubic-bezier(0.455, 0.030, 0.515, 0.955)', fn:$.bez([0.455, 0.030, 0.515, 0.955])},
        'ease-out-cubic':{css:'cubic-bezier(0.645, 0.045, 0.355, 1.000)', fn:$.bez([0.645, 0.045, 0.355, 1.000])},
        'ease-in-out-quart':{css:'cubic-bezier(0.770, 0.000, 0.175, 1.000)', fn:$.bez([0.770, 0.000, 0.175, 1.000])},
        'ease-in-out-quint':{css:'cubic-bezier(0.860, 0.000, 0.070, 1.000)', fn:$.bez([0.860, 0.000, 0.070, 1.000])},
        'ease-in-out-sine':{css:'cubic-bezier(0.445, 0.050, 0.550, 0.950)', fn:$.bez([0.445, 0.050, 0.550, 0.950])},
        'ease-in-out-expo':{css:'cubic-bezier(1.000, 0.000, 0.000, 1.000)', fn:$.bez([1.000, 0.000, 0.000, 1.000])},
        'ease-in-out-circ':{css:'cubic-bezier(0.785, 0.135, 0.150, 0.860)', fn:$.bez([0.785, 0.135, 0.150, 0.860])},
        'ease-in-out-back':{css:'cubic-bezier(0.680, -0.550, 0.265, 1.550)', fn:$.bez([0.680, -0.550, 0.265, 1.550])}
    }
};anima.Animator = Class.extend({

    init:function (adaptive) {

        this._adaptive = adaptive;

        this._animationQueue = [];
        this._animationChains = [];
        this._lastAnimationID = 0;

        this._animationLoopTimerID = null;
        this._animationTimeStart = 0;
    },

    addTask:function (taskFn, delay, data) {

        var animationId = this._lastAnimationID++;

        var animation = {
            id:animationId,
            delay:delay,
            duration:0,
            data:data
        };
        if (!delay) {
            animation.taskFn = taskFn;
        } else {
            animation.onAnimationEndedFn = taskFn;
        }

        this._animationQueue.push(animation);

        return animationId;
    },

    endAnimation:function (id) {

        if (!id) {
            return;
        }

        var animationId = this._lastAnimationID++;
        var animation = {
            id:animationId,
            endId:id
        };
        this._animationQueue.push(animation);

        return animationId;
    },

    addAnimation:function (animation, chainId) {

        animation = anima.clone(animation);
        animation.id = this._lastAnimationID++;

        if (chainId) {
            var chain = this._animationChains[chainId];
            if (!chain) {
                chain = [];
                this._animationChains[chainId] = chain;
            }
            chain.push(animation);
        } else {
            this._animationQueue.push(animation);
        }

        return animation.id;
    },

    clearAnimations:function () {

        this._animationQueue = [];
        this._animationChains = [];
    },

    animate:function () {

        var animationQueue = this._animationQueue;
        var animationChains = this._animationChains;

        if (this._animationTimeStart == 0) {
            this._animationTimeStart = new Date().getTime();
        }
        var currentTime = new Date().getTime();
        var loopTime = currentTime - this._animationTimeStart;

        var count = animationQueue.length;
        if (count == 0) {
            return loopTime;
        }

        var endedAnimations = [];
        var i;

        for (i = 0; i < count; i++) {
            this._animate(loopTime, animationQueue[i], endedAnimations);
        }

        var chain, active;
        for (var chainId in animationChains) {
            chain = animationChains[chainId];
            if (chain.length > 0) {
                active = this._animate(loopTime, chain[0], endedAnimations);
                if (!active) {
                    chain.shift();
                }
            }
        }

        count = endedAnimations.length;
        var id;
        for (i = 0; i < count; i++) {
            id = endedAnimations[i];
            this._endAnimation(id);
        }

        return loopTime;
    },

    interpolate:function (v0, v1, t) {

        if (anima.isNumber(v0)) {
            return (v0 + (v1 - v0) * t);
        } else if (anima.isObject(v0)) {
            return {
                x:(v0.x + (v1.x - v0.x) * t),
                y:(v0.y + (v1.y - v0.y) * t),
                z:v0.z ? (v0.z + (v1.z - v0.z) * t) : 0
            }
        }
    },

    /* internal methods */

    _animate:function (loopTime, animation, endedAnimations) {

        if (animation.taskFn) {
            if (!animation.delay) {
                try {
                    animation.taskFn(loopTime);
                } catch (e) {
                    anima.logException(e);
                }
                endedAnimations.push(animation.id);
                return false;
            }
        } else if (animation.endId) {
            endedAnimations.push(animation.endId);
            endedAnimations.push(animation.id);
            return false;
        }

        if (!animation.startTime) {
            animation.startTime = loopTime;
            if (animation.delay) {
                animation.startTime += animation.delay;
            }
            animation.frame = 0;
            animation.totalFrames = Math.round(0.5 + animation.duration * anima.frameRate / 1000.0);
        }

        var t;
        if (this._adaptive) {
            // TODO needs more work here...
            t = animation.frame * animation.duration / animation.totalFrames;
        } else {
            t = loopTime - animation.startTime;
        }
        if (t < 0.0) {
            return true; // delayed
        }

        var end = (t >= animation.duration);
        if (end) {
            t = animation.duration;
        }

        var easingFn = anima.isObject(animation.easing) ? animation.easing.fn : animation.easing;
        if (easingFn) {
            t = easingFn(null, t, 0.0, 1.0, animation.duration);
        }
        if (animation.interpolateValuesFn) {
            try {
                animation.interpolateValuesFn(this, t, animation.data);
            } catch (e) {
                anima.logException(e);
            }
        }

        if (end) {
            if (animation.loop) {
                animation.delay = null;
                animation.startTime = null;
            } else {
                endedAnimations.push(animation.id);
            }
        } else {
            animation.frame++;
        }

        return !end;
    },

    _endAnimation:function (id) {

        var animationQueue = this._animationQueue;

        var i, animation;

        var count = animationQueue.length;
        for (i = 0; i < count; i++) {
            animation = animationQueue[i];
            if (animation && animation.id == id) {
                animationQueue.splice(i, 1);

                if (animation.onAnimationEndedFn) {
                    animation.onAnimationEndedFn(animation);
                }

            }
        }
    }
});anima._canvases = [];

anima.Canvas = anima.Node.extend({

    init:function (id, debug, adaptive) {

        this._super(id);

        this._type = 'Canvas';

        this._renderer.createCanvas(this);

        this._animator = new anima.Animator(adaptive);

        this._scenes = [];
        this._sceneMap = [];
        this._currentScene = null;

        anima._canvases.push(this);

        this._debug = debug;
        if (debug) {
            this._renderer.addHtml5Canvas(this);
        }
    },

    getParent:function () {

        return null;
    },

    getCanvas:function () {

        return this._canvas;
    },

    addScene:function (scene) {

        scene._canvas = this;
        scene._animator = this._animator;
        scene._canvas = this;

        this._renderer.createElement(this, scene);
        scene.hide();

        this._scenes.push(scene);
        this._sceneMap[scene._id] = scene;

        scene.setSize();
    },

    getScene:function (id) {

        return this._sceneMap[id];
    },

    setCurrentScene:function (id, duration, callbackFn, progressFn) {

        if (!progressFn) {
            progressFn = anima.defaultProgressReporter;
        }

        var newScene = this.getScene(id);
        if (newScene) {
            var me = this;
            this._loadImages(newScene, progressFn, function () {
                if (!duration) {
                    duration = 500;
                }

                newScene._renderer.updateTransform(newScene);
                if (me._currentScene) {
                    me._animator.clearAnimations();
                    me._currentScene.fadeOut(duration, function () {
                        newScene.fadeIn(duration, callbackFn);
                        me._currentScene = newScene;
                    });
                } else {
                    newScene.fadeIn(duration, callbackFn);
                    me._currentScene = newScene;
                }
            });
        }
    },

    getCurrentScene:function () {

        return this._currentScene;
    },

    removeScene:function (id) {

        var scene = this.getScene();
        if (scene) {
            var count = this._scenes.length;
            for (var i = 0; i < count; i++) {
                if (this._scenes[i]._id = id) {
                    this._scenes.splice(i, 1);
                    delete this._sceneMap[id];
                    scene._removeElement();
                    return;
                }
            }
            scene._canvas = null;
        }
    },

    setSize:function (width, height) {

        this._super(width, height, true);
        this._resize();
    },

    /* internal methods */

    _getScaledBox:function () {

        if (!this._position) {
            return null;
        }

        var me = this;
        return {
            x:me._position.x,
            y:me._position.y,
            width:me._size.width * me._scale.x,
            height:me._size.height * me._scale.y
        };
    },

    _FIXED_TIMESTEP:1.0 / anima.physicsFrameRate,
    _MINIMUM_TIMESTEP:1.0 / (anima.physicsFrameRate * 10.0),
    _VELOCITY_ITERATIONS:8,
    _POSITION_ITERATIONS:8,
    _MAXIMUM_NUMBER_OF_STEPS:anima.frameRate,

    _step:function (level) {

        var world = level._world;

        var frameTime = 1.0 / anima.frameRate;
        var stepsPerformed = 0;
        while ((frameTime > 0.0) && (stepsPerformed < this._MAXIMUM_NUMBER_OF_STEPS)) {
            var deltaTime = Math.min(frameTime, this._FIXED_TIMESTEP);
            frameTime -= deltaTime;
            if (frameTime < this._MINIMUM_TIMESTEP) {
                deltaTime += frameTime;
                frameTime = 0.0;
            }
            world.Step(deltaTime, this._VELOCITY_ITERATIONS, this._POSITION_ITERATIONS);
            stepsPerformed++;
        }

        try {
            level._logic();
        } catch (e) {
            anima.logException(e);
        }

        if (this._debug) {
            level._world.DrawDebugData(true);
        }
        world.ClearForces();
    },

    _update:function () {

        try {
            var scene = this._currentScene;
            if (scene && scene._world) {
                var sleeping = !scene.isAwake();
                if (!sleeping) {
                    this._step(scene);
                }

                this._animator.animate();

                if (!sleeping) {
                    scene._update();
                }

                return;
            }

            this._animator.animate();
        } catch (e) {
            anima.logException(e);
        }
    },

    _resize:function () {

        var sourceWidth = this._size.width;
        var sourceHeight = this._size.height;

        var containerSize = this._renderer.getParentElementSize(this);
        var targetWidth = containerSize.width;
        var targetHeight = containerSize.height;

        var offsetX = 0;
        var offsetY = 0;
        var width = targetWidth;

        var requiredWidth = sourceWidth * targetHeight / sourceHeight;
        if (requiredWidth < targetWidth) {
            offsetX = (targetWidth - requiredWidth) / 2;
            width = requiredWidth;
        } else {
            var requiredHeight = sourceHeight * targetWidth / sourceWidth;
            offsetY = (targetHeight - requiredHeight) / 2;
        }

        var scale = width / sourceWidth;

        this._origin = {
            x:0,
            y:0
        };
        this._position = {
            x:offsetX,
            y:offsetY
        };
        this._scale = {
            x:scale,
            y:scale
        };

        this._renderer.updateAll(this);

        if (this._currentScene) {
            this._currentScene._renderer.updateTransform(this._currentScene);
        }
    },

    _loadImages:function (scene, progressFn, callbackFn) {

        $.mobile.showPageLoadingMsg();

        var urls = [];
        try {
            scene._getImageUrls(urls);
        } catch (e) {
            console.log(e);
            $.mobile.hidePageLoadingMsg();
            return;
        }
        var totalImages = urls.length;
        if (totalImages == 0) {
            $.mobile.hidePageLoadingMsg();
            if (callbackFn) {
                callbackFn.call();
            }
            return;
        }
        var image;
        var loadedImages = 0;
        for (var i = 0; i < totalImages; i++) {
            image = new Image();
            image.onload = function () {
                loadedImages++;

                if (progressFn) {
                    progressFn(anima.round(loadedImages * 100.0 / totalImages));
                }
                if (loadedImages >= totalImages) {
                    $.mobile.hidePageLoadingMsg();
                    if (callbackFn) {
                        callbackFn.call();
                    }
                }

                image = null;
            };
            image.src = urls[i];
        }
    }
});

anima.defaultProgressReporter = function (percent) {

    var loadIcon$ = $('.ui-loader .ui-icon-loading');
    loadIcon$.html('<div class="progress-percent">' + percent + '</div>');
}

anima.onResize = function () {

    $.each(anima._canvases, function (index, value) {
        value.getAnimator().addTask(function () {
            value._resize();
        });
    });
};

$(window).resize(function () {

    anima.onResize();
});

$(window).bind('orientationchange', function (event, orientation) {

    anima.onResize();
})

function _anima_update() {

    $.each(anima._canvases, function (index, value) {
        value._update();
    });

    window.requestAnimationFrame(_anima_update, '_anima_update()');
}

anima.start = function (callbackFn) {

    $.mobile.loadingMessageTextVisible = false;

    anima._initializeSound(function () {
        anima.onResize();
        window.requestAnimationFrame(_anima_update, '_anima_update()');

        if (callbackFn) {
            callbackFn.call();
        }
    });
};
anima.Level = anima.Scene.extend({

    init:function (id, physicalWidth, gravity) {

        this._super(id);

        this._physicalSize = {
            width:physicalWidth,
            height:null
        };
        this._physicsScale = 1.0;

        this._world = new b2World(
            gravity, // gravity
            true  // allow sleep
        );

        this._nodesWithLogic = [];
        this._dynamicBodies = [];

        this._beginContactListenerFn = null;
        this._registerContactListener();
    },

    setSize:function (postponeTransform) {

        this._super(postponeTransform);

        this._physicsScale = this._size.width / this._physicalSize.width;
        this._physicalSize.height = this._size.height * this._physicalSize.width / this._size.width;

        if (this._canvas._debug) {
            var debugDraw = new b2DebugDraw();
            debugDraw.SetSprite(this._renderer.getHtml5CanvasContext(this._canvas));
            debugDraw.SetDrawScale(this._physicsScale);
            debugDraw.SetFillAlpha(0.5);
            debugDraw.SetLineThickness(1.0);
            debugDraw.SetFlags(b2DebugDraw.e_shapeBit | b2DebugDraw.e_jointBit); // | b2DebugDraw.e_centerOfMassBit);

            this._world.SetDebugDraw(debugDraw);
        }
    },

    getWorld:function () {

        return this._world;
    },

    getPhysicsScale:function () {

        return this._physicsScale;
    },

    getPhysicalSize:function () {

        return this._physicalSize;
    },

    setContactListener:function (beginContactListenerFn) {

        this._beginContactListenerFn = beginContactListenerFn;
    },

    isAwake:function () {

        var node;
        for (var id in this._dynamicBodies) {
            node = this._dynamicBodies[id];
            if (node._body.IsAwake()) {
                return true;
            }
        }

        return false;
    },

    /* internal methods */

    _addNodeWithLogic:function (node) {

        if (node._logicFn || node.logic) {
            this._nodesWithLogic[this._renderer.getElementId(node)] = node;
        }
    },

    _removeNodeWithLogic:function (node) {

        delete this._nodesWithLogic[this._renderer.getElementId(node)];
    },

    _logic:function () {

        var node;
        for (var id in this._nodesWithLogic) {
            node = this._nodesWithLogic[id];
            node._checkAwake();
            if (node.logic) {
                node.logic();
            } else {
                node._logicFn(node);
            }
        }
    },

    _addDynamicBody:function (node) {

        if (node._body && node._body.GetType() == b2Body.b2_dynamicBody) {
            this._dynamicBodies[this._renderer.getElementId(node)] = node;
        }
    },

    _removeDynamicBody:function (node) {

        delete this._dynamicBodies[this._renderer.getElementId(node)];
    },

    _update:function () {

        var node;
        for (var id in this._dynamicBodies) {
            node = this._dynamicBodies[id];
            if (node._body.IsAwake()) {
                this._updateBody(node);
            }
        }
    },

    _updateBody:function (node) {

        var center = node._body.GetWorldCenter();
        node._position.x = (center.x /* + node._centroidOffset.x */) * this._physicsScale;
        node._position.y = (center.y /* + node._centroidOffset.y */) * this._physicsScale;

        node._angle = -node._body.GetAngle();

        this._renderer.updateTransform(node);
    },

    _registerContactListener:function () {

        var me = this;

        var listener = new Box2D.Dynamics.b2ContactListener;

        listener.BeginContact = function (contact) {

            var bodyA = contact.GetFixtureA().GetBody().GetUserData().node;
            var bodyB = contact.GetFixtureB().GetBody().GetUserData().node;

            if (bodyA.onBeginContact) {
                bodyA.onBeginContact(bodyB);
            }
            if (bodyB.onBeginContact) {
                bodyB.onBeginContact(bodyA);
            }

            if (me._beginContactListenerFn) {
                me._beginContactListenerFn(bodyA, bodyB);
            }
        };

        listener.EndContact = function (contact) {

        };

        listener.PostSolve = function (contact, impulse) {

        };

        listener.PreSolve = function (contact, oldManifold) {

        };

        this._world.SetContactListener(listener);
    }
});anima.Body = anima.Node.extend({

    init:function (id) {

        this._super(id);

        this._physicalSize = null;
        this._body = null;

        this._centroidOffset = null;

        this._logicFn = null;

        this._wasAwake = false;
        this._awakeListenerFn = null;
    },

    setSize:function (width, height) {

        this._super(width, height, true);

        var level = this._layer._scene;
        var ps = level.getPhysicsScale();
        this._physicalSize = {
            width:this._size.width / ps,
            height:this._size.height / ps
        };
    },

    define:function (bodyDef, fixDef) {

        var world = this._layer._scene._world;

        this._body = world.CreateBody(bodyDef);
        this._body.SetUserData({
            node:this
        });

        if (fixDef.svgPoints) { // from a tracing tool (e.g. Adobe Illustrator)
            fixDef.shape = this._svgToShape(fixDef.svgPoints);

            fixDef.svgPoints = null;
            this._body.CreateFixture(fixDef);
        } else if (fixDef.polyPoints) { // from Physics Editor
            this._createPolygonShapes(fixDef);
        } else {
            this._body.CreateFixture(fixDef);
        }

        var level = this._layer._scene;
        this._position = {
            x:bodyDef.position.x * level._physicsScale,
            y:bodyDef.position.y * level._physicsScale
        }

        this._calculateCentroidOffset();

        this._renderer.updateAll(this);

        this.getLevel()._addDynamicBody(this);
    },

    getLevel:function () {

        return this._layer._scene;
    },

    setLogic:function (logicFn) {

        this._logicFn = logicFn;
        if (logicFn) {
            this.getLevel()._addNodeWithLogic(this);
        } else {
            this.getLevel()._removeNodeWithLogic(this);
        }
    },

    getLogic:function () {

        return this._logicFn;
    },

    getPhysicalBody:function () {

        return this._body;
    },

    getPhysicalSize:function () {

        return this._physicalSize;
    },

    setPhysicalSize:function (physicalSize) {

        this._physicalSize = anima.clone(physicalSize);
    },

    applyImpulseVector:function (vector, point) {

        if (!point) {
            point = this._body.GetWorldCenter();
        }
        this._body.ApplyImpulse(vector, point);
    },

    applyForceVector:function (vector, point) {

        if (!point) {
            point = this._body.GetWorldCenter();
        }
        this._body.ApplyForce(vector, point);
    },

    applyImpulse:function (angle, power) {

        if (!power || power == 0.0) {
            return;
        }

        this._body.ApplyImpulse(
            new b2Vec2(Math.cos(angle) * power, Math.sin(angle) * power),
            this._body.GetWorldCenter());
    },

    setAngle:function (angle) {

        this._super(angle);

        this._body.SetAngle(-angle);
    },

    getAABB:function () {

        return this._body.GetFixtureList().GetAABB();
    },

    setAwakeListener:function (listenerFn) {

        this._awakeListenerFn = listenerFn;
    },

    /* internal methods */

    _checkAwake:function () {

        var awake = this._body.IsAwake();
        if (awake != this._wasAwake && this._awakeListenerFn) {
            this._awakeListenerFn(this, awake);
        }
        this._wasAwake = awake;

        return awake;
    },

    _createPolygonShapes:function (fixDef) {

        var level = this._layer._scene;

        var s, p, polygons, polygonShape;

        var polygonSets = fixDef.polyPoints;
        for (s = 0; s < polygonSets.length; s++) {
            polygons = polygonSets[s];
            for (p = 0; p < polygons.length; p++) {
                polygonShape = new b2PolygonShape();
                polygonShape.SetAsArray(polygons[p], polygons[p].length);
                fixDef.shape = polygonShape;

                this._body.CreateFixture(fixDef);
            }
        }
        fixDef.polyPoints = null;
    },

    _calculateShapeSize:function (shapePoints) {

        var MAX = 100000.0;

        var x, y;
        var minX = MAX, maxX = -MAX;
        var minY = MAX, maxY = -MAX;

        var count = shapePoints.length;
        for (var i = 0; i < count; i++) {
            x = shapePoints[i].x;
            if (x > maxX) {
                maxX = x;
            }
            if (x < minX) {
                minX = x;
            }

            y = shapePoints[i].y;
            if (y > maxY) {
                maxY = y;
            }
            if (y < minY) {
                minY = y;
            }
        }

        return {
            width:maxX - minX,
            height:maxY - minY
        }
    },

    _calculateShapeScale:function (shapePoints) {

        var level = this._layer._scene;

        var shapeSize = this._calculateShapeSize(shapePoints);

        var requiredShapeSize = {
            width:this._physicalSize.width * level._physicsScale,
            height:this._physicalSize.height * level._physicsScale
        };

        return shapeSize.width / requiredShapeSize.width;
    },

    _svgToShape:function (shapePoints) {

        var level = this._layer._scene;

        var shapeScale = this._calculateShapeScale(shapePoints);

        var x, y;
        var i;

        var tempShape = new b2PolygonShape;
        var vectors = [];
        var count = shapePoints.length;
        for (i = 0; i < count; i++) {
            x = shapePoints[i].x / shapeScale;
            y = shapePoints[i].y / shapeScale;
            vectors.push(new b2Vec2(x, y));
        }
        tempShape.SetAsArray(vectors, vectors.length);
        var centroid = tempShape.m_centroid;
        var vertices = tempShape.m_vertices;

        var shape = new b2PolygonShape;
        vectors = [];
        for (i = 0; i < count; i++) {
            x = (vertices[i].x - centroid.x) / level._physicsScale;
            y = (vertices[i].y - centroid.y) / level._physicsScale;
            vectors.push(new b2Vec2(x, y));
        }
        shape.SetAsArray(vectors, vectors.length);

        return shape;
    },

    _calculateCentroidOffset:function () {

        var aabb = this._body.GetFixtureList().GetAABB();
        var centroid = aabb.GetCenter();

        var center = this._body.GetWorldCenter();
        this._centroidOffset = {
            x:centroid.x - center.x,
            y:centroid.y - center.y
        }

        this._origin = {
            x:(center.x - aabb.lowerBound.x) / this._physicalSize.width,
            y:(center.y - aabb.lowerBound.y) / this._physicalSize.height
        }
    },

    _removeElement:function () {

        this.getLevel()._removeNodeWithLogic(this);
        this.getLevel()._removeDynamicBody(this);
        this._super();
    }
});anima.ext.ScoreDisplay = Class.extend({

    init:function (level, config) {

        this._spriteSheetUrl = config.spriteSheetUrl;
        this._spriteSheet = config.spriteSheet;

        this._digitWidth = config.digitWidth;
        this._digitHeight = config.digitHeight;
        this._digitGap = config.digitGap;
        this._digitCount = config.digitCount;

        if (config.digitAnimation) {
            this._digitAnimation = anima.clone(config.digitAnimation);
        } else {
            this._digitAnimation = {
                duration:300,
                frameCount:1
            }
        }

        if (!config.posX) {
            this._calculatePosition(level);
        } else {
            this._posX = config.posX;
            this._posY = config.posY;
        }

        this._createDisplay(level, config.layerId);

        this._currentScore = 0;
    },

    getLayer:function () {

        return this._layer;
    },

    setScore:function (score) {

        var scoreStr = score.toFixed();

        var i;

        var scoreDigitCount = scoreStr.length;
        if (scoreDigitCount < this._digitCount) {
            for (i = 0; i < this._digitCount - scoreDigitCount; i++) {
                scoreStr = ' ' + scoreStr;
            }
        }

        var frameCount = this._digitAnimation.frameCount;
        var duration = this._digitAnimation.duration;

        var digit, digitNode;
        for (i = 0; i < this._digitCount; i++) {
            digit = scoreStr.charAt(i);
            digitNode = this._digits[i];
            if (digit == ' ') {
                digitNode.setCurrentSprite(11 * frameCount);
            } else {
                var startFrame = parseInt(digit) * frameCount;
                if (frameCount == 1) {
                    digitNode.setCurrentSprite(startFrame);
                } else {
                    //var endFrame = startFrame + frameCount - 1;
                    //digitNode.animateSpriteSheet(startFrame + 1, endFrame, duration, function () {
                    digitNode.setCurrentSprite(startFrame);
                    //}, 'add-score-digits');
                }
            }
        }

        this._currentScore = score;
    },

    getScore:function () {

        return this._currentScore;
    },

    addScore:function (points) {

        var increment = 10;
        var steps = points / increment;
        var duration = 100 * steps;

        var animator = this._layer.getAnimator();
        animator.addAnimation({
            interpolateValuesFn:function (animator, t, data) {
                var newPoints = data.increment;
                if (data.pointsAdded + newPoints > data.pointsToAdd) {
                    newPoints = data.pointsToAdd - data.pointsAdded;
                }

                var display = data.display;
                display.setScore(display._currentScore + newPoints);

                data.pointsAdded += newPoints;
            },
            duration:duration,
            data:{
                pointsToAdd:points,
                pointsAdded:0,
                increment:increment,
                duration:duration,
                display:this
            }}, 'add-score');
    },

    /* internal methods */

    _calculatePosition:function (level) {

        var displaySize = (this._digitWidth + this._digitGap) * this._digitCount;
        var x = level.getSize().width - displaySize - this._digitWidth;
        this._posX = x;
        this._posY = 0;
    },

    _createDisplay:function (level, layerId) {

        this._layer = new anima.Layer(layerId);
        level.addLayer(this._layer);

        this._digits = [];

        var id;
        var x = this._posX;
        var y = this._posY;
        for (var i = 0; i < this._digitCount; i++) {
            id = 'score_digit_' + i;
            this._digits.push(this._createDigit(this._layer, id, x, y));
            x += this._digitWidth + this._digitGap;
        }
    },

    _createDigit:function (layer, id, posX, posY) {

        var level = layer.getScene();

        var node = new anima.Node('score_' + id);
        layer.addNode(node);

        node.setSize(this._digitWidth, this._digitHeight);
        node.addBackground(null, this._spriteSheetUrl, this._spriteSheet);
        node.setPosition({
            x:posX,
            y:posY
        });
        node.setOrigin({
            x:0.0,
            y:0.0
        });

        return node;
    }
});anima.ext.SlideShow = Class.extend({

    init:function (config) {

        this._nodes = config.nodes;
        this._animator = this._nodes[0].getAnimator();

        this._changeDelay = config.changeDelay || 3000;
        this._fadeDuration = config.fadeDuration || 2000;
        this._runOnce = config.runOnce || false;

        this._running = false;
        this._fadeInId = null;
    },

    start:function () {

        this._currentNodeIndex = -1;
        this._running = true;

        var me = this;
        this._animator.addTask(function () {
            me._nextNode();
        });
    },

    stop:function () {

        if (!this._running) {
            return;
        }

        this._running = false;
        if (this._fadeInId) {
            this._animator.endAnimation(this._fadeInId);
        }

        var lastNode = this._nodes[this._currentNodeIndex];
        lastNode.fadeOut(this._fadeDuration / 2);
    },

    /* internal methods */

    _nextNode:function () {

        var lastNode = this._currentNodeIndex >= 0 ? this._nodes[this._currentNodeIndex] : null;
        if (!this._running) {
            if (lastNode) {
                lastNode.fadeOut(this._fadeDuration / 2);
            }
            return;
        }

        var totalNodes = this._nodes.length;

        var done = false;
        this._currentNodeIndex++
        if (this._currentNodeIndex >= totalNodes) {
            if (this._runOnce) {
                done = true;
                this._currentNodeIndex--;
            } else {
                this._currentNodeIndex = 0;
            }
        }
        var newNode = this._nodes[this._currentNodeIndex];

        var me = this;
        if (totalNodes > 1 && !done) {
            if (lastNode) {
                lastNode.fadeOut(this._fadeDuration);
            }

            this._fadeInId = newNode.fadeIn(this._fadeDuration / 2, function () {
                me._fadeInId = null;
                if (me._running) {
                    me._animator.addTask(function () {
                        me._nextNode();
                    }, me._changeDelay);
                }
            });
        } else if (newNode != lastNode) {
            newNode.fadeIn(1000);
        }
    }
});