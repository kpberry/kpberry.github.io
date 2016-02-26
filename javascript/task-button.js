var taskButton = function(text, id, parent, priority) {
    this.id = id;
    this.parent = parent;
    this.priority = priority || 1;
    this.surface = $('<ul id=' + id + ' class="surface"></ul>');
    this.surface.attr('id', this.id);
    //used by the half remove method to promote child entries
    this.childTasks = [];

    //Container for all of the content of this list element
    this.container = $('<li class="task col-40"></li>');
    this.container.appendTo(this.surface);

    this.container.mouseenter(() => {
        if (!this.isComplete()) {
            this.buttonContainer.show();
            this.container.addClass("half-selected");
        }
    });

    this.container.mouseleave(() =>  {
        if (!this.container.hasClass("full-selected")) {
            this.buttonContainer.hide();
            this.container.removeClass("half-selected");
        }
    });

    //Container for the text portion of this list element
    //TODO Maybe this should be a button as well and there should only be
    //one container?
    this.textContainer = $('<div class="full-height col-20"></div>');
    this.textContainer.appendTo(this.container);
    this.titleText = $('<button class="task-text">' + text + '</button>');
    this.titleText.appendTo(this.textContainer);

    this.checkbox = this.makeButton("Priority: " + this.priority, () => { this.toggleComplete() });
    this.prioritySetter = this.makeButton("Set Priority", () => { this.setPriority() });
    this.addDropdown(this.checkbox, [this.prioritySetter], this.container);

    //Container for the primary button portion of this list element
    this.buttonContainer = $('<div class="invisible full-height">');
    this.buttonContainer.appendTo(this.container);


    var nextAdder = this.makeButton("Add Next", () => { this.addNext() });
    var childAdder = this.makeButton("Add Child", () => { this.addChild() });
    this.addDropdown(nextAdder, [childAdder]);

    var remover = this.makeButton("Remove", () => { this.remove() });
    var fullRemover = this.makeButton("Full Remove", () => { this.removeFull() });
    this.addDropdown(remover, [fullRemover]);

    this.collapser = this.addButton("Collapse", () => { this.collapse() });

    this.container.click((event) => {
        this.makeEntry();
        event.stopPropagation();
    });
}

taskButton.prototype.makeButton = function(text, fn) {
    var result = $('<button class="full-height">' + text + '</button>');
    result.click(fn);
    return result;
}

taskButton.prototype.addButton = function(text, fn) {
    var result = this.makeButton(text, fn);
    result.appendTo(this.buttonContainer);
    return result;
}

taskButton.prototype.addDropdown = function(head, buttons, destination) {
    var dropdownContainer = $('<div class="col-5 dropdown full-height">');
    dropdownContainer.appendTo(destination || this.buttonContainer);

    head.appendTo(dropdownContainer);
    var dropdownContent = $('<div class="dropdown-content full-height">');
    dropdownContent.appendTo(dropdownContainer);
    for (i = 0; i < buttons.length; i++) {
        buttons[i].appendTo(dropdownContent);
    }

    return dropdownContainer;
}

taskButton.prototype.makeEntry = function(heldKeys) {
    var self = this;
    if (self.textContainer.is(":hover")
        && !self.container.hasClass("full-selected")) {
        self.container.addClass("full-selected");
        var placeholder = self.titleText.text();
        self.titleText.remove();
        var inp = $('<input type="text" id="cur-input" class="task-text">');
        inp.appendTo(self.textContainer);
        inp.attr("placeholder", placeholder);
        inp.focus();
        var localKeys = heldKeys || [];
        inp.keydown(function(e) {
            localKeys[e.keyCode] = e.type == 'keydown';
        });
        inp.keyup(function(e) {
            if(localKeys[9] || localKeys[13]
                || localKeys[38] || localKeys[40]) {
                self.titleText = $('<button class="task-text">' + inp.val() + '</button>');
                self.titleText.appendTo(self.textContainer);
                self.container.removeClass("full-selected");
                $('#cur-input').remove();
            }

            /*
            if (localKeys[16] && localKeys[9] || localKeys[38]) {
                $(self).prev().makeEntry(localKeys);
            } else if (localKeys[9] || localKeys[40]) {
                $(self).next().makeEntry(localKeys);
            }
            */

            localKeys[e.keyCode] = e.type == 'keydown';
        });
    }
}

taskButton.prototype.toggleComplete = function() {
    this.surface.toggleClass("complete");
    if (this.isComplete()) {
        this.checkbox.html("&#9989");
        this.buttonContainer.hide();
        this.container.removeClass("half-selected");
    } else {
        this.checkbox.html("Priority: " + this.priority);
        this.buttonContainer.show();
        this.container.addClass("half-selected");
    }
}

taskButton.prototype.isComplete = function() {
    if (this.parent === undefined) {
        return this.surface.hasClass("complete");
    } else {
        return this.surface.hasClass("complete") || this.parent.isComplete();
    }
}

taskButton.prototype.addChild = function() {
    var b = new taskButton("Enter a new task", undefined, this);
    b.surface.appendTo(this.surface);
    this.childTasks.push(b);
}

taskButton.prototype.addNext = function() {
    var b = new taskButton("Enter a new task", undefined, this.parent);
    b.surface.insertAfter(this.surface);
    if (this.parent != undefined) {
        this.parent.childTasks.push(b);
    }
}

taskButton.prototype.removeFull = function() {
    $(this.surface).remove();
}

//removes this taskButton and promotes its children
taskButton.prototype.remove = function() {
    var tasks = this.childTasks;
    for (i in tasks) {
        tasks[i].surface.insertAfter(this.surface);
        if (this.parent !== undefined) {
            this.parent.childTasks.push(tasks[i]);
        }
    }
    $(this.surface).remove();
}

taskButton.prototype.toggleVisibility = function() {
    this.container.toggleClass("invisible");
    for (i = 0; i < this.childTasks.length; i++) {
        this.childTasks[i].surface.toggleClass("invisible");
    }
}

taskButton.prototype.collapse = function() {
    if (this.childTasks.length > 0) {
        for (i = 0; i < this.childTasks.length; i++) {
            this.childTasks[i].surface.addClass("invisible");
        }
        this.container.addClass("collapsed");
        this.collapser.text("Expand");
        this.collapser.click(() => { this.expand() });
    }
}

taskButton.prototype.expand = function() {
    if (this.childTasks.length > 0) {
        for (i = 0; i < this.childTasks.length; i++) {
            this.childTasks[i].surface.removeClass("invisible");
        }
        this.container.removeClass("collapsed");
        this.collapser.text("Collapse");
        this.collapser.click(() => { this.collapse() });
    }
}

taskButton.prototype.setPriority = function() {
    this.priority = prompt("Enter a new priority.");
    this.checkbox.text("Priority: " + this.priority);
}

taskButton.prototype.isCollapsed = function() {
    return this.container.hasClass("collapsed");
}
