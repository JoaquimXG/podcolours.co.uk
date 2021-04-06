//This is insprired by a codepen linked below
//https://codepen.io/Dannzzor/pen/YXxaLE
//CodePen uses the MIT license
//I found this function preferable to alternative npm modules
//and have altered it to suit my needs
export default function toastBuilder(options) {
    //Optional arguments to extend usability of toast notification
    var opts = options || {};
    opts.defaultText = opts.defaultText || 'Progress Saved';
    opts.displayTime = opts.displayTime || 2000;
    opts.target = opts.target || 'body';
    opts.topOffset = opts.topOffset + 20 || 20

    //returns a function which will generate a toast notification on each call
        return function (text) {
            $('<div/>')
                .addClass('toast')
            //Add to the start of target element
                .prependTo($(opts.target))
                .text(text || opts.defaultText)
            //Queue initial styling functions to handle multiple toast notifications 
            //generated at the same time
                .queue(function(next) {
                    $(this).css({
                        'opacity': 1
                    });
                    var topOffset = opts.topOffset;
                    $('.toast').each(function() {
                        var $this = $(this);
                        var height = $this.outerHeight();
                        var offset = 20;
                        $this.css('top', topOffset + 'px');
                        topOffset += height + offset;
                    });
                    next();
                })
            //Hold toast notification for set time
                .delay(opts.displayTime)
            //After delay slide toast off to the right of the page
                .queue(function(next) {
                    var $this = $(this);
                    var width = $this.outerWidth() + 20;
                    $this.css({
                        'right': '-' + width + 'px',
                        'opacity': 0
                    });
                    next();
                })
            //Wait 600ms then remove the div
                .delay(600)
                .queue(function(next) {
                    $(this).remove();
                    next();
                });
        };
}
