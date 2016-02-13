var taskButton = function(text, id, parent) {
    this.id = id;
    this.parent = parent;
    this.surface = $('<ul id=' + id + ' class="surface"></ul>');
    this.surface.attr('id', this.id);
    this.childTasks = [];

    //Container for all of the content of this list element
    this.container = $('<li class="task col-40"></li>');
    this.container.appendTo(this.surface);

    this.container.mouseenter(() => {
        this.buttonContainer.show();
        this.container.addClass("halfSelected");
    });

    this.container.mouseleave(() =>  {
        if (!this.container.hasClass("fullSelected")) {
            this.buttonContainer.hide();
            this.container.removeClass("halfSelected");
        }
    });

    //Container for the text portion of this list element
    this.textContainer = $('<p class="col-12">' + text + '</p>');
    this.textContainer.appendTo(this.container);

    //Container for the primary button portion of this list element
    this.buttonContainer = $('<div class="invisible col-20 full-height">');
    this.buttonContainer.appendTo(this.container);

    this.addButton("Add Child", () => {
        var b = new taskButton("Enter a new task", undefined, this);
        b.surface.appendTo(this.surface);
        this.childTasks.push(b);
    })

    this.addButton("Add Next", () => {
        var b = new taskButton("Enter a new task", undefined, this.parent);
        b.surface.insertAfter(this.surface);
        if (this.parent != undefined) {
            this.parent.childTasks.push(b);
        }
    })

    this.addButton("Remove Full", () => {
        $(this.surface).remove();
    });

    this.addButton("Remove", () => {
        var tasks = this.childTasks;
        for (i in tasks) {
            tasks[i].surface.insertAfter(this.surface);
        }
        $(this.surface).remove();
    });

    this.container.click((event) => {
        this.makeEntry();
        event.stopPropagation();
    });
}

taskButton.prototype.addButton = function(text, fn) {
    var result = $('<button class="contrast">' + text + '</button>');
    result.click(fn);
    result.appendTo(this.buttonContainer);
}

taskButton.prototype.makeEntry = function(heldKeys) {
    var self = this;
    if (!(self.buttonContainer.is(":hover"))) {
        self.container.addClass("fullSelected");
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
                self.container.removeClass("fullSelected");
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
        self.container.removeClass("fullSelected");
    }
}
