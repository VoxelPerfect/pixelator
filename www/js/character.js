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

    var level = layer.getScene();
    var levelHeight = level.getPhysicalSize().height;

    var characterPosX = 0.38 * WORLD_SCALE;
    var characterPosY = levelHeight - 0.30 * WORLD_SCALE;

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

    var fixDef = new b2FixtureDef;
    fixDef.density = CHARACTER_DENSITY;
    fixDef.friction = 0.5;
    fixDef.restitution = 0.2;
    fixDef.shapeFile = 'resources/shapes/character.plist';
    fixDef.filter.categoryBits = CATEGORY_USER;
    fixDef.filter.maskBits = CATEGORY_BOX | CATEGORY_USER_PLATFORM | CATEGORY_ENEMY;

    body.define(bodyDef, fixDef);

    body.setAwakeListener(function (body, awake) {

        if (!awake) {
            var physicalBody = body.getPhysicalBody();
            body.getAnimator().addTask(function () {
                if (body.get('inAction')
                    && !physicalBody.IsAwake()) {

                    resetCharacter(body, characterPosX, characterPosY);
                    resetArrow(level);
                }
            }, 2000);
        }
    });

    body.setLogic(function (body) {

        var physicalBody = body.getPhysicalBody();
        if (physicalBody.IsAwake()) {
            var center = physicalBody.GetPosition();
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
