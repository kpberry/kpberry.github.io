$(function() {
    var tb = new taskButton("New Item   ", 'side-0');
    tb.surface.appendTo('#main-content');
});

var toggleMenu = function() {
    var menu = $('.side-menu');
    if (menu.hasClass('open')) {
        //close the menu
        console.log("closing");
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
