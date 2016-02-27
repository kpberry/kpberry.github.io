var taskButton = function(text, parent, priority) {
    this.text = text;
    this.parent = parent;
    this.priority = priority || 1;
    this.surface = $('<ul class="surface"></ul>');
    //used by the half remove method to promote child entries
    this.childTasks = [];
    state[parent][this] = {text: this.text, priority: this.priority};

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

    this.checkbox = $('<button class="full-height left"> &#9744 </button>');
    this.checkbox.click(() => { this.toggleComplete() });
    this.checkbox.appendTo(this.container);

    this.collapser = $('<button class="full-height left invisible"> &#65293 </button>');
    this.collapser.click(() => { this.toggleCollapse() });
    this.collapser.appendTo(this.container);

    this.textContainer = $('<div class="task-text"></div>');
    this.textContainer.appendTo(this.container);
    this.titleText = $('<button class="task-text">' + text + '</button>');
    this.titleText.appendTo(this.textContainer);

    //Container for the primary button portion of this list element
    this.buttonContainer = $('<div class="invisible full-height">');
    this.buttonContainer.appendTo(this.container);

    var head = this.makeButton("&middot&middot&middot");
    var nextAdder = this.makeButton("Add Next", () => { this.addNext() });
    var childAdder = this.makeButton("Add Child", () => { this.addChild() });
    var remover = this.makeButton("Remove", () => { this.removeFull() });
    var prioritySetter = this.makeButton("Set Priority", () => { this.setPriority() });
    this.addDropdown(head, [nextAdder, childAdder, prioritySetter, remover]);

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
    var dropdownContainer = $('<div class="dropdown full-height">');
    dropdownContainer.appendTo(destination || this.buttonContainer);

    head.appendTo(dropdownContainer);
    var dropdownContent = $('<div class="dropdown-content full-height">');
    dropdownContent.appendTo(dropdownContainer);
    for (i = 0; i < buttons.length; i++) {
        buttons[i].appendTo(dropdownContent);
    }

    return dropdownContainer;
}

taskButton.prototype.makeEntry = function(override, heldKeys) {
    selectedTask.deselect();
    selectedTask = this;
    if (this.inp === undefined && (override || this.textContainer.is(":hover")
        && !this.container.hasClass("full-selected"))) {
        this.container.addClass("full-selected");
        var placeholder = this.titleText.text();
        this.titleText.remove();
        this.inp = $('<input type="text" id="cur-input" class="task-text">');
        this.inp.appendTo(this.textContainer);
        this.inp.attr("placeholder", placeholder);
        this.inp.focus();
        var localKeys = heldKeys || [];
        this.inp.keydown(function(e) {
            localKeys[e.keyCode] = e.type == 'keydown';
        });
        this.inp.keyup((e) => {
            if(localKeys[9] || localKeys[13]
                || localKeys[38] || localKeys[40]) {
                this.titleText = $('<button class="task-text">' + this.inp.val() + '</button>');
                this.titleText.appendTo(this.textContainer);
                this.container.removeClass("full-selected");
                $('#cur-input').remove();
                this.inp = undefined;
            }

            /*
            if (localKeys[16] && localKeys[9] || localKeys[38]) {
                $(this).prev().makeEntry(true, localKeys);
            } else if (localKeys[9] || localKeys[40]) {
                $(this).next().makeEntry(true, localKeys);
            }
            */

            localKeys[e.keyCode] = e.type == 'keydown';
        });
    }
}

taskButton.prototype.deselect = function() {
    this.container.removeClass("full-selected");
    if (this.inp !== undefined) {
        if (this.inp.val() !== "") {
            this.titleText = $('<button class="task-text">' + this.inp.val() + '</button>');
        } else {
            this.titleText = $('<button class="task-text">' + this.titleText.text() + '</button>');
        }
        this.titleText.appendTo(this.textContainer);
        this.container.removeClass("full-selected");
        $('#cur-input').remove();
        this.inp = undefined;
    }
}

taskButton.prototype.toggleComplete = function() {
    this.surface.toggleClass("complete");
    if (this.isComplete()) {
        this.checkbox.html("&#9745");
        this.buttonContainer.hide();
        this.container.removeClass("half-selected");
    } else {
        this.checkbox.html("&#9744");
        this.buttonContainer.show();
        this.container.addClass("half-selected");
    }
}

taskButton.prototype.isComplete = function() {
    if (this.parent instanceof project) {
        return this.surface.hasClass("complete");
    } else {
        return this.surface.hasClass("complete") || this.parent.isComplete();
    }
}

taskButton.prototype.addChild = function() {
    var b = new taskButton("Enter a new task", this);
    b.surface.appendTo(this.surface);
    b.makeEntry(true);
    this.childTasks.push(b);
    this.collapser.removeClass("invisible");
}

taskButton.prototype.addNext = function() {
    var b = new taskButton("Enter a new task", this.parent);
    b.surface.insertAfter(this.surface);
    b.makeEntry(true);
    this.parent.childTasks.push(b);
}

taskButton.prototype.removeFull = function() {
    $(this.surface).remove();
    this.parent.removeChild(this);
}

taskButton.prototype.removeChild = function(child) {
    for (var i = 0; i < this.childTasks.length; i++) {
        if (this.childTasks[i] === child) {
            this.childTasks.splice(i, 1);
            if (this.childTasks.length == 0) {
                this.collapser.addClass("invisible");
            }
            return;
        }
    }
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

taskButton.prototype.toggleCollapse = function() {
    if (this.childTasks.length > 0) {
        if (this.container.hasClass("collapsed")) {
            this.expand();
        } else {
            this.collapse();
        }
    }
}

taskButton.prototype.collapse = function() {
    if (this.childTasks.length > 0) {
        for (i = 0; i < this.childTasks.length; i++) {
            this.childTasks[i].surface.addClass("invisible");
        }
        this.container.addClass("collapsed");
        this.collapser.html("+");
    }
}

taskButton.prototype.expand = function() {
    if (this.childTasks.length > 0) {
        for (i = 0; i < this.childTasks.length; i++) {
            this.childTasks[i].surface.removeClass("invisible");
        }
        this.container.removeClass("collapsed");
        this.collapser.html("&#65293");
    }
}

taskButton.prototype.setPriority = function() {
    this.priority = prompt("Enter a new priority.");
}

taskButton.prototype.isCollapsed = function() {
    return this.container.hasClass("collapsed");
}
