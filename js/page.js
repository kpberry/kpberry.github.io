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
