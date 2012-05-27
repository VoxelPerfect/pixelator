function createLevel0() {

    var level = new anima.Level('level0', 2.0 * WORLD_SCALE, new b2Vec2(0, GRAVITY)); // 2m wide, gravity = 9.81 m/sec2
    canvas.addScene(level);
    level.addBackground('black', getImageUrl(level, 'background', 'jpg'));

    var layer;

    layer = new anima.Layer('environment');
    level.addLayer(layer);
    createPlatform(layer);
    createObstacles(layer);

    layer = new anima.Layer('characters');
    level.addLayer(layer);
    createCharacter(layer);
    createEnemy(layer, 'enemy-1', 1.5 * WORLD_SCALE, 0.5 * WORLD_SCALE, 0);
    createEnemy(layer, 'enemy-2', 1.8 * WORLD_SCALE, 0.6 * WORLD_SCALE, 1200);
    createEnemy(layer, 'enemy-3', 1.4 * WORLD_SCALE, 0.8 * WORLD_SCALE, 600);

    layer = new anima.Layer('gizmos');
    level.addLayer(layer);
    createArrow(layer);
    createDebugBox(layer);

    var scoreDisplay = new anima.ext.ScoreDisplay(level, {
        layerId:'score',
        spriteSheetUrl:getImageUrl(level, 'numbers'),
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
    level.getLayer('score').set('scoreDisplay', scoreDisplay);
}

$('#mainPage').live('pageshow', function (event, ui) {

    canvas = new anima.Canvas('main-canvas', DEBUG);
    canvas.setSize(1575, 787);

    createLevel0();

    $('.ui-loader').css({
        'opacity':0.4,
        'overflow':'hidden',
        'top':'70%'
    });

    anima.start(function () {
        var canvasSize = canvas.getSize();
        var x0 = 0.20 * canvasSize.width;
        var y0 = 0.44 * canvasSize.height;
        var level = canvas.getScene('level0');
        level.setViewport({
            x1:x0,
            y1:y0,
            x2:x0 + 300,
            y2:y0 + 300
        });
        canvas.setCurrentScene('level0', 500, function () {
            level.setViewport(null, 2000);
        });
    });
});
