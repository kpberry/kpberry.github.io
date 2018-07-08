var syllable_counter = {};

syllable_counter.cache = {};

syllable_counter.MLPRegressor = function (hidden, layers, weights, bias) {
    this.hidden = hidden.toUpperCase();
    this.network = new Array(layers.length + 1);
    for (var i = 0, l = layers.length; i < l; i++) {
        this.network[i + 1] = new Array(layers[i]).fill(0.);
    }
    this.weights = weights;
    this.bias = bias;

    var compute = function (activation, v, nLayers) {
        switch (activation) {
            case 'LOGISTIC':
                if (nLayers > 1) {
                    for (var i = 0, l = v.length; i < l; i++) {
                        v[i] = 1. / (1. + Math.exp(-v[i]));
                    }
                } else {
                    for (var i = 0, l = v.length; i < l; i++) {
                        if (v[i] > 0) {
                            v[i] = -Math.log(1. + Math.exp(-v[i]));
                        } else {
                            v[i] = v[i] - Math.log(1. + Math.exp(-v[i]));
                        }
                    }
                }
                break;
            case 'RELU':
                for (var i = 0, l = v.length; i < l; i++) {
                    v[i] = Math.max(0, v[i]);
                }
                break;
            case 'TANH':
                for (var i = 0, l = v.length; i < l; i++) {
                    v[i] = Math.tanh(v[i]);
                }
                break;
            case 'SOFTMAX':
                var max = Number.NEGATIVE_INFINITY;
                for (var i = 0, l = v.length; i < l; i++) {
                    if (v[i] > max) {
                        max = v[i];
                    }
                }
                for (var i = 0, l = v.length; i < l; i++) {
                    v[i] = Math.exp(v[i] - max);
                }
                var sum = 0.0;
                for (var i = 0, l = v.length; i < l; i++) {
                    sum += v[i];
                }
                for (var i = 0, l = v.length; i < l; i++) {
                    v[i] /= sum;
                }
                break;
        }
        return v;
    };

    this.predict = function (neurons) {
        this.network[0] = neurons;

        for (var i = 0; i < this.network.length - 1; i++) {
            for (var j = 0; j < this.network[i + 1].length; j++) {
                for (var l = 0; l < this.network[i].length; l++) {
                    this.network[i + 1][j] += this.network[i][l] * this.weights[i][l][j];
                }
                this.network[i + 1][j] += this.bias[i][j];
            }
            if ((i + 1) < (this.network.length - 1)) {
                this.network[i + 1] = compute(this.hidden, this.network[i + 1], this.network.length);
            }
        }

        if (this.network[this.network.length - 1].length > 1) {
            return this.network[this.network.length - 1];
        }
        return this.network[this.network.length - 1][0];
    };

};

syllable_counter.getWindows = function (sequence, window_sizes) {
    var result = [];
    for (var window_size = window_sizes[0];
        window_size < window_sizes[1] + 1;
        window_size++) {
        for (var i = 0; i < sequence.length - (window_size - 1); i++) {
            result.push(sequence.slice(i, i + window_size));
        }
    }
    return result;
}

syllable_counter.toOneHot = function (word, mapping) {
    var result = new Array(Object.keys(mapping).length).fill(0);
    var windows = syllable_counter.getWindows(word.toLowerCase(), [1, 2])
    for (var i = 0; i < windows.length; i++) {
        if (mapping[windows[i]] !== undefined) {
            result[mapping[windows[i]]]++;
        }
    }
    return result;
}

syllable_counter.getSyllableCountForWord = function (word) {
    if (syllable_counter.cache[word] === undefined) {
        var mlp = new syllable_counter.MLPRegressor(
            'relu',
            syllable_counter_vars.layers,
            syllable_counter_vars.weights,
            syllable_counter_vars.bias
        );
        var features = syllable_counter.toOneHot(
            word, syllable_counter_vars.mapping
        );
        var count = Math.max(Math.round(mlp.predict(features)), 1);
        syllable_counter.cache[word] = count;
    }
    return syllable_counter.cache[word];
}

syllable_counter.getSyllableCounts = function (text) {
    var splitText = text.replace(/[0-9.,\/#!?$%\^&\*;:{}=\-_`~()]/g, '').trim().split(/\s+/g);
    var counts = [];
    for (var i = 0; i < splitText.length; i++) {
        counts.push(syllable_counter.getSyllableCountForWord(splitText[i]));
    }
    return counts;
}

syllable_counter.getSyllableCount = function (text) {
    var total = 0;
    var counts = syllable_counter.getSyllableCounts(text);
    for (var i = 0; i < counts.length; i++) {
        total += counts[i];
    }
    return total;
}