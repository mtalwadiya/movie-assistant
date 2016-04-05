
(function () {
    'use strict';

    angular.module('dialog.resize', [])

    /**
     * @name resize
     * @module module/resize
     * @description
     *
     * Gets invoked to resize the scrollable div within the UI. Each time the page changes
     * size (via browser resize) this directive is invoked to resize the height of the inner
     * scrollable div.
     */
    .directive('resize', function ($timeout) {
        return {
            'restrict': 'A',
            'link': function (scope, element) {
                var delayTimeout = null;
                var docHeight = null;
                var headerHeight = null;
                var footerHeight = null;
                var proposedHeight = 0;
                delayTimeout = $timeout(function () {
                    docHeight = $(window).height();
                    headerHeight = $('#dialog-header').outerHeight();
                    footerHeight = $('#dialog-footer').outerHeight();
                    proposedHeight = docHeight - (headerHeight + footerHeight + 5);
                    if (element.outerHeight(true) > proposedHeight) {
                        //Added for iOS issues when scrolling!
                        element.css('-webkit-overflow-scrolling', 'scroll');
                        element.height(proposedHeight);
                    }
                }, 250);

                $( window ).resize(function () {
                    if (delayTimeout) {
                        $timeout.cancel(delayTimeout);
                    }
                    delayTimeout = $timeout(function () {
                        docHeight = $(window).height();
                        headerHeight = $('#dialog-header').outerHeight();
                        footerHeight = $('#dialog-footer').outerHeight();
                        proposedHeight = docHeight - (headerHeight + footerHeight + 5);
                        if (element.outerHeight(true) > proposedHeight) {
                            element.css('-webkit-overflow-scrolling', 'touch');
                        }
                        else {
                            element.css('-webkit-overflow-scrolling', 'auto');
                        }
                        element.height(proposedHeight);
                    }, 250);
                });
            }
        };
    });
}());
