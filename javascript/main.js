$(function() {
    /* credit to Joseph Silber in this post:
        http://stackoverflow.com/questions/7717527/
        jquery-smooth-scrolling-when-clicking-an-anchor-link
    */
    $('a').click(function(){
        $('html, body').animate({
            scrollTop: $( $(this).attr('href') ).offset().top
        }, 300);
        return false;
    });
});
