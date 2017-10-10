/**
 * Created by kpberry on 10/9/17.
 */

var graphing = {};

graphing.graph = function (target, fn, xlim, ylim) {
    fn = fn || function () {
            return 1;
        };
    var svg = d3.select(target);
    svg.attr('transform', 'scale(1, -1)');

    var width = parseInt(svg.style('width'));
    var height = parseInt(svg.style('height'));

    xlim = xlim || [-5, 5];
    ylim = ylim || [-5, 5];

    var x_scale = width / (xlim[1] - xlim[0]);
    var y_scale = height / (ylim[1] - ylim[0]);

    var clear = function() {
        svg.selectAll('*').remove();
    };

    var drawField = function (steps, uniform) {
        steps = steps || 20;

        var x_step = (xlim[1] - xlim[0]) / steps;
        var y_step = (ylim[1] - ylim[0]) / steps;

        var data = [];
        var x_norm = width / steps / 3;
        var y_norm = height / steps / 3;
        for (var x = xlim[0]; x <= xlim[1]; x += x_step) {
            for (var y = ylim[0]; y <= ylim[1]; y += y_step) {
                var dy = fn(x, y) * x_step * y_norm;
                var dx = x_step * x_norm;
                if (uniform) {
                    var mag = Math.sqrt(dy * dy + dx * dx);
                    dx = dx / mag * width / steps / 3;
                    dy = dy / mag * height / steps / 3;
                }
                data.push([x, y, dx, dy]);
            }
        }

        svg.selectAll('field' + Math.round(10000 * Math.random()))
            .data(data)
            .enter()
            .append('line')
            .attr('x1', function (d) {
                return (d[0] - xlim[0]) * x_scale - d[2];
            }).attr('y1', function (d) {
            return (d[1] - ylim[0]) * y_scale - d[3];
        }).attr('x2', function (d) {
            return (d[0] - xlim[0]) * x_scale + d[2];
        }).attr('y2', function (d) {
            return (d[1] - ylim[0]) * y_scale + d[3];
        }).style('stroke', 'black')
    };

    var drawSlopeField = function (steps) {
        drawField(steps, false);
    };

    var drawDirectionField = function (steps) {
        drawField(steps, true);
    };

    var drawEulerApprox = function (start, steps, step, improved) {
        steps = steps || 50;
        step = step || 0.1;

        start = start || [0, 0];
        var data = [[start[0], start[1], start[0], start[1], 0]];

        for (var i = 0; i < steps; i++) {
            var cur = data[i];
            var dy;
            if (improved) {
                var f = fn(cur[0], cur[1]);
                dy = (f + fn(cur[0] + f * step, cur[1] + step)) * step / 2;
            } else {
                dy = fn(cur[0], cur[1]) * step;
            }
            data.push([cur[0] + step, cur[1] + dy, cur[0], cur[1], dy]);
        }

        svg.selectAll('eulerapprox' + Math.round(10000 * Math.random()))
            .data(data)
            .enter()
            .append('line')
            .attr('x1', function (d) {
                return (d[0] - xlim[0]) * x_scale;
            })
            .attr('y1', function (d) {
                return (d[1] - ylim[0]) * y_scale;
            })
            .attr('x2', function (d) {
                return (d[2] - xlim[0]) * x_scale;
            })
            .attr('y2', function (d) {
                return (d[3] - ylim[0]) * y_scale;
            })
            .style('stroke', function (d) {
                return 'rgb(' + Math.round(d[4] / step * 255) + ',0,'
                    + (-Math.round(d[4] / step * 255)) + ')';
            });
    };

    var drawExactFunction = function (start, steps, step, fn) {
        steps = steps || 50;
        step = step || 0.1;

        start = start || [0, 1];
        var data = [[start[0], start[1], start[0], start[1], 0]];

        for (var i = 0; i < steps; i++) {
            var cur = data[i];
            var y = fn(cur[0] + step);
            console.log(y);
            data.push([cur[0] + step, y, cur[0], cur[1], y - cur[1]]);
        }

        svg.selectAll('fn' + Math.round(10000 * Math.random()))
            .data(data)
            .enter()
            .append('line')
            .attr('x1', function (d) {
                return (d[0] - xlim[0]) * x_scale;
            })
            .attr('y1', function (d) {
                return (d[1] - ylim[0]) * y_scale;
            })
            .attr('x2', function (d) {
                return (d[2] - xlim[0]) * x_scale;
            })
            .attr('y2', function (d) {
                return (d[3] - ylim[0]) * y_scale;
            })
            .style('stroke', function (d) {
                return 'rgb(' + Math.round(d[4] / step * 255) + ',0,'
                    + (-Math.round(d[4] / step * 255)) + ')';
            });
    };

    document.getElementById(target.replace('#', '')).onclick
        = function (evt) {
        var e = evt.target;
        var dim = e.getBoundingClientRect();
        var x = evt.clientX - dim.left;
        var y = dim.bottom - evt.clientY;
        x = xlim[0] + x / x_scale;
        y = ylim[0] + y / y_scale;
        drawEulerApprox([x, y], 200, 0.1, true);
    };

    return {
        drawDirectionField: drawDirectionField,
        drawSlopeField: drawSlopeField,
        drawEulerApprox: drawEulerApprox,
        drawExactFunction: drawExactFunction,
        clear: clear
    };
};