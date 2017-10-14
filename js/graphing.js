/**
 * Created by kpberry on 10/9/17.
 */

var graphing = {};

graphing.graph = function (target, fn_y, fn_x, xlim, ylim) {
    fn_y = fn_y || function () {
            return 1;
        };
    fn_x = fn_x || function () {
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

    var clear = function () {
        svg.selectAll('*').remove();
    };

    var getSlopeColorFn = function (step) {
        return function (d) {
            var c = Math.round((d['y2'] - d['y1']) * 255 / step);
            return 'rgb(' + c + ',0,' + (-c) + ')';
        }
    };

    var plotLines = function (lines, color_fn) {
        color_fn = color_fn || 'black';
        var x1_fn = function (d) {
            return (d['x1'] - xlim[0]) * x_scale
        };
        var y1_fn = function (d) {
            return (d['y1'] - ylim[0]) * y_scale;
        };
        var x2_fn = function (d) {
            return (d['x2'] - xlim[0]) * x_scale;
        };
        var y2_fn = function (d) {
            return (d['y2'] - ylim[0]) * y_scale;
        };

        //TODO make this work with arrows
        svg.selectAll('chart' + Math.round(100000 * Math.random()))
            .data(lines)
            .enter()
            .append('line')
            .attr('x1', x1_fn)
            .attr('y1', y1_fn)
            .attr('x2', x2_fn)
            .attr('y2', y2_fn)
            .style('stroke', color_fn);
    };

    var drawField = function (steps, uniform) {
        steps = steps || 20;

        var x_step = (xlim[1] - xlim[0]) / steps;
        var y_step = (ylim[1] - ylim[0]) / steps;

        var data = [];
        var t_step = Math.sqrt(x_step * x_step + y_step * y_step);
        for (var x = xlim[0]; x <= xlim[1]; x += x_step) {
            for (var y = ylim[0]; y <= ylim[1]; y += y_step) {
                var dx = fn_x(x, y);
                var dy = fn_y(x, y);
                if (uniform) {
                    var mag = Math.sqrt(dy * dy + dx * dx);
                    dx = dx / mag;
                    dy = dy / mag;
                }
                dx *= t_step / 4;
                dy *= t_step / 4;
                data.push({
                    'x1': x - dx, 'y1': y - dy, 'x2': x + dx, 'y2': y + dy
                });
            }
        }

        plotLines(data);
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
        var data = [{
            'x1': start[0],
            'y1': start[1],
            'x2': start[0],
            'y2': start[1]
        }];

        for (var i = 0; i < steps; i++) {
            var dx, dy;
            var x = data[i]['x2'];
            var y = data[i]['y2'];
            if (improved && !improved) {
                var fy = fn_y(x, y);
                var fx = fn_x(x, y);
                dx = (fx + fn_x(x + fx * step, y + step)) * step / 2;
                dy = (fy + fn_y(x + fy * step, y + step)) * step / 2;
            } else {
                dx = fn_x(x, y) * step;
                dy = fn_y(x, y) * step;
            }
            data.push({'x1': x, 'y1': y, 'x2': x + dx, 'y2': y + dy});
        }

        plotLines(data, getSlopeColorFn(step));
    };

    var drawComponentPlot = function (start, steps, step) {
        steps = steps || 500;
        step = step || 0.1;

        start = start || [0, 0, 0];
        console.log(start);
        var t0 = start[2];
        var data1 = [{'x1': t0, 'x2': t0, 'y1': start[0], 'y2': start[0]}];
        var data2 = [{'x1': t0, 'x2': t0, 'y1': start[1], 'y2': start[1]}];

        for (var i = 0; i < steps; i++) {
            var x = data1[i]['y2'];
            var y = data2[i]['y2'];
            var t = t0 + i * step;
            var dx = fn_x(x, y, t) * step;
            var dy = fn_y(x, y, t) * step;
            //noinspection JSSuspiciousNameCombination
            data1.push({'x1': t, 'x2': t + step, 'y1': x, 'y2': x + dx});
            data2.push({'x1': t, 'x2': t + step, 'y1': y, 'y2': y + dy});
        }

        plotLines(data1, getSlopeColorFn(step));
        plotLines(data2, getSlopeColorFn(step));

    };

    var drawExactFunction = function (start, steps, step, fn) {
        steps = steps || 50;
        step = step || 0.1;

        start = start || [0, 1];
        var data = [{
            'x1': start[0],
            'y1': start[1],
            'x2': start[0],
            'y2': start[1]
        }];

        for (var i = 0; i < steps; i++) {
            var x = data[i]['x2'];
            var y = fn(x + step);
            data.push({'x1': x, 'x2': x + step, 'y1': data[i]['y2'], 'y2': y});
        }

        plotLines(data, getSlopeColorFn(step));
    };

    return {
        drawDirectionField: drawDirectionField,
        drawSlopeField: drawSlopeField,
        drawEulerApprox: drawEulerApprox,
        drawExactFunction: drawExactFunction,
        drawComponentPlot: drawComponentPlot,
        clear: clear,
        get_xlim: function () {
            return xlim;
        },
        get_ylim: function () {
            return ylim;
        },
        get_x_scale: function () {
            return x_scale;
        },
        get_y_scale: function () {
            return y_scale;
        }
    };
};