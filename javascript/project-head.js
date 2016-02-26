var projectHead = function(text, head) {
    this.menuButton = $('<button class="contrast menu-item selected" href="#">'
        + text + '</button>');
    this.menuButton.appendTo($('#side-menu-0'));
    this.menuButton.click(() => { this.toggleOpen() });
    this.head = head;
}

projectHead.prototype.toggleOpen = function() {
    this.head.toggleClass("invisible");
    this.menuButton.toggleClass("selected");
}