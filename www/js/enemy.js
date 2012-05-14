function createEnemyPouf(layer, id, enemyX, enemyY) {

    var level = layer.getScene();

    var poufX = enemyX * level.getPhysicsScale();
    var poufY = enemyY * level.getPhysicsScale();

    var node = new anima.Node('pouf_' + id);
    layer.addNode(node);

    var poufidth = 100;
    var poufHeight = 100;
    node.setSize(poufidth, poufHeight);
    node.addBackground(null, getImageUrl(layer.getScene(), 'pouf'), {
        rows:3,
        columns:5,
        totalSprites:14
    });
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

    body.setSize(120, 120);
    body.addBackground(null, getImageUrl(level, 'enemy'), {
        row:7,
        columns:8,
        totalSprites:50
    });
    var physicalSize = body.getPhysicalSize();
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

    createEnemyPouf(layer, id, posX - 0.5 * physicalSize.width, posY - 0.2 * physicalSize.height);

    /*
     var boomSound = new anima.Sound(id + 'boom', 'resources/sounds/boom.mp3');
     body.set('boom', boomSound);
     var laughSound = new anima.Sound(id + '_laugh', 'resources/sounds/laugh.mp3');
     body.set('laugh', laughSound);
     */
}