$(function() {
    $(document).click(() => {
        $(".full-selected").removeClass("half-selected");
        $(".full-selected").removeClass("full-selected");
    });
    addProject("Main");
});

var toggleMenu = function() {
    var menu = $('#side-menu-0');
    if (menu.hasClass('open')) {
        //close the menu
        menu.animate({"left": "-=15em"}, "fast");
        $('#main-content').animate({"left": "-=15em"}, "fast");
        menu.removeClass('open');
    } else {
        //open the menu
        menu.animate({"left": "+=15em"}, "fast");
        $('#main-content').animate({"left": "+=15em"}, "fast");
        menu.addClass('open');
    }
}

var addProject = function(title) {
    var menu = $('#side-menu-0');
    var main = $('#main-content');
    var text = title || prompt("Enter a project title.");
    if (text != undefined) {
        var head = $('<div class="project-container">');
        var txt = $('<h4 class="project-header">' + text + '</h4>');
        txt.appendTo(head);
        head.appendTo(main);
        var tb = new taskButton("New Item   ", 'side-menu-0');
        tb.surface.appendTo(head);
        var newProj = new projectHead(text, head);
    }
}

var load = function() {
    
}
