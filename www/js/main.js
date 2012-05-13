var canvas = null;

// http://localhost/hobistic/anima/www/index.html?scale=18.0&density=2&impulse=300&gravity=9.81&damp=0.4&debug=true
var DEBUG = anima.getRequestParameter('debug');
var WORLD_SCALE = parseFloat(anima.getRequestParameter('scale', '18.0'));
var CHARACTER_DENSITY = parseFloat(anima.getRequestParameter('density', '1.0'));
var CHARACTER_IMPULSE = parseFloat(anima.getRequestParameter('impulse', '600.0'));
var GRAVITY = parseFloat(anima.getRequestParameter('gravity', '9.81'));
var LINEAR_DAMPING = parseFloat(anima.getRequestParameter('damp', '0.1'));

function getImageUrl(level, imageName, extension) {

    if (!extension) {
        extension = 'png';
    }
    return 'resources/images/' + level.getId() + '/' + imageName + '.' + extension;
}

function debug(layer, message) {

    var node = layer.getScene().getLayer('gizmos').getNode('debugBox');
    node.getElement().html(message);
}

function createDebugBox(layer) {

    var node = new anima.Node('debugBox');
    layer.addNode(node);

    node.setBackground(null, null, layer.getScene().getSize().width, 30);
    node.setPosition({
        x:0,
        y:0.1
    });

    node.setFont({
        'size':'30px',
        'weight':'bold',
        'color':'white'
    });

    node.getElement().css({
        opacity:0.5
    })
}

function createPlatform(layer) {

    var level = layer.getScene();
    var levelHeight = level.getPhysicalSize().height;

    var posX = 0.39 * WORLD_SCALE;
    var posY = levelHeight - 0.09 * WORLD_SCALE;

    var body = new anima.Body('platform');
    layer.addNode(body);

    body.setBackground(null, null, 197, 22);
    var physicalSize = body.getPhysicalSize();
    body._physicalSize.height /= 2;

    var bodyDef = new b2BodyDef;
    bodyDef.type = b2Body.b2_staticBody;
    bodyDef.position.x = posX
    bodyDef.position.y = posY;

    var fixDef = new b2FixtureDef;
    fixDef.shape = new b2PolygonShape;
    fixDef.friction = 0.5;
    fixDef.restitution = 0.2;
    fixDef.shape.SetAsBox(physicalSize.width / 2, physicalSize.height / 2);

    body.define(bodyDef, fixDef);

    var physicalBody = body.getPhysicalBody();
    physicalBody.SetAngle(anima.toRadians(-10));
}

function setCharacterPointsSvg(fixDef) {

    fixDef.svgPoints = [
        {x:190, y:268.68},
        {x:74, y:291.68},
        {x:60, y:155.68},
        {x:99, y:107.68},
        {x:145, y:102.68},
        {x:182, y:142.68},
    ];
}

