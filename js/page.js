var page = {};

page.nav_links = [{
    "href": "index.html",
    "text": "Home"
}, {
    "href": "projects.html",
    "text": "Projects"
}, {
    "href": "res/kevin_berry_resume.pdf",
    "text": "Resume"
}, {
    "href": "contact.html",
    "text": "Contact"
}];

page.prepend_navigation = function (parent, color) {
    var nav = document.createElement("nav");
    nav.classList.add("w3-bar", "w3-" + color);

    for (var i = 0; i < page.nav_links.length; i++) {
        var link = document.createElement("a");
        link.href = page.nav_links[i]["href"];
        link.innerHTML = page.nav_links[i]["text"];
        link.classList.add("w3-bar-item", "w3-button", "w3-hover-white");
        nav.appendChild(link);
    }

    parent.insertBefore(nav, parent.children[0]);
}

page.make_list_elements = function (items) {
    return items.map(({ name, info, link }) => {
        let item_element = document.createElement("div");
        item_element.classList.add("w3-panel");

        let item_list_element = document.createElement("ul");
        item_list_element.classList.add("w3-ul");
        
        let name_element;
        if (link === undefined) {
            name_element = document.createElement("div");
            name_element.classList.add("w3-text-indigo");
        } else {
            name_element = document.createElement("a");
            name_element.classList.add("w3-text-indigo", "w3-hover-text-black");
            name_element.href = link;
        }
        name_element.innerHTML = name;

        let header = document.createElement("h5");
        header.appendChild(name_element);
        item_element.appendChild(header);

        let info_elements = info.map(line => {
            line = line.replace(
                /\[(.*?)\]\((.*?)\)/g,
                '<a href="$2" target="_blank" class="w3-hover-text-indigo">$1</a>'
            );

            let li = document.createElement("li");
            li.innerHTML = line;
            return li;
        });

        info_elements.forEach(element => item_list_element.appendChild(element));
        item_element.appendChild(item_list_element);

        return item_element;
    });
};