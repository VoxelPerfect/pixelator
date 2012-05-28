$('#mainPage').live('pageshow', function (event, ui) {

    var canvas = new anima.Canvas('main-canvas', DEBUG);
    canvas.setSize(1575, 787);

    new pixelator.Level_1(canvas);

    $('.ui-loader').css({
        'opacity':0.4,
        'overflow':'hidden',
        'top':'70%'
    });

    anima.start(function () {
        var canvasSize = canvas.getSize();
        var x0 = 0.20 * canvasSize.width;
        var y0 = 0.44 * canvasSize.height;
        var level = canvas.getScene('level_1');
        level.setViewport({
            x1:x0,
            y1:y0,
            x2:x0 + 300,
            y2:y0 + 300
        });
        canvas.setCurrentScene('level_1', 500, function () {
            level.setViewport(null, 2000);
        });
    });
});
