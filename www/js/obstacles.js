/*
 * Copyright 2012 Kostas Karolemeas, Spiros Xenos
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

pixelator.Obstacle = anima.Body.extend({

    init:function (obstacleType, id) {

        this._super('box-' + obstacleType + '-' + id);

        this._obstacleType = obstacleType;
    },

    logic:function () {

        var level = this.getLevel();
        var body = this;

        var physicalBody = body.getPhysicalBody();
        if (physicalBody.IsAwake()) {
            var center = physicalBody.GetPosition();
            if (center.y > level.getPhysicalSize().height) {
                body.destroy();
            }
        } else if (body.get('hit')) {
            body.fadeOut(400, function () {
                body.destroy();
            });
        }
    }
});

function createObstacleBox(layer, id, type, posX, posY) {

    var level = layer.getScene();

    var body = new pixelator.Obstacle(type, id);

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
    fixDef.density = 1.0;
    fixDef.friction = 0.9;
    fixDef.restitution = 0.2;
    fixDef.shape.SetAsBox(physicalSize.width / 2, physicalSize.height / 2);
    fixDef.filter.categoryBits = CATEGORY_BOX;
    fixDef.filter.maskBits = CATEGORY_BOX_PLATFORM | CATEGORY_BOX | CATEGORY_USER;

    body.define(bodyDef, fixDef);

    return body;
}

function createObstaclePlatform(layer) {

    var level = layer.getScene();
    var levelHeight = level.getPhysicalSize().height;

    var posX = 0.99 * WORLD_SCALE;
    var posY = levelHeight - 0.03 * WORLD_SCALE;

    var body = new anima.Body('box-platform');
    layer.addNode(body);

    body.setSize(410, 22);
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
    fixDef.filter.categoryBits = CATEGORY_BOX_PLATFORM;
    fixDef.filter.maskBits = CATEGORY_BOX;

    body.define(bodyDef, fixDef);

    return body;
}

function createObstacles(layer) {

    var columns = 3;
    var rows = 8;

    var platform = createObstaclePlatform(layer);
    var y0 = platform.getPosition().y - platform.getSize().height / 2 - 40;
    var x0 = platform.getPosition().x - platform.getSize().width / 2 + 92;

    var height = layer.getScene().getSize().height;

    var ps = platform.getLevel().getPhysicsScale();

    var id, type, posX, posY, box, typeIndex;
    for (var i = 0; i < columns; i++) {
        posX = x0 + (i * (68 + 50));
        for (var j = 0; j < (rows - 2 * i); j++) {
            id = i + '-' + j;
            typeIndex = (i % 2) ? (j % 2) : 1 - (j % 2);
            type = typeIndex ? 'white' : 'bomb';
            posY = y0 - j * 59;

            posX += (j % 2) ? 6 : -10;
            box = createObstacleBox(layer, id, type, posX / ps, posY / ps);
        }
    }
}
