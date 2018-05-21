window.onload = function () {
    var canv = document.getElementById('canv');
    canv.width = document.documentElement.clientWidth;
    canv.height = document.documentElement.clientHeight;
    
    var numBoids = 500;
    var viewingRadius = 80;
    var cohesionCoefficient = 0.4;
    var separationCoefficient = 1;
    var alignmentCoefficient = 0.02;
    var vMax = 5;
    var boidSize = 10;
    
    var gameInstance = game(canv);

    gameInstance.setNumBoids(numBoids);
    gameInstance.setViewingRadius(viewingRadius);
    gameInstance.setCohesionCoefficient(cohesionCoefficient);
    gameInstance.setSeparationCoefficient(separationCoefficient);
    gameInstance.setAlignmentCoefficient(alignmentCoefficient);
    gameInstance.setVMax(vMax);
    gameInstance.setBoidSize(boidSize);

    setInterval(gameInstance.act, 20);
    resizeWindow(canv, gameInstance);

    var menu = document.getElementById('menu');

    addInput(menu, "Number of Boids", function (evt) {
        gameInstance.setNumBoids(evt.target.value);
    }, numBoids, 0, undefined, 1);

    addInput(menu, "Viewing Radius", function (evt) {
        gameInstance.setViewingRadius(evt.target.value);
    }, viewingRadius, 0, undefined, 5);

    addInput(menu, "Cohesion", function (evt) {
        gameInstance.setCohesionCoefficient(evt.target.value);
    }, cohesionCoefficient, 0, undefined, 0.05);

    addInput(menu, "Alignment", function (evt) {
        gameInstance.setAlignmentCoefficient(evt.target.value);
    }, 0.02, 0, undefined, 0.02);

    addInput(menu, "Separation", function (evt) {
        gameInstance.setSeparationCoefficient(evt.target.value);
    }, separationCoefficient, 0, undefined, 0.1);

    addInput(menu, "Max Velocity", function (evt) {
        gameInstance.setVMax(evt.target.value);
    }, vMax, 0, undefined, 1);

    addInput(menu, "Boid Size", function (evt) {
        gameInstance.setBoidSize(evt.target.value);
    }, boidSize, 1, undefined, 1);

    window.addEventListener('resize', function () {
        resizeWindow(canv, gameInstance);
    }, false);
};

var addInput = function (ul, label, oninput, value, min, max, step) {
    var input = document.createElement('input');
    input.id = label;
    input.type = 'number';
    if (min !== undefined) {
        input.min = min;
    }
    if (max !== undefined) {
        input.max = max;
    }
    input.oninput = oninput;
    input.value = value;
    input.step = step || 0.1;

    var labelElement = document.createElement('label');
    labelElement.for = input.id;
    labelElement.innerHTML = label;

    var li = document.createElement('li');
    var labelDiv = document.createElement('div');
    var inputDiv = document.createElement('div')
    inputDiv.width = '50%';

    labelDiv.appendChild(labelElement);
    inputDiv.appendChild(input);

    li.appendChild(labelDiv);
    li.appendChild(inputDiv);

    ul.appendChild(li);
};

var resizeWindow = function (canv, gameInstance) {
    canv.width = document.documentElement.clientWidth;
    canv.height = document.documentElement.clientHeight;
    gameInstance.setDims(canv.width, canv.height);
};

