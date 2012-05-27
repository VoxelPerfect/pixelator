pixelator.Enemy = anima.Body.extend({

    onBeginContact:function (otherBody) {

        var otherId = otherBody.getId();

        if (otherId == 'character') {
            var level = this.getLevel();
            if (this.get('hits')) {
                if (this.get('hits') == 1) {
                    this.set('hits', 2);
                    //bodyB.get('boom').play();
                    this.setActiveBackground('destroy');
                    level.getLayer('score').get('scoreDisplay').addScore(350);
                }
            } else {
                this.set('hits', 1);
                //bodyB.get('boom').play();
                this.setActiveBackground('hit');
            }
        }
    }
});

function createEnemy(layer, id, posX, posY, animationOffset) {

    var level = layer.getScene();
    var levelHeight = level.getPhysicalSize().height;

    var body = new pixelator.Enemy(id);
    layer.addNode(body);

    body.setSize(125, 125);
    body.addBackground(null, getImageUrl(level, 'enemy'), {
        row:8,
        columns:8,
        totalSprites:50,
        animation:{
            duration:2000,
            loop:true,
            delay:animationOffset
        }
    }, 'normal');
    body.addBackground(null, getImageUrl(level, 'enemy_hit'), {
        row:5,
        columns:6,
        totalSprites:26,
        animation:{
            duration:2000,
            loop:true
        }
    }, 'hit');
    body.addBackground(null, getImageUrl(level, 'enemy_destroy'), {
        row:5,
        columns:6,
        totalSprites:25,
        animation:{
            duration:2000,
            onAnimationEndedFn:function (animation) {
                var enemy = animation.data.node;
                enemy.destroy();
            }
        }
    }, 'destroy');

    var physicalSize = body.getPhysicalSize();

    var bodyDef = new b2BodyDef;
    bodyDef.type = b2Body.b2_staticBody;
    bodyDef.allowSleep = true;
    bodyDef.position.x = posX;
    bodyDef.position.y = posY;

    var fixDef = new b2FixtureDef;
    fixDef.density = CHARACTER_DENSITY;
    fixDef.friction = 0.5;
    fixDef.restitution = 0.4;
    fixDef.shapeFile = 'resources/shapes/enemy.plist';
    fixDef.filter.categoryBits = CATEGORY_ENEMY;
    fixDef.filter.maskBits = CATEGORY_USER | CATEGORY_BOX;

    body.define(bodyDef, fixDef);

    /*
     var boomSound = new anima.Sound(id + 'boom', 'resources/sounds/boom.mp3');
     body.set('boom', boomSound);
     var laughSound = new anima.Sound(id + '_laugh', 'resources/sounds/laugh.mp3');
     body.set('laugh', laughSound);
     */
}