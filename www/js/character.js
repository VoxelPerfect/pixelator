/*
 * Copyright 2012 Kostas Karolemeas, Spiros Xenos
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

pixelator.Character = anima.Body.extend({

    init:function (layer, characterPosX, characterPosY) {

        this._super('character');

        this._characterPosX = characterPosX;
        this._characterPosY = characterPosY;

        this._create(layer);
    },

    logic:function () {

        var body = this;

        var physicalBody = body.getPhysicalBody();
        var level = this.getLevel();
        var center = physicalBody.GetPosition();
        if (center.y < (0 - body.getPhysicalSize().height * 2)
            || center.y > level.getPhysicalSize().height
            || center.x < 0) {

            this.reset();
            resetArrow(level);
            return;
        }

        if (body.get('inAction')
            && (!physicalBody.IsAwake() || !body.isMoving())) {

            this.reset();
            resetArrow(level);
        }
    },

    onBeginContact:function (otherBody) {

        var otherBodyId = otherBody.getId();

        if (otherBodyId.startsWith('box')) {
            otherBody.set('hit', true);
            var level = this.getLevel();
            level.getLayer('score').get('scoreDisplay').addScore(10);
        }
    },

    reset:function () {

        this.set('inAction', false);

        var physicalBody = this.getPhysicalBody();
        physicalBody.SetPositionAndAngle(new b2Vec2(this._characterPosX, this._characterPosY), 0);
        physicalBody.SetLinearVelocity(new b2Vec2(0, 0));
        physicalBody.SetAngularVelocity(0);

        physicalBody.SetAwake(true);

        this.setActiveBackground('start');
    },

    /* internal methods */

    _create:function (layer) {

        var level = layer.getScene();
        var levelHeight = level.getPhysicalSize().height;

        layer.addNode(this);

        this.setSize(100, 120);
        this.addBackground(null, getImageUrl(level, 'character_start'), {
            row:4,
            columns:4,
            totalSprites:14,
            animation:{
                duration:1000,
                onAnimationEndedFn:function (animator, animation) {
                    var character = animator.getNode(animation.data.nodeId);
                    if (character) {
                        character.setActiveBackground('idle');
                    }
                }
            }
        }, 'start');
        this.addBackground(null, getImageUrl(level, 'character_idle'), {
            row:5,
            columns:6,
            totalSprites:26,
            animation:{
                duration:1000,
                loop:true
            }
        }, 'idle');
        this.addBackground(null, getImageUrl(level, 'character_attack'), {
            row:4,
            columns:4,
            totalSprites:13,
            animation:{
                duration:1000
            }
        }, 'attack');

        var bodyDef = new b2BodyDef;
        bodyDef.type = b2Body.b2_dynamicBody;
        bodyDef.allowSleep = true;
        if (LINEAR_DAMPING > 0) {
            bodyDef.linearDamping = LINEAR_DAMPING;
        }
        bodyDef.position.x = this._characterPosX;
        bodyDef.position.y = this._characterPosY;

        var fixDef = new b2FixtureDef;
        fixDef.density = CHARACTER_DENSITY;
        fixDef.friction = 0.5;
        fixDef.restitution = 0.2;
        fixDef.shapeFile = 'resources/shapes/character.plist';
        fixDef.filter.categoryBits = CATEGORY_USER;
        fixDef.filter.maskBits = CATEGORY_BOX | CATEGORY_USER_PLATFORM | CATEGORY_ENEMY;

        this.define(bodyDef, fixDef);

        /*
         var gaziaSound = new anima.Sound('gazia', 'resources/sounds/gazia.mp3');
         body.set('gazia', gaziaSound);
         var papakiaSound = new anima.Sound('sta_papakia', 'resources/sounds/sta_papakia_mas_re.mp3');
         body.set('sta_papakia', papakiaSound);
         */
    }
});

