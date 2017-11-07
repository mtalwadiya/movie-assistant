
(function () {
    'use strict';

    angular.module('dialog.rating', [])

    /**
     * @name rating
     * @module dialog/rating
     * @description
     *
     * Provides rating directive relating to the review of movies.
     * The directives are used within the preview panel.
     */
    .directive('rating', function () {
        /*
         * @name favorite
         *
         * @description
         *
         * A 'rating' element directive which provides a 'star' icon that the
         * end user can see to know a rating of a movie.
         * The directive calls the DialogCtrl module to get the current movie
         * and uses vote_average property to display right number of stars for the selected movie.
         */
        return {
            'restrict': 'E',
            'template': '<span class="mreview"><span class="dialog-movie-review">Rating: </span><span class="dialog-review-value">{{Math.round((movie.vote_average)*10)/10}}/10</span><p class="dialog-review-star-rating"><span id="rating"></span></p></span></span>',
            'link': function (scope, element) {
                scope.$watch(function () {
                    return scope.dialogCtrl.selectedMovie;
                }, function () {
                    var num = 0, rval = 0, fullstar = 0, halfstar = 0, emptystar = 0, count = 10, i = 0, stars = '';
                    var fs = '<img class="dialog-review-star" src="images/Full_star.svg">';
                    var es = '<img class="dialog-review-star" src="images/Empty_star.svg">';
                    var hs = '<img class="dialog-review-star" src="images/Half_star.svg">';
                    if (scope.dialogCtrl.selectedMovie.vote_average > 0) {
                        num = parseFloat(scope.dialogCtrl.selectedMovie.vote_average);
                        rval = Math.round(num * 2) / 2;
                        fullstar = parseInt(rval.toString().split('.')[0]);
                        halfstar = (rval.toString().split('.')[1] === undefined) ? 0 : 1;
                        emptystar = count - (fullstar + halfstar);
                        scope.Math = Math;
                        for (i = 0;i < fullstar;i++) {
                            stars += fs + ' ';
                        }
                        for (i = 0;i < halfstar;i++) {
                            stars += hs + ' ';
                        }
                        for (i = 0;i < emptystar;i++) {
                            stars += es + ' ';
                        }
                        $('#rating').html(stars);
                        $('.mreview').css('display', 'block');
                   }
                    else {
                        $('.mreview').css('display', 'none');
                    }
                }, true);
            }
        };
    });
}());
