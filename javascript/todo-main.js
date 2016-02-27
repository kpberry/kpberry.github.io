var state = {};
var selectedTask = undefined;

$(function() {
    $(document).click(() => {
        selectedTask.deselect();
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
        var newProj = new project(text, newProj);
        var tb = new taskButton("New Item   ", newProj);
        selectedTask = tb;
        tb.surface.appendTo(newProj.surface);
        newProj.surface.appendTo(main);
    }
    if (menu.hasClass('open')) {
        toggleMenu();
    }
}

var load = function() {

}

var save = function() {
    alert(JSON.stringify(state));
}
