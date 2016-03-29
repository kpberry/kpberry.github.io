var mx, my, selected, mode, canvas, context, vertices, stickyKeys;

$(function() {
    canvas = document.getElementById("main-canvas");
    context = canvas.getContext("2d");
    var canvasY = canvas.getBoundingClientRect().top;
    var canvasX = canvas.getBoundingClientRect().left;

    window.addEventListener('resize', resizeCanvas, false);

    mx = 0;
    my = 0;
    var dragging = false;
    var connecting = false;
    var disconnecting = false;
    var removing = false;
    var editing = false;
    stickyKeys = true;
    mode = 'drag';

    selected = [undefined, window.innerWidth * window.innerHeight];
    closest = [undefined, window.innerWidth * window.innerHeight];

    vertices = [];
    var v;
    var nodeSize = 100;
    var eqdist = nodeSize / 2;
    var q = 500;
    var k = 0.1;
    var steepness = 0.1;
    var connectivity = 0.7;
    var numVertices = 20;

    for (var i = 0; i < numVertices; i++) {
        addVertex("Node " + i, nodeSize);
    }

    for (var i = 0; i < vertices.length; i++) {
        for (var j = 0; j < vertices.length; j++) {
            if (vertices[i] != vertices[j]) {
                if (Math.random() < connectivity / vertices.length) {
                    vertices[i].add(vertices[j]);
                }
            }
        }
    }

    resizeCanvas();
    function resizeCanvas() {
        canvas.width = window.innerWidth * 0.9;
        canvas.height = window.innerHeight * 0.9;
        setInterval(() => draw(canvas), 1);
    }

    window.addEventListener('keydown', (e) => {
        if (mode === 'openEdit') {
            return;
        }
        var key = String.fromCharCode(e.keyCode || e.which).toLowerCase();
        switch (key) {
            case 'a':
                editing = true;
                mode = 'edit';
                var v = addVertex("New Node", nodeSize);
                v.openInput();
                break;
            case 'e':
                editing = true;
                mode = 'edit';
                break;
            case 'x':
                clearVertices();
                break;
            case 'c':
                if (stickyKeys) {
                    mode = 'connect';
                } else {
                    connecting = true;
                }
                break;
            case 'd':
                if (stickyKeys) {
                    mode = 'disconnect';
                } else {
                    disconnecting = true;
                }
                break;
            case 'r':
                if (stickyKeys) {
                    mode = 'remove';
                } else {
                    removeVertex(selected[0]);
                }
                break;
            case 's':
                toggleStickyKeys();
            default:
                mode = 'drag';
                break;
        }
    });

    window.addEventListener('keyup', (e) => {
        if (!stickyKeys) {
            var key = String.fromCharCode(e.keyCode || e.which).toLowerCase();
            switch (key) {
                case 'c':
                    connecting = false;
                    closest[0].add(selected[0]);
                    break;
                case 'd':
                    disconnecting = false;
                    closest[0].disconnect(selected[0]);
                    break;
            }
        }
    });

    canvas.addEventListener('mousedown', () => {
        switch (mode) {
            case 'drag':
                dragging = true;
                break;
            case 'edit':
                selected[0].openInput();
                break;
            case 'connect':
                connecting = true;
                break;
            case 'disconnect':
                disconnecting = true;
                break;
            case 'remove':
                removeVertex(selected[0]);
                break;
        }
    });

    canvas.addEventListener('mouseup', () => {
        switch (mode) {
            case 'drag':
                dragging = false;
                break;
            case 'connect':
                connecting = false;
                closest[0].add(selected[0]);
                break;
            case 'disconnect':
                disconnecting = false;
                closest[0].disconnect(selected[0]);
                break;
        }
    });

    canvas.addEventListener('mousemove', () => {
        mx = window.event.clientX - canvasX;
        my = window.event.clientY - canvasY;
        if (dragging) {
            selected[0].x = mx;
            selected[0].y = my;
        }
    }, false);

    function draw() {
        context.textAlign = "center";
        drawTaskVertices(context, canvas, vertices, null, null,
             steepness, connecting, disconnecting, mode === 'openEdit');
        moveTaskVertices(context, canvas, vertices, eqdist, k, q);
        if (dragging) {
            selected[0].x = mx;
            selected[0].y = my;
        } else if (connecting) {
            context.strokeStyle = "#00FF00";
            context.lineWidth = 3;
            context.moveTo(selected[0].x, selected[0].y);
            context.lineTo(mx, my);
            context.stroke();
            context.lineWidth = 1;
        } else if (disconnecting) {
            context.strokeStyle = "#FF0000";
            context.lineWidth = 3;
            context.moveTo(selected[0].x, selected[0].y);
            context.lineTo(mx, my);
            context.stroke();
            context.lineWidth = 1;
        } else if (removing) {
            context.strokeStyle = "#FF0000";
            context.lineWidth = 3;
            context.stroke();
            context.lineWidth = 1;
        }
    }
});

function setMode(input) {
    mode = input;
}

function drawTaskVertices(context, canvas, vertices, fill, stroke,
                          steepness, connecting, disconnecting, editing) {
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = fill || "#FFFFFF";
    context.strokeStyle = stroke || "#000000";

    for (var i = 0; i < vertices.length; i++) {
        vertices[i].displayLines();
    }

    for (var i = 0; i < vertices.length; i++) {
        var distToMouse = vertices[i].displayBody(steepness);
        vertices[i].displayData();
        if (connecting || disconnecting) {
            if (distToMouse < closest[1]) {
                closest = [vertices[i], distToMouse];
            }
        } else if (!editing && distToMouse < selected[1]) {
            selected = [vertices[i], distToMouse];
            closest = selected;
        }
    }

    context.strokeStyle = "#0000FF";
    selected[1] = selected[0].displayBody(steepness, 3);
    context.strokeStyle = stroke || "#000000";
    selected[0].displayData();

    if (closest != selected)  {
        closest[1] = closest[0].displayBody(steepness);
        closest[0].displayData();
    }
}

function moveTaskVertices(context, canvas, vertices, eqdist, k, q) {
    for (var i = 0; i < vertices.length; i++) {
        vertices[i].move(vertices, eqdist, k, q);
    }
}

function addVertex(data, nodeSize) {
    var v = new Vertex(data, nodeSize, canvas, context);
    v.x = Math.random() * window.innerWidth;
    v.y = Math.random() * window.innerHeight;
    vertices.push(v);
    return v;
}

function removeVertex(v) {
    v.remove(vertices);
}

function toggleStickyKeys() {
    stickyKeys = !stickyKeys;
}

function clearVertices() {
    if (confirm("Are you sure you want to clear this graph?")) {
        vertices = [];
    }
}
