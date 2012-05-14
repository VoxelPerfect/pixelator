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
    fixDef.density = 8.0;
    fixDef.friction = 2;
    fixDef.restitution = 0.2;
    fixDef.shape.SetAsBox(physicalSize.width / 2, physicalSize.height / 2);

    body.define(bodyDef, fixDef);

    body.setAwakeListener(function (body, awake) {

        if (!awake && body.get('hit')) {
            body.fadeOut(400, function () {
                body.getPhysicalBody().SetActive(false);
            });
        }
    });

    body.setLogic(function (body) {

        var physicalBody = body.getPhysicalBody();
        if (physicalBody.IsAwake()) {
            var center = physicalBody.GetWorldCenter();
            if (center.y < (0 - body.getPhysicalSize().height * 2)
                || center.y > level.getPhysicalSize().height
                || center.x < 0) {

                body.hide();
                physicalBody.SetActive(false);
            }
        }
    });

    return body;
}

function createObstaclePlatform(layer) {

    var level = layer.getScene();
    var levelHeight = level.getPhysicalSize().height;

    var posX = 0.9 * WORLD_SCALE;
    var posY = levelHeight - 0.03 * WORLD_SCALE;

    var body = new anima.Body('box-platform');
    layer.addNode(body);

    body.setSize(350, 22);
    //body.addBackground('red');
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

    var columns = 3;
    var rows = 8;

    var platform = createObstaclePlatform(layer);
    var y0 = platform.getPosition().y - platform.getSize().height / 2 - 40;
    var x0 = platform.getPosition().x - platform.getSize().width / 2 + 70;

    var height = layer.getScene().getSize().height;

    var ps = platform.getLevel().getPhysicsScale();

    var id, type, posX, posY, box;
    for (var i = 0; i < columns; i++) {
        posX = x0 + (i * (68 + 50));
        for (var j = 0; j < (rows - 2 * i); j++) {
            id = i + '-' + j;
            type = (j % 2) ? 'white' : 'bomb';
            posY = y0 - j * 60;

            box = createObstacleBox(layer, id, type, posX / ps, posY / ps);
        }
    }
}
