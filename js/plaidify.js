var plaidify = {};

plaidify.loadImageAsURL = function (input, target) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();

        reader.onload = function (e) {
            var uploaded = document.getElementById(target);
            uploaded.setAttribute('src', e.target.result);

            uploaded.setAttribute('width', input.files[0].width + 'px');
            uploaded.setAttribute('height', input.files[0].height + 'px');
        };

        reader.readAsDataURL(input.files[0]);
    }
};

plaidify.plaidify = function (source, plaid) {
    var sourceElement = document.getElementById(source);
    var plaidElement = document.getElementById(plaid);

    var canv = document.getElementById('canv');
    var ctx = canv.getContext('2d');

    if (plaidElement.complete && sourceElement.complete
        && plaidElement.naturalWidth !== 0 && sourceElement.naturalWidth !== 0) {

        canv.setAttribute('width', sourceElement.width);
        canv.setAttribute('height', sourceElement.height);

        ctx.drawImage(sourceElement, 0, 0);
        var sourceImage = ctx.getImageData(0, 0, canv.width, canv.height);

        //automatically crops the plaid to be the same size as the source image
        ctx.drawImage(plaidElement, 0, 0);
        var plaidImage = ctx.getImageData(0, 0, canv.width, canv.height);

        var plaidIntensity = document.getElementById('intensity').value || 0.5;
        var plaidThreshold = document.getElementById('threshold').value || 127;

        sourceImage.data = plaidify._plaidify(sourceImage, plaidImage, plaidThreshold, plaidIntensity);
        ctx.putImageData(sourceImage, 0, 0);
    }
};

plaidify.lerp = function (a, b, percent) {
    return a + (b - a) * percent;
};

plaidify._plaidify = function (source, plaid, threshold, plaidIntensity) {
    var sourceData = source.data;
    var plaidData = plaid.data;

    for (var i = 0; i < sourceData.length; i += 4) {
        var gray = (sourceData[i] + sourceData[i + 1] + sourceData[i + 2]) / 3.0;
        if (gray <= threshold) {
            sourceData[i] = plaidify.lerp(0, plaidData[i], plaidIntensity);
            sourceData[i + 1] = plaidify.lerp(0, plaidData[i + 1], plaidIntensity);
            sourceData[i + 2] = plaidify.lerp(0, plaidData[i + 2], plaidIntensity);
        }
    }

    return sourceData;
};

plaidify._discrete_convolve_2d = function (data, kernel) {
    let [kernel_width, kernel_height] = [kernel[0].length, kernel.length];
    let [data_width, data_height] = [data[0].length, data.length];

    let [kernel_col_offset, kernel_row_offset] = [(kernel_width - 1) / 2, (kernel_height - 1) / 2];

    let result = [];
    for (let r = 0; r < data_height; r++) {
        let row = [];
        for (let c = 0; c < data_width; c++) {
            let total = 0;
            for (let kr = 0; kr < kernel_height; kr++) {
                for (let kc = 0; kc < kernel_width; kc++) {
                    let dr = r + kr - kernel_row_offset;
                    let dc = c + kc - kernel_col_offset

                    if (dr >= 0 && dr < data_height && dc >= 0 && dc < data_width) {
                        total += kernel[kr][kc] * data[dr][dc];
                    }
                }
            }

            row.push(total);
        }
        result.push(row);
    }

    return result;
}


plaidify._get_horizontal_kernel_2d = function (size) {
    let half_width = (size - 1) / 2;
    let kernel = [];
    for (let i = 0; i < size; i++) {
        kernel.push(i - half_width);
    }
    return [kernel];
}


plaidify._get_vertical_kernel_2d = function (size) {
    let half_width = (size - 1) / 2;
    let kernel = [];
    for (let i = 0; i < size; i++) {
        kernel.push([i - half_width]);
    }
    return kernel;
}
