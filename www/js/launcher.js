function createPlatform(layer) {

    var level = layer.getScene();
    var levelHeight = level.getPhysicalSize().height;

    var posX = 0.39 * WORLD_SCALE;
    var posY = levelHeight - 0.12 * WORLD_SCALE;

    var body = new anima.Body('platform');
    layer.addNode(body);

    body.setSize(197, 22);
    var physicalSize = body.getPhysicalSize();
    body._physicalSize.height /= 2;

    var bodyDef = new b2BodyDef;
    bodyDef.type = b2Body.b2_staticBody;
    bodyDef.position.x = posX
    bodyDef.position.y = posY;

    var fixDef = new b2FixtureDef;
    fixDef.friction = 0.5;
    fixDef.restitution = 0.2;
    fixDef.shape = new b2PolygonShape;
    fixDef.shape.SetAsBox(physicalSize.width / 2, physicalSize.height / 2);
    fixDef.filter.categoryBits = CATEGORY_USER_PLATFORM;
    fixDef.filter.maskBits = CATEGORY_USER;

    body.define(bodyDef, fixDef);

    var physicalBody = body.getPhysicalBody();
    physicalBody.SetAngle(anima.toRadians(-9));
}

function createArrow(layer) {

    var level = layer.getScene();
    var character = level.getLayer('characters').getNode('character');

    var arrowX = 250;
    var arrowY = 370;

    var node = new anima.Node('arrow');
    layer.addNode(node);

    var arrowWidth = 160;
    var arrowHeight = 77;
    node.setSize(arrowWidth, arrowHeight);
    node.addBackground(null, getImageUrl(layer.getScene(), 'arrow'), {
        rows:5,
        columns:6,
        totalSprites:29
    });
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
    var totalSprites = node.getTotalSprites();
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
                    character.setActiveBackground('attack');
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