var game = function (canv) {
    var boids = [];
    var numBoids = 0;
    var width = canv.width;
    var height = canv.height;
    var ctx = canv.getContext('2d');
    var viewingRadius = 80;
    var sqrViewingRadius = viewingRadius * viewingRadius;
    var cohesionCoefficient = 0.4;
    var separationCoefficient = 1;
    var alignmentCoefficient = 0.02;
    var vMax = 5;
    var boidSize = 10;

    var self = {};

    const twoPi = 2 * Math.PI;

    self.setDims = function (x, y) {
        width = x;
        height = y;
    };

    self.setViewingRadius = function (v) {
        viewingRadius = v;
        sqrViewingRadius = v * v;
    };

    self.setCohesionCoefficient = function (v) {
        cohesionCoefficient = v;
    };

    self.setSeparationCoefficient = function (v) {
        separationCoefficient = v;
    };

    self.setAlignmentCoefficient = function (v) {
        alignmentCoefficient = v;
    };

    self.setVMax = function (v) {
        vMax = v;
    };

    self.setNumBoids = function (n) {
        if (n > numBoids) {
            for (var i = numBoids; i < n; i++) {
                boids[i] = {
                    x: Math.random() * width,
                    y: Math.random() * height,
                    vx: 0,
                    vy: 0,
                    ax: 0,
                    ay: 0,
                    id: i,
                    neighbors: {}
                };
            }
        } else {
            for (i = numBoids - 1; i >= n; i--) {
                delete boids[i];
            }
        }

        numBoids = +n;
    };

    self.setBoidSize = function (v) {
        boidSize = v;
    }

    var matmul2x2by2x1 = function (a, b) {
        return [
            a[0][0] * b[0] + a[0][1] * b[1],
            a[1][0] * b[0] + a[1][1] * b[1]
        ];
    };

    var drawBoids = function () {
        ctx.fillStyle = '#EAEAEA';
        ctx.fillRect(0, 0, width, height);
        ctx.fillStyle = '#224870';
        var right = [boidSize, 0];
        var top = [-boidSize / 2, -boidSize / 2];
        var bottom = [-boidSize / 2, boidSize / 2];
        var middle = [0, 0];
        for (var i = 0; i < numBoids; i++) {
            var x = boids[i].x;
            var y = boids[i].y;
            var vx = boids[i].vx;
            var vy = boids[i].vy;
            var mag = Math.sqrt(vx * vx + vy * vy);
            var rot;
            if (mag == 0) {
                rot = [[1, 0], [0, 1]];
            } else {
                rot = [[vx / mag, -vy / mag], [vy / mag, vx / mag]];
            }

            var r = matmul2x2by2x1(rot, right);
            var t = matmul2x2by2x1(rot, top);
            var b = matmul2x2by2x1(rot, bottom);
            var m = [x, y];
            r = [r[0] + x, r[1] + y];
            t = [t[0] + x, t[1] + y];
            b = [b[0] + x, b[1] + y];

            ctx.beginPath();
            ctx.moveTo(boids[i].x, boids[i].y);
            ctx.lineTo(r[0], r[1]);
            ctx.lineTo(t[0], t[1]);
            ctx.lineTo(m[0], m[1]);
            ctx.lineTo(b[0], b[1]);
            ctx.lineTo(r[0], r[1]);
            ctx.closePath();
            ctx.fill();
        }
    };

    self.act = function () {
        applyRules();
        drawBoids();
    };

    var applyRules = function () {
        for (var i = 0; i < numBoids; i++) {
            var neighbors = [];
            for (var j = 0; j < numBoids; j++) {
                var dx = (boids[j].x - boids[i].x);
                var dy = (boids[j].y - boids[i].y);
                var sqrDist = dx * dx + dy * dy;
                if (sqrDist <= sqrViewingRadius && i !== j) {
                    neighbors.push(j);
                }
            }

            separationRule(boids[i], neighbors);
            alignmentRule(boids[i], neighbors);
            cohesionRule(boids[i], neighbors);
        }

        for (i = 0; i < numBoids; i++) {
            boids[i].vx += boids[i].ax;
            boids[i].vy += boids[i].ay;

            var v_mag = Math.sqrt(boids[i].vx * boids[i].vx + boids[i].vy * boids[i].vy);
            if (v_mag > vMax) {
                boids[i].vx = boids[i].vx / v_mag * vMax;
                boids[i].vy = boids[i].vy / v_mag * vMax;
            }

            boids[i].x += boids[i].vx;
            boids[i].y += boids[i].vy;
            boids[i].ax = 0;
            boids[i].ay = 0;

            if (boids[i].x > width + 10) {
                boids[i].x = -10;
            } else if (boids[i].x < -10) {
                boids[i].x = width + 10;
            }

            if (boids[i].y > height + 10) {
                boids[i].y = -10;
            } else if (boids[i].y < -10) {
                boids[i].y = height + 10;
            }
        }
    };

    var separationRule = function (boid, neighbors) {
        var temp = {
            x: 0,
            y: 0
        };
        for (var i = 0; i < neighbors.length; i++) {
            var dx = boid.x - boids[neighbors[i]].x;
            var dy = boid.y - boids[neighbors[i]].y;
            var mag = Math.sqrt(dx * dx + dy * dy);
            if (mag > 1) {
                dx *= separationCoefficient / mag;
                dy *= separationCoefficient / mag;
            }
            temp.x += dx;
            temp.y += dy;

        }
        boid.ax += temp.x;
        boid.ay += temp.y;
    };

    var alignmentRule = function (boid, neighbors) {
        if (neighbors.length === 0) {
            return;
        }
        var mag = {
            x: 0,
            y: 0
        };
        for (var i = 0; i < neighbors.length; i++) {
            mag.x += boids[neighbors[i]].vx;
            mag.y += boids[neighbors[i]].vy;
        }
        boid.ax += mag.x * alignmentCoefficient;
        boid.ay += mag.y * alignmentCoefficient;
    };

    var cohesionRule = function (boid, neighbors) {
        if (neighbors.length === 0) {
            return;
        }
        var cm = {
            x: 0,
            y: 0
        };
        for (var i = 0; i < neighbors.length; i++) {
            cm.x += boids[neighbors[i]].x;
            cm.y += boids[neighbors[i]].y;
        }
        cm.x /= i;
        cm.y /= i;
        boid.ax += (cm.x - boid.x) * cohesionCoefficient;
        boid.ay += (cm.y - boid.y) * cohesionCoefficient;
    };

    return self;
};