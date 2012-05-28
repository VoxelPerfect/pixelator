pixelator.LevelSet_1 = anima.Scene.extend({

    init:function (canvas) {

        this._super('levelset_1');
        canvas.addScene(this);

        this._canvas = canvas;
        this.set('levelSet', 'levelset_1');

        this.addBackground('black', getImageUrl(this, 'levelset_background', 'jpg'));

        this._createLevels();
    },

    load:function () {

        this._super();

        var layer = new anima.Layer('level_buttons');
        this.addLayer(layer);

        this._createLevelButton(layer, 'level_1', 100, 100);
        this._createLevelButton(layer, 'level_2', 400, 200);
        this._createLevelButton(layer, 'level_3', 800, 300);
    },

    /* internal methods */

    _createLevels:function () {

        new pixelator.Level_1(this._canvas);
    },

    _createLevelButton:function (layer, levelId, x, y) {

        var button = new anima.Node('button_' + levelId);
        layer.addNode(button);
        button.setSize(361, 384);
        button.addBackground(null, getImageUrl(this, levelId));
        button.setPosition({
            x:x,
            y:y
        });
        button.setOrigin({
            x:0,
            y:0
        });

        var me = this;
        button.on('vclick', function () {
            me._openLevel(levelId);
        });

        button.css({
            'cursor':'pointer'
        })
    },

    _openLevel:function (id) {

        var canvasSize = this._canvas.getSize();
        var x0 = 0.20 * canvasSize.width;
        var y0 = 0.44 * canvasSize.height;
        var level = this._canvas.getScene(id);
        if (level) {
            level.setViewport({
                x1:x0,
                y1:y0,
                x2:x0 + 300,
                y2:y0 + 300
            });
            this._canvas.setCurrentScene('level_1', 500, function () {
                level.onLoaded();
                level.setViewport(null, 2000);
            });
        }
    }
});

$('#mainPage').live('pageshow', function (event, ui) {

    var canvas = new anima.Canvas('main-canvas', DEBUG);
    canvas.setSize(1575, 787);

    new pixelator.LevelSet_1(canvas);

    $('.ui-loader').css({
        'opacity':0.4,
        'overflow':'hidden',
        'top':'70%'
    });

    anima.start(function () {
        canvas.setCurrentScene('levelset_1', 500);
    });
});
