function setCharacterPointsSvg(fixDef) {

    fixDef.svgPoints = [
        {x:190, y:268.68},
        {x:74, y:291.68},
        {x:60, y:155.68},
        {x:99, y:107.68},
        {x:145, y:102.68},
        {x:182, y:142.68}
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

    body.setSize(150, 190);
    body.addBackground(null, getImageUrl(level, 'character_start'), {
        row:6,
        columns:6,
        totalSprites:31,
        duration:1000
    }, 'start');
    body.addBackground(null, getImageUrl(level, 'character_idle'), {
        row:8,
        columns:8,
        totalSprites:61,
        duration:1000
    }, 'idle');
    body.addBackground(null, getImageUrl(level, 'character_attack'), {
        row:8,
        columns:8,
        totalSprites:61,
        duration:1000
    }, 'attack');

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

    var duration = character.getSpriteSheetDuration();
    character.set('animationType', type);
    character.setActiveBackground(type);

    animationId = character.animateSpriteSheet(null, null, duration, function () {
        character.set('inRestAnimation', false);
        character.set('animationId', null);
    });
    character.set('animationId', animationId);
}
