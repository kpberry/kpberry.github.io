var page = {};

page.nav_links = [{
    "href": "index.html",
    "text": "Home"
}, {
    "href": "projects.html",
    "text": "Projects"
}, {
    "href": "talks.html",
    "text": "Talks"
}, {
    "href": "res/kevin_berry_resume.pdf",
    "text": "Resume"
}];

page.footer_links = [{
    "href": "mailto:kpberry11@gatech.edu",
    "text": "Email",
}, {
    "href": "https://www.LinkedIn.com/in/kevin-berry-820223141/",
    "text": "LinkedIn"
}, {
    "href": "https://github.com/kpberry",
    "text": "Github",
}, {
    "href": "https://www.facebook.com/kevin.berry.142240",
    "text": "Facebook"
}];

page.prepend_navigation = function (parent, color) {
    var nav = document.createElement("nav");
    nav.classList.add("w3-bar", "w3-" + color, "w3-card-2");

    for (var i = 0; i < page.nav_links.length; i++) {
        var link = document.createElement("a");
        link.href = page.nav_links[i]["href"];
        link.innerHTML = page.nav_links[i]["text"];
        link.classList.add("w3-bar-item", "w3-button", "w3-hover-white");
        nav.appendChild(link);
    }

    parent.insertBefore(nav, parent.children[0]);
}

page.append_footer = function (parent, color) {
    var footer = document.createElement("footer");
    footer.classList.add("w3-bar", "w3-" + color);
    
    var contact_message = document.createElement("div");
    contact_message.classList.add("w3-bar-item");
    contact_message.innerText = "Contact me via";
    footer.appendChild(contact_message);

    for (var i = 0; i < page.footer_links.length; i++) {
        var link = document.createElement("a");
        link.href = page.footer_links[i]["href"];
        link.innerHTML = page.footer_links[i]["text"];
        link.classList.add("w3-bar-item", "w3-button", "w3-hover-white");
        footer.appendChild(link);
    }

    parent.appendChild(footer);
}