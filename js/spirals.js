var spirals = {};

spirals.corner = function (center, outRadius, i, n, rotation) {
    var angle = (2 * Math.PI / n) * (i - 0.5);
    rotation = rotation || 0;
    return {
        'x': center['x'] + outRadius * Math.cos(angle + rotation),
        'y': center['y'] + outRadius * Math.sin(angle + rotation)
    };
};

spirals.polygon = function (x, y, n, radius) {
    var self = {
        "x": x,
        "y": y,
        "n": n,
        "r": radius,
        "R": 2 / Math.sqrt(3) * radius
    };

    self.draw = function (ctx, fill) {
        ctx.beginPath();
        ctx.moveTo(self.x, self.y);
        var center = { "x": self.x, "y": self.y };
        // first triangle has to have nonzero width
        for (var i = -1; i < self.n; i++) {
            var p = spirals.corner(center, self.R, i, self.n);
            ctx.lineTo(p.x, p.y);
        }
        ctx.closePath();
        ctx.fillStyle = fill;
        ctx.fill();
    }

    return self;
};

spirals.hexagon = function (x, y, radius) {
    var self = spirals.polygon(x, y, 6, radius);
    self.w = self.r * 2;
    self.h = self.R * 2;

    self.neighbor = function (direction) {
        direction %= 6;
        var x = self.x;
        var y = self.y;
        if (direction == 0) {
            x += self.w;
        } else if (direction == 1) {
            x += self.r;
            y -= self.h * 0.75;
        } else if (direction == 2) {
            x -= self.r;
            y -= self.h * 0.75;
        } else if (direction == 3) {
            x -= self.w;
        } else if (direction == 4) {
            x -= self.r;
            y += self.h * 0.75;
        } else {
            x += self.r;
            y += self.h * 0.75;
        }
        return spirals.hexagon(x, y, self.r);
    };

    return self;
};

spirals.square = function (x, y, radius) {
    var self = spirals.polygon(x, y, 4, radius);
    self.w = radius * 2;
    self.h = self.w;

    self.neighbor = function (direction) {
        direction %= 4;
        var x = self.x;
        var y = self.y;
        if (direction == 0) {
            x += self.w;
        } else if (direction == 1) {
            y -= self.h;
        } else if (direction == 2) {
            x -= self.w;
        } else if (direction == 3) {
            y += self.h;
        }
        return spirals.square(x, y, self.r);
    };

    return self;
}

spirals.spiral = function (values, colors, x, y, radius, ring) {
    self = {
        "x": x,
        "y": y,
        "r": radius,
        "values": values,
        "color": colors,
        "ring": ring
    };

    self.ring = function (radius) {
        throw Error('Method "ring" is not implemented by base spiral class.');
    };

    self.rings = function (count) {
        var result = [];
        for (var i = 0; result.length < count; i++) {
            result.push(...self.ring(i));
        }
        return result;
    };

    self.draw = function (ctx) {
        var polygons = self.rings(values.length);
        for (var i = 0; i < values.length && i < colors.length; i++) {
            polygons[i].draw(ctx, colors[i]);
        }
    };

    return self;
};

spirals.hexSpiral = function (values, colors, x, y, inRadius) {
    var self = spirals.spiral(values, colors, x, y, inRadius);
    self.R = 2 / Math.sqrt(3) * inRadius;
    self.w = self.r * 2;
    self.h = self.R * 2;

    self.ring = function (radius) {
        if (radius == 0) {
            return [spirals.hexagon(self.x, self.y, self.r)];
        }

        var result = [];
        var cur = spirals.hexagon(self.x + self.w * radius, self.y, self.r);
        for (var i = 2; i < 8; i++) {
            var limit = i == 6 ? radius + 1 : radius;
            for (var r = 0; r < limit; r++) {
                result.push(cur);
                cur = cur.neighbor(i);
            }
        }

        return result;
    };

    return self;
};

spirals.squareSpiral = function (values, colors, x, y, radius) {
    var self = spirals.spiral(values, colors, x, y, radius);
    self.w = self.r * 2;
    self.h = self.w;

    self.ring = function(radius) {
        var cur = spirals.square(self.x + self.w * radius, 
                                 self.y + self.h * Math.max((radius - 1), 0),
                                 self.r);
        var result = [cur];
        for (var i = 1; i < 5; i++) {
            var limit = i == 1 ? radius * 2 - 1 : radius * 2;
            for (var r = 0; r < limit; r++) {
                cur = cur.neighbor(i);
                result.push(cur);
            }
        }
        return result;
    };

    return self;
};