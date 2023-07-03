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

        // get plaid image data
        canv.setAttribute('width', plaidElement.width);
        canv.setAttribute('height', plaidElement.height);
        ctx.drawImage(plaidElement, 0, 0);
        let plaidImage = ctx.getImageData(0, 0, canv.width, canv.height);

        // get source image data
        canv.setAttribute('width', sourceElement.width);
        canv.setAttribute('height', sourceElement.height);
        ctx.drawImage(sourceElement, 0, 0);
        let sourceImage = ctx.getImageData(0, 0, canv.width, canv.height);

        let kernelSize = document.getElementById('intensity').value || 7;
        let plaidScale = document.getElementById('threshold').value || 127;

        let source_rgb = plaidify._image_to_rgb_channels(sourceImage, sourceElement.width, sourceElement.height);
        let plaid_rgb = plaidify._image_to_rgb_channels(plaidImage, plaidElement.width, plaidElement.height);

        let shifted_rgb = plaidify._shift_pixels(source_rgb, plaid_rgb, plaidScale, kernelSize, 2);
        let shifted_image = plaidify._image_from_rgb_channels(shifted_rgb);

        ctx.putImageData(shifted_image, 0, 0);
    }
};

plaidify._image_to_rgb_channels = function (image) {
    let result = [];
    for (let channel_offset = 0; channel_offset < 3; channel_offset++) {
        let channel = [];
        for (let r = 0; r < image.height; r++) {
            let row = [];
            for (let c = 0; c < image.width; c++) {
                row.push(image.data[4 * (r * image.width + c) + channel_offset]);
            }
            channel.push(row);
        }
        result.push(channel);
    }

    return result;
}

plaidify._image_from_rgb_channels = function (rgb_channels) {
    let [width, height, channels] = [rgb_channels[0][0].length, rgb_channels[0].length, rgb_channels.length];
    let result = [];
    for (let r = 0; r < height; r++) {
        for (let c = 0; c < width; c++) {
            for (let channel_offset = 0; channel_offset < channels; channel_offset++) {
                result.push(rgb_channels[channel_offset][r][c]);
            }
            result.push(255);
        }
    }
    return new ImageData(
        new Uint8ClampedArray(result),
        width,
        height
    );
}

plaidify.lerp = function (a, b, t) {
    return a + (b - a) * t;
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


plaidify._get_gaussian_kernel_2d = function (size, stddev) {
    let half_width = (size - 1) / 2;
    let kernel = [];
    for (let i = -half_width; i < half_width + 1; i++) {
        let row = [];
        for (let j = -half_width; j < half_width + 1; j++) {

            row.push(Math.exp(-(i * i + j * j) / (2 * stddev * stddev)) / (2 * Math.PI * (stddev * stddev)));
        }
        kernel.push(row);
    }
    return kernel
}


plaidify._blerp = function (top_left, top_right, bottom_left, bottom_right, tx, ty) {
    return plaidify.lerp(
        plaidify.lerp(top_left, top_right, tx),
        plaidify.lerp(bottom_left, bottom_right, tx),
        ty
    )
}


plaidify._resize_2d = function (data, width, height) {
    let [data_width, data_height] = [data[0].length, data.length];
    let c_step = (data_width - 1) / (width - 1);  // don't interpolate the last column
    let r_step = (data_height - 1) / (height - 1);  // don't interpolate the last row

    let result = [];
    for (let r = 0; r < height - 1; r++) {
        let row = [];
        let source_r = r * r_step;
        for (let c = 0; c < width - 1; c++) {
            let source_c = c * c_step;
            let source_r_top = Math.floor(source_r);
            let source_c_top = Math.floor(source_c);
            let value = plaidify._blerp(
                data[source_r_top][source_c_top],
                data[source_r_top][source_c_top + 1],
                data[source_r_top + 1][source_c_top],
                data[source_r_top + 1][source_c_top + 1],
                source_c - source_c_top,
                source_r - source_r_top
            );
            row.push(value);
        }
        row.push(data[Math.floor(source_r)][data_width - 1]);  // preserve last column exactly
        result.push(row);
    }
    result.push(data[data_height - 1]);  // preserve last row exactly

    return result;
};

plaidify._grayscale = function (image) {
    let [image_width, image_height] = [image[0][0].length, image[0].length];

    let result = [];
    for (let r = 0; r < image_height; r++) {
        let row = [];
        for (let c = 0; c < image_width; c++) {
            let red = image[0][r][c];
            let green = image[1][r][c];
            let blue = image[2][r][c];
            row.push((red + green + blue) / 3);
        }
        result.push(row);
    }
    return result;
}

plaidify._clip = function (value, min, max) {
    return Math.min(Math.max(value, min), max);
}

plaidify._shift_pixels = function (image, plaid, scale, kernel_size, blur) {
    let [image_width, image_height] = [image[0][0].length, image[0].length];

    let grayscale = plaidify._grayscale(image);
    plaid = plaid.map(channel => plaidify._resize_2d(channel, image_width, image_height));

    // convert images to float to make math easier
    grayscale = grayscale.map(row => row.map(col => col / 255.0));
    image = image.map(channel => channel.map(row => row.map(col => col / 255.0)));
    plaid = plaid.map(channel => channel.map(row => row.map(col => col / 255.0)));

    let gaussian_kernel = plaidify._get_gaussian_kernel_2d(kernel_size, blur);
    let blurred = plaidify._discrete_convolve_2d(grayscale, gaussian_kernel);

    let horizontal_kernel = plaidify._get_horizontal_kernel_2d(kernel_size);
    let vertical_kernel = plaidify._get_vertical_kernel_2d(kernel_size);
    let dc = plaidify._discrete_convolve_2d(blurred, horizontal_kernel);
    let dr = plaidify._discrete_convolve_2d(blurred, vertical_kernel);

    let shifted = [];
    for (let channel_offset = 0; channel_offset < 3; channel_offset++) {
        let channel = [];
        for (let r = 0; r < image_height; r++) {
            let row = [];
            for (let c = 0; c < image_width; c++) {
                let shifted_r = Math.round(plaidify._clip(r + dr[r][c] * scale, 0, image_height - 1));
                let shifted_c = Math.round(plaidify._clip(c + dc[r][c] * scale, 0, image_width - 1));
                row.push(plaid[channel_offset][shifted_r][shifted_c] * image[channel_offset][shifted_r][shifted_c] * 255.0);
            }
            channel.push(row);
        }
        shifted.push(channel);
    }

    return shifted;
}


plaidify._tests = function() {
    let data = [
        [1, 2, 3, 4, 5, 6, 7],
        [2, 3, 4, 5, 6, 7, 8],
        [3, 4, 5, 6, 7, 8, 9],
        [4, 5, 6, 7, 8, 9, 10]
    ];
    let kernel = [[0, 1, 0], [1, 0, 1], [0, 1, 0]];
    console.log(plaidify._discrete_convolve_2d(data, kernel));
    console.log(plaidify._get_horizontal_kernel_2d(3));
    console.log(plaidify._get_vertical_kernel_2d(3));
    console.log(plaidify._blerp(10, 30, 20, 90, 0.2, 0.3));
    console.log(plaidify._resize_2d(data, 7, 4));
    console.log(plaidify._resize_2d(data, 14, 8));
    console.log(plaidify._resize_2d(data, 15, 9));
}