var readability = {};

readability.logRowCount = 0;
readability.syllableCache = {};

readability.logValue = function (title, value, type, color) {
    var log = document.getElementById('log');

    var row = log.insertRow(readability.logRowCount);
    var titleCell = row.insertCell(0);
    var valueCell = row.insertCell(1);

    titleCell.innerHTML = title;
    if (type === 'float') {
        if (isNaN(value) || !isFinite(value)) {
            value = '';
        } else {
            value = value.toFixed(1);
        }
    } else if (type === 'int') {
        if (isNaN(value) || !isFinite(value)) {
            value = '';
        } else {
            value = Math.round(value);
        }
    }
    valueCell.innerHTML = value;
    if (color) {
        valueCell.classList.add('w3-text-indigo');
        titleCell.classList.add('w3-text-indigo');
    }

    readability.logRowCount += 1;
};

readability.clearLog = function () {
    var log = document.getElementById('log');
    while (log.firstChild) {
        log.removeChild(log.firstChild);
    }
    readability.logRowCount = 0;
};

readability.analyze = function (str) {
    var letters = readability.alphanumCount(str);
    var syllables = readability.syllableCount(str);
    var sentences = readability.sentenceCount(str);
    var words = readability.wordCount(str);
    var complexWords = readability.complexWordCount(str);
    var gt3SyllableWords = readability.greaterThanNSyllableWordCount(str, 3);

    readability.clearLog();

    var fre = readability.fleschReadingEase(words, sentences, syllables);
    var ari = readability.automatedReadabilityIndex(words, letters, sentences);

    readability.logValue('Flesch Reading ease', fre, 'float');
    readability.logValue('Automated Readability Index', ari, 'float');

    readability.logValue('', '');

    var fgl = readability.fleschGradeLevel(words, sentences, syllables);
    var gfi = readability.gunningFogIndex(words, sentences, complexWords);
    var cli = readability.colemanLiauIndex(words, letters, sentences);
    var s = readability.smog(gt3SyllableWords, sentences);

    var average = (fgl + gfi + cli + s) / 4.0;

    readability.logValue('Flesch-Kincaid Grade Level', fgl, 'float');
    readability.logValue('Gunning Fog Index', gfi, 'float');
    readability.logValue('Coleman-Liau Index', cli, 'float');
    readability.logValue('SMOG', s, 'float');
    readability.logValue('Average Grade Level', average, 'float', true);

    readability.logValue('', '');

    readability.logValue('Letters', letters, 'int');
    readability.logValue('Syllables', syllables, 'int');
    readability.logValue('Sentences', sentences, 'int');
    readability.logValue('Words', words, 'int');
    readability.logValue('Complex words', complexWords, 'int');
    readability.logValue('3 or More Syllable Words', gt3SyllableWords, 'int');
};

readability.alphanumCount = function (str) {
    return str.replace(/\W/g, '').length;
};

readability.getWords = function (str) {
    return str.replace(/'/g, '').split(/\W+/g)
        .filter(function (w) { return w.search(/[a-zA-Z]/) >= 0; });
}

readability.wordCount = function (str) {
    return readability.getWords(str).length;
};

readability.sentenceCount = function (str) {
    return str.split(/[.?!]\s*/g)
        .filter(function (s) { return readability.wordCount(s) > 0; }).length;
};

readability.complexWordCount = function (str) {
    return readability.greaterThanNSyllableWordCount(str, 3);
};

readability.getWindows = function (sequence, windowSizes) {
    var result = [];
    for (var w = windowSizes[0]; w < windowSizes[1] + 1; w++) {
        for (var i = 0; i < sequence.length - (w - 1); i++) {
            result.push(sequence.slice(i, i + w));
        }
    }
    return result;
}

readability.toOneHot = function (word, mapping) {
    var result = new Array(Object.keys(mapping).length).fill(0);
    var windows = readability.getWindows(word.toLowerCase(), [1, 2])
    for (var i = 0; i < windows.length; i++) {
        if (mapping[windows[i]] !== undefined) {
            result[mapping[windows[i]]]++;
        }
    }
    return result;
}

readability.getSyllableCountForWord = function (word) {
    if (readability.syllableCache[word] === undefined) {
        var mlp = new readability.MLPRegressor(
            'relu',
            syllable_counter_vars.layers,
            syllable_counter_vars.weights,
            syllable_counter_vars.bias
        );
        var features = readability.toOneHot(
            word, syllable_counter_vars.mapping
        );
        var count = Math.max(Math.round(mlp.predict(features)), 1);
        readability.syllableCache[word] = count;
    }
    return readability.syllableCache[word];
}

readability.getSyllableCounts = function (text) {
    var words = readability.getWords(text);
    var counts = [];
    for (var i = 0; i < words.length; i++) {
        counts.push(readability.getSyllableCountForWord(words[i]));
    }
    return counts;
}

readability.syllableCount = function (text) {
    var total = 0;
    var counts = readability.getSyllableCounts(text);
    for (var i = 0; i < counts.length; i++) {
        total += counts[i];
    }
    return total;
}

readability.greaterThanNSyllableWordCount = function (str, n) {
    return readability.getSyllableCounts(str)
        .filter(function (c) { return c >= n; }).length;
};

readability.fleschReadingEase = function (words, sentences, syllables) {
    return 206.835 - 1.015 * words / sentences - 84.6 * syllables / words;
};

readability.fleschGradeLevel = function (words, sentences, syllables) {
    return 0.39 * words / sentences + 11.8 * syllables / words - 15.59;
};

readability.gunningFogIndex = function (words, sentences, complex_words) {
    return 0.4 * (words / sentences + 100.0 * complex_words / words);
};

readability.colemanLiauIndex = function (words, letters, sentences) {
    return 5.88 * letters / words - 29.6 * sentences / words - 15.8;
};

readability.automatedReadabilityIndex = function (words, letters, sentences) {
    return 4.71 * letters / words + 0.5 * words / sentences - 21.43;
};

readability.smog = function (complexWords, sentences) {
    return 1.043 * Math.sqrt(complexWords * 30.0 / sentences) + 3.1291;
};

readability.MLPRegressor = function (hidden, layers, weights, bias) {

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