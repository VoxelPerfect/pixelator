var canvas = null;

// http://localhost/hobistic/anima/www/index.html?scale=18.0&density=2&impulse=300&gravity=9.81&damp=0.4&debug=true
var DEBUG = anima.getRequestParameter('debug');
var WORLD_SCALE = parseFloat(anima.getRequestParameter('scale', '18.0'));
var CHARACTER_DENSITY = parseFloat(anima.getRequestParameter('density', '1.0'));
var CHARACTER_IMPULSE = parseFloat(anima.getRequestParameter('impulse', '30.0'));
var GRAVITY = parseFloat(anima.getRequestParameter('gravity', '9.81'));
var LINEAR_DAMPING = parseFloat(anima.getRequestParameter('damp', '0.4'));

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

    node.setSize(layer.getScene().getSize().width, 30);
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

var CATEGORY_NONE = 0x0000;
var CATEGORY_USER = 0x0001;
var CATEGORY_USER_PLATFORM = 0x0002;
var CATEGORY_ENEMY = 0x0004;
var CATEGORY_BOX = 0x0008;
var CATEGORY_BOX_PLATFORM = 0x010;
var CATEGORY_ALL = 0xffff;