function setCharacterPointsPolys(level, fixDef) {

    var ptm_ratio = level._physicsScale;
    fixDef.polyPoints = [
        [
            [   new b2Vec2(99 / ptm_ratio, 46 / ptm_ratio)  , new b2Vec2(96 / ptm_ratio, 74 / ptm_ratio)  , new b2Vec2(14 / ptm_ratio, 50 / ptm_ratio)  , new b2Vec2(30 / ptm_ratio, 23 / ptm_ratio)  , new b2Vec2(70 / ptm_ratio, 7 / ptm_ratio)  ] ,
            [   new b2Vec2(142 / ptm_ratio, 136 / ptm_ratio)  , new b2Vec2(101 / ptm_ratio, 125 / ptm_ratio)  , new b2Vec2(40 / ptm_ratio, 95 / ptm_ratio)  , new b2Vec2(112 / ptm_ratio, 102 / ptm_ratio)  , new b2Vec2(133 / ptm_ratio, 106 / ptm_ratio)  ] ,
            [   new b2Vec2(101 / ptm_ratio, 125 / ptm_ratio)  , new b2Vec2(142 / ptm_ratio, 136 / ptm_ratio)  , new b2Vec2(137 / ptm_ratio, 143 / ptm_ratio)  , new b2Vec2(117 / ptm_ratio, 147 / ptm_ratio)  , new b2Vec2(100 / ptm_ratio, 137 / ptm_ratio)  ] ,
            [   new b2Vec2(40 / ptm_ratio, 95 / ptm_ratio)  , new b2Vec2(101 / ptm_ratio, 125 / ptm_ratio)  , new b2Vec2(89 / ptm_ratio, 138 / ptm_ratio)  , new b2Vec2(40 / ptm_ratio, 141 / ptm_ratio)  , new b2Vec2(31 / ptm_ratio, 132 / ptm_ratio)  , new b2Vec2(29 / ptm_ratio, 110 / ptm_ratio)  ] ,
            [   new b2Vec2(112 / ptm_ratio, 102 / ptm_ratio)  , new b2Vec2(40 / ptm_ratio, 95 / ptm_ratio)  , new b2Vec2(23 / ptm_ratio, 83 / ptm_ratio)  , new b2Vec2(14 / ptm_ratio, 63 / ptm_ratio)  , new b2Vec2(14 / ptm_ratio, 50 / ptm_ratio)  , new b2Vec2(96 / ptm_ratio, 74 / ptm_ratio)  , new b2Vec2(111 / ptm_ratio, 89 / ptm_ratio)  ]
        ],
        [
            [   new b2Vec2(99 / ptm_ratio, 46 / ptm_ratio)  , new b2Vec2(96 / ptm_ratio, 74 / ptm_ratio)  , new b2Vec2(14 / ptm_ratio, 50 / ptm_ratio)  , new b2Vec2(30 / ptm_ratio, 23 / ptm_ratio)  , new b2Vec2(70 / ptm_ratio, 7 / ptm_ratio)  ] ,
            [   new b2Vec2(142 / ptm_ratio, 136 / ptm_ratio)  , new b2Vec2(101 / ptm_ratio, 125 / ptm_ratio)  , new b2Vec2(40 / ptm_ratio, 95 / ptm_ratio)  , new b2Vec2(112 / ptm_ratio, 102 / ptm_ratio)  , new b2Vec2(133 / ptm_ratio, 106 / ptm_ratio)  ] ,
            [   new b2Vec2(101 / ptm_ratio, 125 / ptm_ratio)  , new b2Vec2(142 / ptm_ratio, 136 / ptm_ratio)  , new b2Vec2(137 / ptm_ratio, 143 / ptm_ratio)  , new b2Vec2(117 / ptm_ratio, 147 / ptm_ratio)  , new b2Vec2(100 / ptm_ratio, 137 / ptm_ratio)  ] ,
            [   new b2Vec2(40 / ptm_ratio, 95 / ptm_ratio)  , new b2Vec2(101 / ptm_ratio, 125 / ptm_ratio)  , new b2Vec2(89 / ptm_ratio, 138 / ptm_ratio)  , new b2Vec2(40 / ptm_ratio, 141 / ptm_ratio)  , new b2Vec2(31 / ptm_ratio, 132 / ptm_ratio)  , new b2Vec2(29 / ptm_ratio, 110 / ptm_ratio)  ] ,
            [   new b2Vec2(112 / ptm_ratio, 102 / ptm_ratio)  , new b2Vec2(40 / ptm_ratio, 95 / ptm_ratio)  , new b2Vec2(23 / ptm_ratio, 83 / ptm_ratio)  , new b2Vec2(14 / ptm_ratio, 63 / ptm_ratio)  , new b2Vec2(14 / ptm_ratio, 50 / ptm_ratio)  , new b2Vec2(96 / ptm_ratio, 74 / ptm_ratio)  , new b2Vec2(111 / ptm_ratio, 89 / ptm_ratio)  ]
        ]
    ];
}

function resetCharacter(character, characterPosX, characterPosY) {

    if (character.get('inAction')) {
        character.set('inAction', false);

        var physicalBody = character.getPhysicalBody();
        physicalBody.SetPositionAndAngle(new b2Vec2(characterPosX, characterPosY), 0);
        physicalBody.SetLinearVelocity(new b2Vec2(0, 0));
        physicalBody.SetAngularVelocity(0);

        physicalBody.SetAwake(true);

        animateCharacter(character, 'start');
    }
}

