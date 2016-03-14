$(function() {

});

/* credit to Joseph Silber in this post:
    http://stackoverflow.com/questions/7717527/
    jquery-smooth-scrolling-when-clicking-an-anchor-link
*/
var scrollto = function(self, target) {
    $('html, body').animate({
        scrollTop: $(target).offset().top - 30
    }, 400);
    return false;
}
