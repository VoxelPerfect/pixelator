function createObstacleBox(layer, id, type, posX, posY) {

    var level = layer.getScene();

    var body = new anima.Body('box-' + type + '-' + id);
    layer.addNode(body);

    body.setSize(68, 60);
    body.addBackground(null, getImageUrl(level, 'box_' + type));
    var physicalSize = body.getPhysicalSize();

    var bodyDef = new b2BodyDef;
    bodyDef.type = b2Body.b2_dynamicBody;
    bodyDef.allowSleep = true;
    bodyDef.position.x = posX;
    bodyDef.position.y = posY;

    var fixDef = new b2FixtureDef;
    fixDef.shape = new b2PolygonShape;
    fixDef.density = CHARACTER_DENSITY;
    fixDef.friction = 0.5;
    fixDef.restitution = 0.2;
    fixDef.shape.SetAsBox(physicalSize.width / 2, physicalSize.height / 2);

    body.define(bodyDef, fixDef);
}

function createObstaclePlatform(layer) {

    var level = layer.getScene();
    var levelHeight = level.getPhysicalSize().height;

    var posX = 0.9 * WORLD_SCALE;
    var posY = levelHeight - 0.03 * WORLD_SCALE;

    var body = new anima.Body('box-platform');
    layer.addNode(body);

    body.setSize(350, 22);
    body.addBackground('red');
    var physicalSize = body.getPhysicalSize();

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

    return body;
}

function createObstacles(layer) {

    var columns = 2;

    var platform = createObstaclePlatform(layer);
    var y0 = platform.getPosition().y - platform.getSize().height / 2 - 5;
    var x0 = platform.getPosition().x - platform.getSize().width / 2 + 70;

    var height = layer.getScene().getSize().height;

    var ps = platform.getLevel().getPhysicsScale();

    var id, type, posX, posY;
    for (i = 0; i < columns; i++) {
        posX = x0 + (i * (68 + 50));
        for (j = 0; j < 10; j++) {
            id = i + '-' + j;
            type = (j % 2) ? 'white' : 'bomb';
            posY = y0 - j * 60;

            createObstacleBox(layer, id, type, posX / ps, posY / ps);
        }
    }
}
