var particle_system = function (ctx, reduction) {
    self = {};

    var particles = [];
    var springs = [];

    self.add_particle = function (p) {
        for (var i = 0; i < particles.length; i++) {
            particles[i].add_external_fields(p.get_internal_fields());
            p.add_external_fields(particles[i].get_internal_fields());
        }
        particles.push(p);
    };

    self.add_spring = function (i, j, length, spring_constant) {
        var spring1 = fields.spring(particles[i], length, spring_constant);
        particles[j].add_external_field(spring1);

        var spring2 = fields.spring(particles[j], length, spring_constant);
        particles[i].add_external_field(spring2);
    };

    self.act = function () {
        ctx.clearRect(0, 0, 1000, 1000);
        for (var p = 0; p < particles.length; p++) {
            particles[p].act(ctx, reduction);
        }
        for (i = 0; i < particles.length; i++) {
            particles[i].update_position();
        }
    };

    return self;
}