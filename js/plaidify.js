var plaidify = {};

plaidify.loadImageAsURL = function(input, target) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();

        reader.onload = function(e) {
            var uploaded = document.getElementById(target);
            uploaded.setAttribute('src', e.target.result);

            uploaded.setAttribute('width', input.files[0].width + 'px');
            uploaded.setAttribute('height', input.files[0].height + 'px');
        };

        reader.readAsDataURL(input.files[0]);
    }
};

plaidify.plaidify = function(source, plaid) {
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

plaidify.lerp = function(a, b, percent) {
    return a + (b - a) * percent;
};

plaidify._plaidify = function(source, plaid, threshold, plaidIntensity) {
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