function createCharacter(layer) {

    var characterPosX = 0.38 * WORLD_SCALE;
    var characterPosY = 0.7 * WORLD_SCALE; //0.6;

    var level = layer.getScene();

    var body = new anima.Body('character');
    layer.addNode(body);

    body.setBackground(null, getImageUrl(level, 'character_start'), 150, 190);

    var bodyDef = new b2BodyDef;
    bodyDef.type = b2Body.b2_dynamicBody;
    bodyDef.allowSleep = true;
    bodyDef.linearDamping = LINEAR_DAMPING;
    bodyDef.position.x = characterPosX;
    bodyDef.position.y = characterPosY;
    //bodyDef.fixedRotation = false;

    var fixDef = new b2FixtureDef;
    fixDef.density = CHARACTER_DENSITY;
    fixDef.friction = 0.5;
    fixDef.restitution = 0.2;
    //setCharacterPointsPolys(level, fixDef);
    setCharacterPointsSvg(fixDef);
    body.define(bodyDef, fixDef);

    var physicalBody = body.getPhysicalBody();

    body.setAwakeListener(function (body, awake) {

        if (!awake) {
            var center = physicalBody.GetWorldCenter();
            body.getAnimator().addTask(function () {
                if (body.get('inAction')
                    && !body.getPhysicalBody().IsAwake()) {

                    resetCharacter(body, characterPosX, characterPosY);
                    resetArrow(level);
                }
            }, 2000);
        }
    });

    body.setLogic(function (body) {

        if (physicalBody.IsAwake()) {
            var center = physicalBody.GetWorldCenter();
            if (center.y < (0 - body.getPhysicalSize().height * 2)
                || center.y > level.getPhysicalSize().height
                || center.x < 0) {

                resetCharacter(body, characterPosX, characterPosY);
                resetArrow(level);
            }
        }
    });

    /*
     var gaziaSound = new anima.Sound('gazia', 'resources/sounds/gazia.mp3');
     body.set('gazia', gaziaSound);
     var papakiaSound = new anima.Sound('sta_papakia', 'resources/sounds/sta_papakia_mas_re.mp3');
     body.set('sta_papakia', papakiaSound);
     */
}

function animateCharacter(character, type) {

    var level = character.getLevel();
    var animator = character.getAnimator();

    var animationId = character.get('animationId');
    var animationType = character.get('animationType');
    if (animationId && animationType == type) {
        return;
    }

    if (animationId) {
        animator.endAnimation(animationId);
    }

    var duration;
    if (type == 'start') {
        character.setBackground(null, getImageUrl(level, 'character_start'), 150, 190);
        character.setSpriteGrid({
            row:6,
            columns:6,
            totalSprites:31
        });
        duration = 2000;
    } else if (type = 'idle') {
        character.setBackground(null, getImageUrl(level, 'character_idle'), 150, 190);
        character.setSpriteGrid({
            row:8,
            columns:8,
            totalSprites:61
        });
        duration = 2000;
    } else if (type == 'attack') {
        character.setBackground(null, getImageUrl(level, 'character_attack'), 150, 190);
        character.setSpriteGrid({
            row:8,
            columns:8,
            totalSprites:61
        });
        duration = 2000;
    } else {
        return;
    }
    character.set('animationType', type);

    animationId = animator.addAnimation({
        interpolateValuesFn:function (animator, t) {
            var characterSprites = character.getTotalSprites();
            var index = t * (characterSprites - 1) / duration;
            character.setCurrentSprite(index);
        },
        duration:duration,
        onAnimationEndedFn:function () {
            character.set('inRestAnimation', false);
            character.set('animationId', null);
        }});
    character.set('animationId', animationId);
}

