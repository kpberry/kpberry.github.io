//TODO do something like "return new taskButton (but with the special header)"

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

project.prototype.addChild = function(task) {
    b = task || new taskButton("Enter a new task", this);
    b.surface.appendTo(this.surface);
    var prev = this;
    if (this.childTasks.length > 0) {
        prev = this.childTasks[this.childTasks.length - 1];
        prev.next = b;
    } else {
        this.firstChild = b;
    }
    b.prev = prev;
    b.makeEntry();
    this.childTasks.push(b);
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
