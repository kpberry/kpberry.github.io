var readability = {};

readability.log_row_count = 0;

readability.log_value = function (title, value, color) {
    var log = document.getElementById('log');

    var row = log.insertRow(readability.log_row_count);
    var titleCell = row.insertCell(0);
    var valueCell = row.insertCell(1);

    titleCell.innerHTML = title;
    if (typeof (value) === 'number') {
        if (isNaN(value)) {
            value = 0;
        } else {
            value = value.toFixed(1);
        }
    }
    valueCell.innerHTML = value;
    if (color) {
        valueCell.classList.add('w3-text-indigo');
        titleCell.classList.add('w3-text-indigo');
    }

    readability.log_row_count += 1;
};

readability.clear_log = function () {
    var log = document.getElementById('log');
    while (log.firstChild) {
        log.removeChild(log.firstChild);
    }
    readability.log_row_count = 0;
};

readability.analyze = function (str) {
    var letters = readability.alphanum_count(str);
    var syllables = readability.syllable_count(str);
    var sentences = readability.sentence_count(str) || 1;
    var words = readability.word_count(str);
    var complex_words = readability.complex_word_count(str);
    var gt3_syllable_words = readability.range_syllable_word_count(str, 3, 10000);

    readability.clear_log();

    readability.log_value('Flesch Reading ease',
        readability.flesch_reading_ease(words, sentences, syllables));
    readability.log_value('Automated Readability Index',
        readability.automated_readability_index(words, letters, sentences));

    readability.log_value('', '');

    var fgl = readability.flesch_grade_level(words, sentences, syllables);
    var gfi = readability.gunning_fog_index(words, sentences, complex_words);
    var cli = readability.coleman_liau_index(words, letters, sentences);
    var s = readability.smog(gt3_syllable_words, sentences);

    readability.log_value('Flesch-Kincaid Grade Level', fgl);
    readability.log_value('Gunning Fog Index', gfi);
    readability.log_value('Coleman-Liau Index', cli);
    readability.log_value('SMOG', s);
    readability.log_value('Average Grade Level', (fgl + gfi + cli + s) / 4.0, true);

    readability.log_value('', '');

    readability.log_value('Letters', letters);
    readability.log_value('Syllables', syllables);
    readability.log_value('Sentences', sentences);
    readability.log_value('Words', words);
    readability.log_value('Complex words', complex_words);
    readability.log_value('3 or More Syllable Words', gt3_syllable_words);
};

readability.alphanum_count = function (str) {
    var count = 0;
    for (var i = 0; i < str.length; i++) {
        if (readability.is_letter(str[i]) || readability.is_num(str[i])) {
            count += 1;
        }
    }

    return count;
};

readability.sentence_count = function (str) {
    var count = 0;
    var sentence = false;
    var len = str.length;

    for (var i = 0; i < len; i++) {
        if (sentence && readability.is_terminator(str[i])) {
            if (!(i > 0 && readability.is_num(str[i - 1]) && i < len - 1 && readability.is_num(str[i + 1]))) {
                count += 1;
                sentence = false;
            }
        } else if (readability.is_letter(str[i]) || readability.is_num(str[i])) {
            sentence = true;
        }
    }

    return count + (sentence ? 1 : 0);
};

readability.word_count = function (str) {
    return str.trim().replace(/[0-9.,\/#!?$%\^&\*;:{}=\-_`~()]/g, '').split(/\s+/g).length;
};

readability.complex_word_count = function (str) {
    return readability.range_syllable_word_count(str, 3, 10000);
};

readability.syllable_count = function (str) {
    return syllable_counter.getSyllableCount(str);
};

readability.range_syllable_word_count = function (str, low, up) {
    var total = 0;
    var counts = syllable_counter.getSyllableCounts(str);
    for (var i = 0; i < counts.length; i++) {
        if (counts[i] >= low && counts[i] <= up) {
            total++;
        }
    }
    return total;
};

readability.is_vowel = function (c) {
    c = readability.to_lower(c);
    return c === 'a' || c === 'e' || c === 'i' || c === 'o' || c === 'u' || c === 'y';
};

readability.is_num = function (c) {
    return c >= '0' && c <= '9';
};


readability.is_terminator = function (c) {
    return c === '.' || c === '!' || c === '?' || c === '\n';
};

readability.is_letter = function (c) {
    return c >= 'a' && c <= 'z' || c >= 'A' && c <= 'Z';
};

readability.to_lower = function (c) {
    return (c <= 'Z') ? c + 32 : c;
};

readability.flesch_reading_ease = function (words, sentences, syllables) {
    return 206.835 - 1.015 * words / sentences - 84.6 * syllables / words;
};

readability.flesch_grade_level = function (words, sentences, syllables) {
    return 0.39 * words / sentences + 11.8 * syllables / words - 15.59;
};

readability.gunning_fog_index = function (words, sentences, complex_words) {
    return 0.4 * (words / sentences + 100.0 * complex_words / words);
};

readability.coleman_liau_index = function (words, letters, sentences) {
    return 5.88 * letters / words - 29.6 * sentences / words - 15.8;
};

readability.automated_readability_index = function (words, letters, sentences) {
    return 4.71 * letters / words + 0.5 * words / sentences - 21.43;
};

readability.smog = function (complex_words, sentences) {
    return 1.043 * Math.sqrt(complex_words * 30.0 / sentences) + 3.1291;
};