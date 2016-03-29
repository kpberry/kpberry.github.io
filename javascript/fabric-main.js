var mx, my, selected, canvas, context, vertices;

$(function() {
    canvas = document.getElementById("main-canvas");
    context = canvas.getContext("2d");
    var canvasY = canvas.getBoundingClientRect().top;
    var canvasX = canvas.getBoundingClientRect().left;

    window.addEventListener('resize', resizeCanvas, false);

    mx = 0;
    my = 0;
    var dragging = false;

    selected = [undefined, window.innerWidth * window.innerHeight];

    vertices = [];
    var v;
    var eqdist = 15;
    var q = 100;
    var k = 0.1;
    var nodeSize = 100;
    var steepness = 0.06;
    var connectivity = 1;
    var numVertices = 36;


    setSize(numVertices);


    resizeCanvas();
    function resizeCanvas() {
        canvas.width = window.innerWidth * 0.9;
        canvas.height = window.innerHeight * 0.9;
        setInterval(() => draw(canvas), 1);
    }

    canvas.addEventListener('mousemove', () => {
        mx = window.event.clientX - canvasX;
        my = window.event.clientY - canvasY;
        if (dragging) {
            selected[0].x = mx;
            selected[0].y = my;
        }
    }, false);

    canvas.addEventListener('mousedown', () => { dragging = true; });

    canvas.addEventListener('mouseup', () => { dragging = false; });

    function draw() {
        drawVertices(context, canvas, vertices, null, null,
             nodeSize, steepness);
        moveVertices(context, canvas, vertices, eqdist, k, q);
        if (dragging) {
            selected[0].x = mx;
            selected[0].y = my;
        }
    }
});

function drawVertices(context, canvas, vertices, fill, stroke, nodeSize,
                          steepness) {
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = fill || "#FFFFFF";
    context.strokeStyle = stroke || "#000000";

    for (var i = 0; i < vertices.length; i++) {
        vertices[i].displayLines();
    }

    for (var i = 0; i < vertices.length; i++) {
        var distToMouse = dist(vertices[i].x, vertices[i].y, mx, my);
        if (distToMouse < selected[1]) {
            selected = [vertices[i], distToMouse];
        }
    }

    context.fillStyle = stroke || "#000000";
    context.strokeStyle = fill || "#FFFFFF";
    selected[1] = selected[0].displayBody(nodeSize, steepness);
    selected[0].displayData();
}

function moveVertices(context, canvas, vertices, eqdist, k, q) {
    for (var i = 0; i < vertices.length; i++) {
        vertices[i].move(vertices, eqdist, k, q);
    }
}

function setSize(numVertices) {
    vertices = [];
    for (var i = 0; i < numVertices; i++) {
        vertices.push(new Vertex('', canvas, context));
    }

    var cur;
    var n = Math.sqrt(numVertices);
    for (var i = 0; i < n; i++) {
        for (var j = 0; j < n; j++) {
            cur = vertices[i + j * n];
            if (i > 0) {
                cur.add(vertices[i - 1 + j * n]);
            }
            if (i < n - 1) {
                cur.add(vertices[i + 1 + j * n]);
            }
            if (j > 0) {
                cur.add(vertices[i + (j - 1) * n]);
            }
            if (j < n - 1) {
                cur.add(vertices[i + (j + 1) * n]);
            }
            cur.x = i * 50;
            cur.y = j * 50;
        }
    }
}
