var taskButton = function(text, id, parent) {
    this.id = id;
    this.surface = $('<ul id=' + id + ' class="surface"></ul>');
    this.surface.attr('id', this.id);

    this.container = $('<li class="task col-40"></li>');

    this.textContainer = $('<div class="col-15">' + text + '</div>');
    this.textContainer.appendTo(this.container);

    var self = this;
    this.buttonContainer = $('<div class="invisible col-25">');

    this.childAdder = $('<button class="contrast">Add Child</button>');
    this.childAdder.click(function() {
        new taskButton("Enter a new task").surface.appendTo(self.surface);
    });
    this.childAdder.attr('display', 'none');
    this.childAdder.appendTo(this.buttonContainer);

    this.nextAdder = $('<button class="contrast">Add Next</button>');
    this.nextAdder.click(function() {
        new taskButton("Enter a new task").surface.insertAfter(self.surface);
    });
    this.nextAdder.appendTo(this.buttonContainer);

    this.buttonContainer.appendTo(this.container);

    this.container.appendTo(this.surface);


    this.container.mouseenter(function() {
        self.buttonContainer.removeClass("invisible");
    });

    this.container.mouseleave(function() {
        if (!self.container.hasClass("selected")) {
            self.buttonContainer.addClass("invisible");
        }
    });


    //copy selection and deselection logic from the other class; it's quite good
    this.container.click(function() {
        if (!(self.nextAdder.is(":hover") || self.childAdder.is(":hover"))) {
            self.container.addClass("selected");
            var placeholder = self.textContainer.text();
            self.textContainer.text("");
            var inp = $('<input type="text" id="cur-input">');
            inp.appendTo(self.textContainer);
            inp.attr("placeholder", placeholder);
            inp.focus();
            var localKeys = [];
            inp.keydown(function(e) {
                localKeys[e.keyCode] = e.type == 'keydown';
            });
            inp.keyup(function(e) {
                if(localKeys[9] || localKeys[13]
                    || localKeys[38] || localKeys[40]) {
                    self.textContainer.text(inp.val());
                    self.container.removeClass("selected");
                    $('#cur-input').remove();
                }
                /*
                if (localKeys[16] && localKeys[9] || localKeys[38]) {
                    self.list.getPrevVisibleButton(self).makeEntry(localKeys);
                } else if (localKeys[9] || localKeys[40]) {
                    self.list.getNextVisibleButton(self).makeEntry(localKeys);
                } */

                localKeys[e.keyCode] = e.type == 'keydown';
            });
        } else {
            self.textContainer.text($("cur-input").val());
            self.container.removeClass("selected");
        }
    });
}
