var fields = {};
var G = 6.673e-11;
var K = 8.99e9;
var C = 1;

fields.base_field = function (source, calc_force_mag, visible) {
    var self = {visible: visible};

    self.get_pos = function () {
        return source.get_pos();
    };

    self.get_dist = function (target) {
        var p1 = source.get_pos();
        var p2 = target.get_pos();
        return Math.max(1e-9, Math.sqrt(
            (p1[0] - p2[0]) * (p1[0] - p2[0]) +
            (p1[1] - p2[1]) * (p1[1] - p2[1]) +
            (p1[2] - p2[2]) * (p1[2] - p2[2])
        ));
    };

    self.get_dir = function (target, dist) {
        var p1 = source.get_pos();
        var p2 = target.get_pos();
        return [
            (p2[0] - p1[0]) / dist,
            (p2[1] - p1[1]) / dist,
            (p2[2] - p1[2]) / dist,
        ];
    };

    self.calc_force = function (target) {
        var dist = self.get_dist(target);
        var mag = calc_force_mag(target, dist);
        var dir = self.get_dir(target, dist);
        return [dir[0] * mag, dir[1] * mag, dir[2] * mag];
    };

    self.display = function (ctx, target, stroke_style) {
        ctx.beginPath();
        ctx.strokeStyle = stroke_style || 'black';
        var p1 = target.get_pos();
        var force = self.calc_force(target);
        var p2 = [p1[0] + force[0], p1[1] + force[1], p1[2] + force[2]];
        ctx.moveTo(p1[0], p1[1]);
        ctx.lineTo(p2[0], p2[1]);
        ctx.stroke();
        ctx.closePath();
    };

    return self;
}

fields.gravitational = function (source) {
    return fields.base_field(source, function (target, dist) {
        return -G * source.get_mass() * target.get_mass() / (dist * dist);
    }, false);
};

fields.electrical = function (source) {
    return fields.base_field(source, function (target, dist) {
        return K * source.get_charge() * target.get_charge() / (dist * dist);
    }, false);
};

fields.love = function (source) {
    return fields.base_field(source, function (target, dist) {
        return -C * source.get_charm() * target.get_charm() * (dist * dist);
    }, false);
};

fields.drag = function (damping) {
    var base = fields.base_field(undefined, function(target, dist) {
        var v = target.get_vel();
        return -damping * Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2]);
    }, false);

    base.get_dist = function() {
        return -1;
    }

    base.get_dir = function(target) {
        return target.get_vel();
    }

    return base;
};

fields.spring = function (source, length, k) {
    var base = fields.base_field(source, function (target, dist) {
        return (length - dist) * k;
    }, true);

    base.display = function (ctx, target, stroke_style) {
        ctx.beginPath();
        ctx.strokeStyle = stroke_style || 'black';
        var p1 = source.get_pos();
        var p2 = target.get_pos();
        ctx.moveTo(p1[0], p1[1]);
        ctx.lineTo(p2[0], p2[1]);
        ctx.stroke();
        ctx.closePath();
    };

    return base;
};