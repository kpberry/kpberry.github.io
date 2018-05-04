var particles = {};

//focal length of the human eye is 22mm
particles.focal_length = 220;

particles.particle = function (properties) {
    var pos = properties['pos'] || [0, 0, 0];
    var vel = properties['vel'] || [0, 0, 0];

    var mass = properties['mass'] || 1;
    var charge = properties['charge'] || 0;
    var charm = properties['charm'] || 0;

    var self = {
        get_pos: function () {
            return pos;
        },
        get_vel: function () {
            return vel;
        },
        get_mass: function () {
            return mass;
        },
        get_charge: function () {
            return charge;
        },
        get_charm: function () {
            return charm;
        },
    };

    var external_fields = [];
    var internal_fields = [
        fields.gravitational(self),
        fields.electrical(self),
        fields.love(self)
    ];

    self.get_external_fields = function () {
        return external_fields;
    };

    self.get_internal_fields = function () {
        return internal_fields;
    };

    var trail = properties['trail'] || 0;
    var size = properties['size'] || 10;

    var prev_locs = [];
    var temp_pos = pos;
    var temp_vel = vel;

    var color = 'rgb(' + Math.round(charge * 1e9) +
        ',' + Math.round(charm * 1e5) +
        ',' + Math.round(-charge * 1e9) + ')';


    self.add_internal_field = function (field) {
        internal_fields.push(field);
    }

    self.add_internal_fields = function (fields) {
        for (var i = 0; i < fields.length; i++) {
            self.add_internal_field(fields[i]);
        }
    }

    self.add_external_field = function (field) {
        external_fields.push(field);
    };

    self.add_external_fields = function (fields) {
        for (var i = 0; i < fields.length; i++) {
            self.add_external_field(fields[i]);
        }
    };

    var accelerate = function (reduction) {
        temp_vel = vel;
        for (var i = 0; i < external_fields.length; i++) {
            var force = external_fields[i].calc_force(self);
            temp_vel = [
                temp_vel[0] + force[0] / mass,
                temp_vel[1] + force[1] / mass,
                temp_vel[2] + force[2] / mass
            ];
        }
        vel = temp_vel;
    };

    var move = function (reduction) {
        reduction = reduction || 1;
        temp_pos = [
            pos[0] + vel[0] / reduction,
            pos[1] + vel[1] / reduction,
            pos[2] + vel[2] / reduction
        ];
    };

    var display = function (ctx) {
        var visual_size = particles.focal_length / pos[2] * size;
        if (visual_size < 100 && visual_size > 0.1) {
            ctx.strokeStyle = color;
            ctx.beginPath();
            ctx.arc(pos[0], pos[1], visual_size, 0, Math.PI * 2);
            ctx.stroke();
            ctx.closePath();

            ctx.beginPath();
            ctx.moveTo(pos[0], pos[1]);
            for (var i = prev_locs.length - 1; i >= 0; i--) {
                ctx.lineTo(prev_locs[i][0], prev_locs[i][1]);
            }
            ctx.stroke();
            ctx.closePath();

            for (var i = 0; i < external_fields.length; i++) {
                if (external_fields[i].visible) {
                    external_fields[i].display(ctx, self);
                }
            }
        }
    };

    self.act = function (ctx, reduction) {
        accelerate(reduction);
        move(reduction);
        display(ctx);
    };

    self.update_position = function () {
        if (prev_locs.length > trail) {
            prev_locs.shift();
        }
        prev_locs.push(pos);
        pos = temp_pos;
        for (var i = 0; i < internal_fields.length; i++) {
            internal_fields[i].pos = pos;
        }
    };

    return self;
};