
(function () {
    'use strict';

    angular.module('dialog.showtoggle', [])

    /**
     * @name showtoggle
     * @module dialog/showtoggle
     * @description
     *
     * Provides showtoggle directive relating to the overview of movies.
     * The directives are used within the preview panel.
     */
    .directive('showtoggle', [ '$compile', function ($compile) {
        /*
         * @name showtoggle
         *
         * @description
         *
         * A 'showtoggle' element directive provides a more/less toggle when overview text is beyond a
         * certain character limit which is specified.
         * The directive calls the DialogCtrl module to get the current movie
         * and uses overview property to display movie overview for the selected movie.
         */
        return {
            'restrict': 'E',
            'link': function (scope, element) {
                scope.collapsed = false;
                scope.toggleshow = function () {
                    scope.collapsed = !scope.collapsed;
                };
                scope.$watch(function () {
                    return scope.dialogCtrl.selectedMovie;
                }, function () {
                    var firstPart = null, secondPart = null, toggleButton = null;
                    var text = scope.dialogCtrl.selectedMovie.overview;
                    var maxLength = 150;
                    if (text.length > maxLength) {
                        firstPart = text.substring(0, maxLength);
                        secondPart = text.substring(maxLength, text.length);
                        // First part, Toggle part & Second part
                        firstPart = $compile('<span class="dialog-movie-overview">' + firstPart + '</span>')(scope);
                        secondPart = $compile('<span class="dialog-movie-overview" ng-if="collapsed">' + secondPart + '</span><span>{{!collapsed ? " ..." : ""}}</span>')(scope);
                        toggleButton = $compile('<span class="dialog-collapse-text-toggle" ng-click="toggleshow()">{{collapsed ? "[show less]" : "[show more]"}}</span>')(scope);
                        // remove existing and append the new elements
                        element.empty();
                        element.append(firstPart);
                        element.append(secondPart);
                        element.append(toggleButton);
                    }
                    else {
                        element.empty();
                        element.append('<span class="dialog-movie-overview">' + text + '</span>');
                    }
                    scope.collapsed = false;
                }, true);
            }
        };
    } ] );
}());
