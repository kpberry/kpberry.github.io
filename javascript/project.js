var project = function(title) {
    this.menuButton = $('<button class="contrast menu-item selected" href="#">'
        + title + '</button>');
    this.menuButton.appendTo($('#side-menu-0'));
    this.menuButton.click(() => { this.toggleOpen() });

    this.surface = $('<div class="project-container">');

    this.header = $('<h4 class="projectHeader">' + title + '</h4>');
    this.header.appendTo(this.surface);

    this.childTasks = [];
    state[this] = {title: title};
}

project.prototype.toggleOpen = function() {
    this.surface.toggleClass("invisible");
    this.menuButton.toggleClass("selected");
}

project.prototype.addTask = function(task) {
    this.childTasks.push(task);
}

project.prototype.isComplete = function() {
    for (i in this.childTasks) {
        if (!this.childTasks[i].isComplete()) {
            return false;
        }
    }
    return true;
}

project.prototype.removeChild = function(child) {
    for (var i = 0; i < this.childTasks.length; i++) {
        if (this.childTasks[i] === child) {
            delete this.childTasks[i];
            return;
        }
    }
}