function createArrow(layer) {

    var level = layer.getScene();
    var character = level.getLayer('characters').getNode('character');

    var arrowX = 200;
    var arrowY = 350;

    var node = new anima.Node('arrow');
    layer.addNode(node);

    var arrowWidth = 160;
    var arrowHeight = 77;
    node.setBackground(null, getImageUrl(layer.getScene(), 'arrow'), arrowWidth, arrowHeight);
    var spriteGrid = {
        rows:5,
        columns:6,
        totalSprites:29
    };
    node.setSpriteGrid(spriteGrid);
    node.setPosition({
        x:arrowX,
        y:arrowY
    });
    node.setOrigin({
        x:0.5,
        y:0.5
    });
    node.setAngle(anima.toRadians(40));

    var arrow = node;
    var totalSprites = spriteGrid.totalSprites;
    node.getCanvas().on('vdrag', function (event, vtype) {

        if (vtype == 'dragstart') {
            var pos = arrow.canvasPosition(event);
            arrow.set('dragStart', pos);
        } else if (vtype == 'dragmove') {
            var dragStart = arrow.get('dragStart');
            if (dragStart) {
                var pos = arrow.canvasPosition(event);

                var dx = pos.x - dragStart.x;
                var dy = pos.y - dragStart.y;
                var theta = Math.atan2(dx, dy);
                node.setAngle(theta - Math.PI / 2);

                var power = Math.max(0.0, Math.min(1.0, (Math.sqrt(dx * dx + dy * dy) - arrowWidth / 2) / arrowWidth));
                arrow.setCurrentSprite(power * (totalSprites - 1));
                arrow.set('power', power * CHARACTER_IMPULSE);

                if (DEBUG) {
                    debug(layer, ''
                        + ' | scale:' + WORLD_SCALE.toFixed(1)
                        + ' | density:' + CHARACTER_DENSITY.toFixed(1)
                        + ' | angle:' + anima.round(anima.toDegrees(theta - Math.PI / 2))
                        + ' | impulse: ' + (power * CHARACTER_IMPULSE).toFixed(2) + ' (' + power.toFixed(2) + ')'
                        + ' | gravity:' + GRAVITY.toFixed(2)
                        + ' | damping:' + LINEAR_DAMPING.toFixed(2)
                        + ' |');
                }
            }
        } else if (vtype == 'dragend') {
            if (arrow.get('dragStart') && !character.getPhysicalBody().IsAwake()) {
                arrow.set('dragStart', null);

                var power = arrow.get('power');
                if (power && power != 0.0) {
                    arrow.fadeOut();

                    var animator = character.getAnimator();
                    animateCharacter(character, 'attack');
                    animator.addTask(function (loopTime) {
                        //character.get('sta_papakia').play();
                        character.applyImpulse(arrow.getAngle(), power);
                        character.set('inAction', true);
                    });
                }
            }
        }
    });
}

function resetArrow(level) {

    var arrow = level.getLayer('gizmos').getNode('arrow');

    arrow.setAngle(anima.toRadians(40));
    var power = 0.0;
    arrow.set('power', power * CHARACTER_IMPULSE);
    arrow.setCurrentSprite(power * arrow.getTotalSprites());
    arrow.fadeIn();
}

function createEnemyPouf(layer, id, enemyX, enemyY) {

    var level = layer.getScene();

    var poufX = enemyX * level.getPhysicsScale();
    var poufY = enemyY * level.getPhysicsScale();

    var node = new anima.Node('pouf_' + id);
    layer.addNode(node);

    var poufidth = 100;
    var poufHeight = 100;
    node.setBackground(null, getImageUrl(layer.getScene(), 'pouf'), poufidth, poufHeight);
    var spriteGrid = {
        rows:3,
        columns:5,
        totalSprites:14
    };
    node.setSpriteGrid(spriteGrid);
    node.setPosition({
        x:poufX,
        y:poufY
    });
    node.setOrigin({
        x:0.5,
        y:0.5
    });

    node.hide();
}

function createEnemy(layer, id, posX, posY, animationOffset) {

    var level = layer.getScene();
    var levelHeight = level.getPhysicalSize().height;

    var body = new anima.Body(id);
    layer.addNode(body);

    body.setBackground(null, getImageUrl(level, 'enemy'), 120, 120);
    var physicalSize = body.getPhysicalSize();
    body.setSpriteGrid({
        row:7,
        columns:8,
        totalSprites:50
    });
    var physicalSize = body.getPhysicalSize();

    var bodyDef = new b2BodyDef;
    bodyDef.type = b2Body.b2_staticBody;
    bodyDef.allowSleep = true;
    bodyDef.position.x = posX;
    bodyDef.position.y = posY;
    bodyDef.fixedRotation = false;

    var fixDef = new b2FixtureDef;
    fixDef.density = CHARACTER_DENSITY;
    fixDef.friction = 0.5;
    fixDef.restitution = 0.2;
    fixDef.svgPoints = [
        {x:68, y:206.68},
        {x:68, y:150.68},
        {x:134, y:166.68},
        {x:182, y:216.68},
        {x:165, y:251.68},
        {x:117, y:243.68}
    ];
    body.define(bodyDef, fixDef);

    var animator = body.getAnimator();
    var moveId = animator.addAnimation({
        interpolateValuesFn:function (animator, t) {
            //if (t == 0) {
            //    body.get('laugh').play();
            //}
            var characterSprites = body.getTotalSprites();
            var index = t * (characterSprites - 1) / 2000;
            body.setCurrentSprite(index);
        },
        delay:animationOffset,
        duration:2000,
        loop:true});
    body.set('moveId', moveId);

    createEnemyPouf(layer, id, posX - 1.5 * physicalSize.width, posY - 0.2 * physicalSize.height);

    /*
     var boomSound = new anima.Sound(id + 'boom', 'resources/sounds/boom.mp3');
     body.set('boom', boomSound);
     var laughSound = new anima.Sound(id + '_laugh', 'resources/sounds/laugh.mp3');
     body.set('laugh', laughSound);
     */
}

