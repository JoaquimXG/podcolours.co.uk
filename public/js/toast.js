//This is insprired by a codepen linked below
//https://codepen.io/Dannzzor/pen/YXxaLE
//CodePen uses the MIT license
//I found this function preferable to alternative npm modules
//and have altered it to suit my needs
export default function toastBuilder(options) {
    var opts = options || {};

    opts.defaultText = opts.defaultText || 'Progress Saved';
    opts.displayTime = opts.displayTime || 2000;
    opts.target = opts.target || 'body';
    opts.topOffset = opts.topOffset + 20 || 20

        return function (text) {
            $('<div/>')
                .addClass('toast')
                .prependTo($(opts.target))
                .text(text || opts.defaultText)
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
                .delay(opts.displayTime)
                .queue(function(next) {
                    var $this = $(this);
                    var width = $this.outerWidth() + 20;
                    $this.css({
                        'right': '-' + width + 'px',
                        'opacity': 0
                    });
                    next();
                })
                .delay(600)
                .queue(function(next) {
                    $(this).remove();
                    next();
                });
        };
}
