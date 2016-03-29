var Vertex = function(data, canvas, context) {
    this.data = data;
    //Never try to print the links along with the data. Leads to infinite loops.
    this.links = [];
    this.x = 0;
    this.x = 0;
    this.dx = 0;
    this.dy = 0;
    this.vx = 0;
    this.vy = 0;
    this.r = 10;
    this.context = context;
    this.canvas = canvas;
}

Vertex.prototype.add = function(data) {
    var result = (data instanceof Vertex) ? data : new Vertex(data);
    if (result == this) {
        return undefined;
    }
    for (var i = 0; i < this.links.length; i++) {
        if (this.links[i] == result) {
            return undefined;
        }
    }
    this.links.push(result);
    result.links.push(this);
    return result;
}

Vertex.prototype.display = function(nodeSize, steepness) {
    this.displayLines();
    this.displayBody(nodeSize, steepness);
}

Vertex.prototype.displayLines = function() {
    for (var i = 0; i < this.links.length; i++) {
        this.context.moveTo(this.x, this.y);
        this.context.lineTo(this.links[i].x, this.links[i].y);
    }
    this.context.stroke();
}

Vertex.prototype.displayBody = function(nodeSize, steepness) {
    this.context.beginPath();

    var distToMouse = dist(this.x, this.y, mx, my);

    this.r = 3 * (1 + this.links.length)
        + logistic(nodeSize, -distToMouse, steepness);
    this.context.arc(this.x, this.y, this.r, 0, 2 * Math.PI);
    this.context.stroke();
    this.context.fill();
    this.context.closePath();

    return distToMouse;
}

Vertex.prototype.displayData = function() {
    this.context.strokeText(this.data, this.x, this.y - this.r / 2);
}

Vertex.prototype.move = function(vertices, eqdist, k, q) {
    var mag;
    var d;

    for (var j = 0; j < this.links.length; j++) {
        d = dist(this.x, this.y, this.links[j].x, this.links[j].y);
        mag = k * (d / 2 - eqdist);
        if (d < 1) {
            d = 1;
        }
        this.vx -= (this.x - this.links[j].x) / d * mag;
        this.vy -= (this.y - this.links[j].y) / d * mag;
    }

    for (var j = 0; j < vertices.length; j++) {
        if (this != vertices[j]) {
            d = dist(this.x, this.y, vertices[j].x, vertices[j].y);
            if (d < 1) {
                d = 1;
            }
            mag = q / Math.pow(d, 2);

            var ax = (this.x - vertices[j].x) / d * mag;
            if (ax > 3) {
                ax = 3;
            }
            if (ax < -3) {
                ax = -3;
            }
            var ay = (this.y - vertices[j].y) / d * mag;
            if (ay > 3) {
                ay = 3;
            }
            if (ay < -3) {
                ay = -3;
            }
            this.vx += ax;
            this.vy += ay;
        }
    }

    //if (this != closest[0]) {
        this.vx *= 0.91;
        this.vy *= 0.91;
        if (this.vx > 30) {
            this.vx = 30;
        }
        if (this.vx < -30) {
            this.vx = -30;
        }
        if (this.vy > 30) {
            this.vy = 30;
        }
        if (this.vy < -30) {
            this.vy = -30;
        }
        this.x += this.vx;
        this.y += this.vy;
    //}

    if (this.x + this.r >= this.canvas.width) {
        this.x = this.canvas.width - this.r;
    } else if(this.x - this.r <= 0) {
        this.x = this.r;
    }

    if (this.y + this.r >= this.canvas.height) {
        this.y = this.canvas.height - this.r;
    } else if (this.y - this.r <= 0) {
        this.y = this.r;
    }
}

function dist(x0, y0, x1, y1) {
    return Math.sqrt(Math.pow(x0 - x1, 2) + Math.pow(y0 - y1, 2));
}

function logistic(l, x, k) {
    return l / (1 + Math.pow(Math.E, -((k || 1) * x)));
}