function createLevel0() {

    var level = new anima.Level('level0', 2.0 * WORLD_SCALE, new b2Vec2(0, GRAVITY)); // 2m wide, gravity = 9.81 m/sec2
    canvas.addScene(level);
    level.setBackground('black', getImageUrl(level, 'background', 'jpg'));

    var layer;

    layer = new anima.Layer('environment');
    level.addLayer(layer);
    createPlatform(layer);

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

    level.setContactListener(function (bodyA, bodyB) {

        var idA = bodyA.getId();
        var idB = bodyB.getId();

        if (idA == 'character' && idB == 'platform') {
            if (!bodyA.get('inRestAnimation')) {
                bodyA.set('inRestAnimation', true);
                animateCharacter(bodyA, 'start');
                //bodyA.get('gazia').play();
            }
            return;
        }

        if (idA == 'character' && (idB == 'sock' || idB == 'tie' || idB == 'slip')) {
            if (!bodyB.get('hit')) {
                bodyB.set('hit', true);
                //bodyB.get('boom').play();
                bodyB.fadeOut(400, function () {
                    bodyB.hide();
                    var physicalBody = bodyB.getPhysicalBody();
                    physicalBody.SetActive(false);
                    level.getWorld().DestroyBody(physicalBody);

                    level.getLayer('score').get('scoreDisplay').addScore(100);
                });
            }
        }

        if (idA == 'character' && idB.startsWith('enemy')) {
            var animator = bodyB.getAnimator();
            if (bodyB.get('hits')) {
                if (bodyB.get('hits') == 1) {
                    bodyB.set('hits', 2);

                    //bodyB.get('boom').play();

                    var pouf = bodyB.getLayer().getNode('pouf_' + bodyB.getId());
                    pouf.show();
                    animator.endAnimation(bodyB.get('pulseId'));
                    animator.endAnimation(bodyB.get('moveId'));
                    bodyB.fadeOut(1000);

                    animator.addAnimation({
                        interpolateValuesFn:function (animator, t) {
                            var characterSprites = pouf.getTotalSprites();
                            var index = t * (characterSprites - 1) / 1000;
                            pouf.setCurrentSprite(index);
                        },
                        duration:1000,
                        onAnimationEndedFn:function (animation) {
                            pouf.hide();
                            var physicalBody = bodyB.getPhysicalBody();
                            physicalBody.SetActive(false);
                            level.getWorld().DestroyBody(physicalBody);
                        }});

                    level.getLayer('score').get('scoreDisplay').addScore(350);
                }
            } else {
                bodyB.set('hits', 1);

                //bodyB.get('boom').play();

                var pulseAnimationId = animator.addAnimation({
                    interpolateValuesFn:function (animator, t) {
                        var value = animator.interpolate(0.0, 1.0, t);
                        var opacity = (value < 0.5) ? 1.0 - 2 * value : 2 * value - 1;
                        bodyB.getElement().css('opacity', opacity);
                    },
                    duration:1000,
                    easing:anima.Easing.easeInOutSine,
                    loop:true});
                bodyB.set('pulseId', pulseAnimationId);
            }
        }
    });

    var scoreDisplay = new anima.ext.ScoreDisplay(level, {
        layerId:'score',
        spriteSheet:getImageUrl(level, 'numbers'),
        spriteGrid:{
            rows:3,
            columns:4,
            totalSprites:12
        },
        digitWidth:32,
        digitHeight:66,
        digitGap:0,
        digitCount:5
    });
    scoreDisplay.setScore(0);
    level.getLayer('score').set('scoreDisplay', scoreDisplay);
}

$('#mainPage').live('pageshow', function (event, ui) {

    canvas = new anima.Canvas('main-canvas', DEBUG);
    canvas.setBackground(null, null, 1575, 787);

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
