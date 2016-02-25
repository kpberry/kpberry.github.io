var taskButton = function(text, id, parent) {
    this.id = id;
    this.parent = parent;
    this.surface = $('<ul id=' + id + ' class="surface"></ul>');
    this.surface.attr('id', this.id);
    //used by the half remove method to promote child entries
    this.childTasks = [];

    //Container for all of the content of this list element
    this.container = $('<li class="task col-40"></li>');
    this.container.appendTo(this.surface);

    this.container.mouseenter(() => {
        this.buttonContainer.show();
        this.container.addClass("half-selected");
    });

    this.container.mouseleave(() =>  {
        if (!this.container.hasClass("full-selected")) {
            this.buttonContainer.hide();
            this.container.removeClass("half-selected");
        }
    });

    this.checkbox = $('<button class="checkbox col-8"></button>');
    this.checkbox.click(() => { this.toggleComplete() });
    this.checkbox.appendTo(this.container);

    //Container for the text portion of this list element
    //TODO Maybe this should be a button as well and there should only be
    //one container?
    this.textContainer = $('<p class="col-12">' + text + '</p>');
    this.textContainer.appendTo(this.container);

    //Container for the primary button portion of this list element
    this.buttonContainer = $('<div class="invisible col-20 full-height">');
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

taskButton.prototype.addDropdown = function(head, buttons) {
    var dropdownContainer = $('<div class="dropdown full-height">');
    dropdownContainer.appendTo(this.buttonContainer);

    head.appendTo(dropdownContainer);
    var dropdownContent = $('<div class="dropdown-content full-height">');
    dropdownContent.appendTo(dropdownContainer);
    for (i = 0; i < buttons.length; i++) {
        buttons[i].appendTo(dropdownContent);
    }
}

taskButton.prototype.makeEntry = function(heldKeys) {
    var self = this;
    if (!(self.buttonContainer.is(":hover"))
        && !(this.checkbox.is(":hover"))) {
        self.container.addClass("full-selected");
        var placeholder = self.textContainer.text();
        self.textContainer.text("");
        var inp = $('<input type="text" id="cur-input">');
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
                self.textContainer.text(inp.val());
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
    } else {
        self.textContainer.text($("cur-input").val());
        self.container.removeClass("full-selected");
    }
}

taskButton.prototype.toggleComplete = function() {
    this.surface.toggleClass("complete");
}

taskButton.prototype.isComplete = function() {
    if (this.parent === undefined) {
        return this.surface.hasClass("complete");
    } else {
        return this.parent.isComplete();
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

taskButton.prototype.isCollapsed = function() {
    return this.container.hasClass("collapsed");
}
