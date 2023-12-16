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
    var boidColor = '#224870';
    var backgroundColor = '#EAEAEA';

    var gameInstance = game(canv);

    gameInstance.setNumBoids(numBoids);
    gameInstance.setViewingRadius(viewingRadius);
    gameInstance.setCohesionCoefficient(cohesionCoefficient);
    gameInstance.setSeparationCoefficient(separationCoefficient);
    gameInstance.setAlignmentCoefficient(alignmentCoefficient);
    gameInstance.setVMax(vMax);
    gameInstance.setBoidSize(boidSize);
    gameInstance.setBoidColor(boidColor);

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
    }, alignmentCoefficient, 0, undefined, 0.02);

    addInput(menu, "Separation", function (evt) {
        gameInstance.setSeparationCoefficient(evt.target.value);
    }, separationCoefficient, 0, undefined, 0.1);

    addInput(menu, "Max Velocity", function (evt) {
        gameInstance.setVMax(evt.target.value);
    }, vMax, 0, undefined, 1);

    addInput(menu, "Boid Size", function (evt) {
        gameInstance.setBoidSize(evt.target.value);
    }, boidSize, 1, undefined, 1);

    addColorInput(menu, "Boid Color", function (evt) {
        gameInstance.setBoidColor(evt.target.value)
    }, boidColor);

    addColorInput(menu, "Background Color", function (evt) {
        gameInstance.setBackgroundColor(evt.target.value)
    }, backgroundColor);

    addToggle(menu, "Show Lines", function (evt) {
        gameInstance.setShowLines(evt.target.checked);
    }, false);

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
    var inputDiv = document.createElement('div');

    labelDiv.appendChild(labelElement);
    inputDiv.appendChild(input);

    li.appendChild(labelDiv);
    li.appendChild(inputDiv);

    ul.appendChild(li);
};

var addColorInput = function (ul, label, oninput, value) {
    var input = document.createElement('input');
    input.id = label;
    input.type = 'color';
    input.oninput = oninput;
    input.value = value;

    var labelElement = document.createElement('label');
    labelElement.for = input.id;
    labelElement.innerHTML = label;

    var li = document.createElement('li');
    var labelDiv = document.createElement('div');
    var inputDiv = document.createElement('div');

    labelDiv.appendChild(labelElement);
    inputDiv.appendChild(input);

    li.appendChild(labelDiv);
    li.appendChild(inputDiv);

    ul.appendChild(li);
};

