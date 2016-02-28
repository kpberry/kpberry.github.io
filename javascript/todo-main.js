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
        menu.animate({"left": "-=15em"}, 100);
        $('#main-content').animate({"left": "-=15em"}, 100);
        menu.removeClass('open');
    } else {
        //open the menu
        menu.animate({"left": "+=15em"}, 100);
        $('#main-content').animate({"left": "+=15em"}, 100);
        menu.addClass('open');
    }
}

var addProject = function(title) {
    var menu = $('#side-menu-0');
    var main = $('#main-content');
    var text = title || prompt("Enter a project title.");
    if (text != undefined) {
        var newProj = new project(text, newProj);
        newProj.addChild();
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
