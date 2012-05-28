pixelator.Level_1 = anima.Level.extend({

    init:function (canvas) {

        this._super('level_1', 2.0 * WORLD_SCALE, new b2Vec2(0, GRAVITY)); // 2m wide, gravity = 9.81 m/sec2

        this.set('levelSet', 'levelset_1');

        canvas.addScene(this);
        this.addBackground('black', getImageUrl(this, 'background', 'jpg'));
    },

    load:function () {

        this._super();

        var layer;

        layer = new anima.Layer('environment');
        this.addLayer(layer);
        createPlatform(layer);
        createObstacles(layer);

        layer = new anima.Layer('characters');
        this.addLayer(layer);

        var characterPosX = 0.38 * WORLD_SCALE;
        var characterPosY = this.getPhysicalSize().height - 0.21 * WORLD_SCALE;
        var character = new pixelator.Character(layer, characterPosX, characterPosY);

        createEnemy(layer, 'enemy-1', 1.5 * WORLD_SCALE, 0.5 * WORLD_SCALE, 0);
        createEnemy(layer, 'enemy-2', 1.8 * WORLD_SCALE, 0.6 * WORLD_SCALE, 1200);
        createEnemy(layer, 'enemy-3', 1.4 * WORLD_SCALE, 0.8 * WORLD_SCALE, 600);

        layer = new anima.Layer('gizmos');
        this.addLayer(layer);
        createArrow(layer);
        createDebugBox(layer);
        this._createPauseButton(layer);

        var scoreDisplay = new anima.ext.ScoreDisplay(this, {
            layerId:'score',
            spriteSheetUrl:getImageUrl(this, 'numbers'),
            spriteSheet:{
                rows:8,
                columns:9,
                totalSprites:68
            },
            posX:1310,
            posY:10,
            digitWidth:46,
            digitHeight:61,
            digitGap:0,
            digitCount:5,
            digitAnimation:{
                duration:300,
                frameCount:6
            }
        });
        scoreDisplay.setScore(0);
        this.getLayer('score').set('scoreDisplay', scoreDisplay);
    },

    onLoaded:function () {

        this.getNode('character').setActiveBackground('start');

        this.getNode('enemy-1').setActiveBackground('normal');
        this.getNode('enemy-2').setActiveBackground('normal');
        this.getNode('enemy-3').setActiveBackground('normal');
    },

    /* internal methods */

    _createPauseButton:function (layer) {

        var button = new anima.Node('button_pause');
        layer.addNode(button);
        button.setSize(89, 77);
        button.addBackground(null, getImageUrl(this, 'pause'));
        button.setPosition({
            x:10,
            y:10
        });
        button.setOrigin({
            x:0,
            y:0
        });

        var me = this;
        button.on('vclick', function () {
            me.getCanvas().setCurrentScene(me.get('levelSet'));
        });

        button.css({
            'cursor':'pointer'
        })
    }
});