var addToggle = function (ul, label, oninput, value) {
    var input = document.createElement('input');
    input.id = label;
    input.type = 'checkbox';
    input.oninput = oninput;
    input.value = value;

    var labelElement = document.createElement('label');
    labelElement.for = input.id;
    labelElement.innerHTML = label;

    var li = document.createElement('li');
    var container = document.createElement('div');

    container.appendChild(labelElement);
    container.appendChild(input);

    li.appendChild(container);

    ul.appendChild(li);
}

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
    var boidColor = '#224870';
    var backgroundColor = '#EAEAEA';
    var vMax = 5;
    var boidSize = 10;
    var showLines = false;

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

    self.setShowLines = function (v) {
        showLines = v;
    };

    self.setBoidColor = function (v) {
        boidColor = v;
    }

    self.setBackgroundColor = function (v) {
        backgroundColor = v;
    }

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
                    sector_coords: [-1, -1]
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

    let drawBoid = function (boid) {
        var right = [boidSize, 0];
        var top = [-boidSize / 2, -boidSize / 2];
        var bottom = [-boidSize / 2, boidSize / 2];

        var x = boid.x;
        var y = boid.y;
        var vx = boid.vx;
        var vy = boid.vy;
        var mag = Math.sqrt(vx * vx + vy * vy);
        var rot;
        if (mag == 0) {
            rot = [
                [1, 0],
                [0, 1]
            ];
        } else {
            rot = [
                [vx / mag, -vy / mag],
                [vy / mag, vx / mag]
            ];
        }

        var r = matmul2x2by2x1(rot, right);
        var t = matmul2x2by2x1(rot, top);
        var b = matmul2x2by2x1(rot, bottom);
        var m = [x, y];
        r = [r[0] + x, r[1] + y];
        t = [t[0] + x, t[1] + y];
        b = [b[0] + x, b[1] + y];

        ctx.fillStyle = boidColor;
        ctx.beginPath();
        ctx.moveTo(boid.x, boid.y);
        ctx.lineTo(r[0], r[1]);
        ctx.lineTo(t[0], t[1]);
        ctx.lineTo(m[0], m[1]);
        ctx.lineTo(b[0], b[1]);
        ctx.lineTo(r[0], r[1]);
        ctx.closePath();
        ctx.fill();
    };

    var drawBoids = function () {
        ctx.fillStyle = backgroundColor;
        ctx.fillRect(0, 0, width, height);
        boids.forEach(drawBoid);
    };

    self.act = function () {
        drawBoids();
        applyRules();
    };

    let getNeighbors = function (boid, sectors) {
        var neighbors = [];
        let [x, y] = boid.sectorCoords;
        for (var j = x - 1; j <= x + 1; j++) {
            for (var k = y - 1; k <= y + 1; k++) {
                if (sectors[j] !== undefined &&
                    sectors[j][k] !== undefined) {
                    var sector = sectors[j][k];

                    for (var q = 0; q < sector.length; q++) {
                        var neighbor = sector[q];

                        var dx = (neighbor.x - boid.x);
                        var dy = (neighbor.y - boid.y);
                        var sqrDist = dx * dx + dy * dy;
                        if (sqrDist <= sqrViewingRadius && boid !== neighbor) {
                            neighbors.push(neighbor);
                        }
                    }
                }
            }
        }
        return neighbors;
    };

    var applyRules = function () {
        ctx.strokeStyle = boidColor;

        if (viewingRadius <= 0) {
            return;
        }
        let invViewingRadius = 1 / viewingRadius;

        var sectors = [];
        boids.forEach(boid => {
            let x = Math.round(boid.x * invViewingRadius);
            let y = Math.round(boid.y * invViewingRadius);
            if (sectors[x] == undefined) {
                sectors[x] = [];
            }
            if (sectors[x][y] === undefined) {
                sectors[x][y] = [boid];
            } else {
                sectors[x][y].push(boid);
            }
            boid.sectorCoords = [x, y];
        });

        boids.forEach(boid => {
            let neighbors = getNeighbors(boid, sectors);

            if (neighbors.length > 0) {
                let [sx, sy] = separationRule(boid, neighbors);
                let [ax, ay] = alignmentRule(boid, neighbors);
                let [cx, cy] = cohesionRule(boid, neighbors);

                boid.ax = sx * separationCoefficient + ax * alignmentCoefficient + cx * cohesionCoefficient;
                boid.ay = sy * separationCoefficient + ay * alignmentCoefficient + cy * cohesionCoefficient;

                if (showLines) {
                    neighbors.forEach(neighbor => {
                        ctx.beginPath();
                        ctx.moveTo(boid.x, boid.y);
                        ctx.lineTo(neighbor.x, neighbor.y);
                        ctx.closePath();
                        ctx.stroke();
                    });
                }
            }
        });

        boids.forEach(boid => {
            boid.vx += boid.ax;
            boid.vy += boid.ay;

            var vx = boid.vx;
            var vy = boid.vy;
            var v_mag = Math.sqrt(vx * vx + vy * vy);
            if (v_mag > vMax) {
                boid.vx = vx / v_mag * vMax;
                boid.vy = vy / v_mag * vMax;
            }

            boid.x += boid.vx;
            boid.y += boid.vy;

            if (boid.x > width + 10) {
                boid.x = -10;
            } else if (boid.x < -10) {
                boid.x = width + 10;
            }

            if (boid.y > height + 10) {
                boid.y = -10;
            } else if (boid.y < -10) {
                boid.y = height + 10;
            }
        })
    };

    var separationRule = function (boid, neighbors) {
        let sx = 0;
        let sy = 0;

        neighbors.forEach(neighbor => {
            let dx = boid.x - neighbor.x;
            let dy = boid.y - neighbor.y;
            let invDist = 1 / Math.sqrt(dx * dx + dy * dy);
            sx += dx * invDist;
            sy += dy * invDist;
        });

        return [sx, sy];
    };

    var alignmentRule = function (boid, neighbors) {
        let mx = neighbors.reduce((total, neighbor) => total + neighbor.vx, 0);
        let my = neighbors.reduce((total, neighbor) => total + neighbor.vy, 0);
        return [mx, my];
    };

    var cohesionRule = function (boid, neighbors) {
        let cx = neighbors.reduce((total, neighbor) => total + neighbor.x, 0) / neighbors.length - boid.x;
        let cy = neighbors.reduce((total, neighbor) => total + neighbor.y, 0) / neighbors.length - boid.y;
        return [cx, cy];
    };

    return self;
};