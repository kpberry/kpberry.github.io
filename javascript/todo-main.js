$(function() {
    var tb = new taskButton("New Item   ", 'side-0');
    tb.surface.appendTo('#main-content');

    $(document).click(() => {
        $(".full-selected").removeClass("half-selected");
        $(".full-selected").removeClass("full-selected");
    });
    var testing = new projectHead("Main", tb);
});

var toggleMenu = function() {
    var menu = $('.side-menu');
    if (menu.hasClass('open')) {
        //close the menu
        menu.animate({"left": "-=20%"}, "fast");
        $('#main-content').animate({"left": "-=20%"}, "fast");
        menu.removeClass('open');
    } else {
        //open the menu
        $('.side-menu').animate({"left": "+=20%"}, "fast");
        $('#main-content').animate({"left": "+=20%"}, "fast");
        menu.addClass('open');
    }
}

var addProject = function() {
    var a = new projectHead("TESTING");
}
