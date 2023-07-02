var accordion = {};

accordion.toggle_card = function (outer, inner) {
    inner.classList.toggle("w3-show");
    // outer.classList.toggle("w3-card-2");
    outer.classList.toggle("w3-margin-bottom");
};

accordion.add_slideshow_to_card_info = function (card_data, info, color) {
    var cur_image = 0;
    var left_button = document.createElement('button');
    left_button.onclick = function () {
        images.children[cur_image].style.display = "none";
        cur_image = cur_image > 0 ? cur_image - 1 : images.children.length - 1;
        images.children[cur_image].style.display = "block";
    }
    left_button.classList.add("w3-button", "w3-" + color, "w3-half");
    left_button.innerHTML = "&#10094;";

    var right_button = document.createElement('button');
    right_button.onclick = function () {
        images.children[cur_image].style.display = "none";
        cur_image = cur_image < images.children.length - 1 ? cur_image + 1 : 0;
        images.children[cur_image].style.display = "block";
    }
    right_button.classList.add("w3-button", "w3-" + color, "w3-half");
    right_button.innerHTML = "&#10095;";

    info.appendChild(left_button);
    info.appendChild(right_button);

    var images = document.createElement("li");
    for (var i = 0; i < card_data["images"].length; i++) {
        var image = document.createElement("img");
        image.src = card_data["images"][i];
        image.style.width = "100%";
        image.style.display = i === 0 ? "block" : "none";
        images.appendChild(image);
    }
    info.appendChild(images);
};

accordion.add_card = function (card_data, accordion_element, color) {
    color = color || "indigo";

    var card = document.createElement("div");
    card.id = card_data["name"].toLowerCase().replace(/\s/g, "_");

    var info = document.createElement("ul");
    info.id = card.id + "_info";
    info.classList.add("w3-ul", "w3-hide");
    for (var i = 0; i < card_data["info"].length; i++) {
        var info_li = document.createElement("li");
        var info_text = card_data["info"][i];
        info_text = info_text.replace(
            /\[(.*?)\]\((.*?)\)/g, 
            '<a href="$2" target="_blank" class="w3-hover-text-' + color + '">$1</a>'
        );
        info_li.innerHTML = info_text;
        info.appendChild(info_li);
    }

    if (card_data["images"] !== undefined) {
        accordion.add_slideshow_to_card_info(card_data, info, color);
    }

    var header = document.createElement("div");
    header.classList.add("w3-border-bottom", "w3-row");

    var header_button = document.createElement("button");
    header_button.onclick = function () {
        accordion.toggle_card(card, info);
    };
    header_button.innerHTML = card_data["name"];
    header_button.classList.add(
        "w3-left-align", "w3-button", "w3-text-" + color,
        "w3-hover-" + color, "w3-threequarter"
    );

    var link = document.createElement("a");
    link.href = card_data["link"]["href"];
    link.innerHTML = card_data["link"]["text"];
    link.classList.add(
        "w3-button", "w3-quarter", "w3-text-" + color, "w3-hover-" + color
    );

    header.appendChild(header_button);
    header.appendChild(link);
    card.appendChild(header);
    card.appendChild(info);
    accordion_element.appendChild(card);
};