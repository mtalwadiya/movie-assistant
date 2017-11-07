
(function () {
    'use strict';

    angular.module('dialog.service', [])

    .service('dialogService', function (_, $http, $q) {
        var index = 0;
        var conversation = [];
        var d = new Date();
        var d1 = new Date(d.getTime() - (60 * 24 * 60 * 60 * 1000));
        d = d.getFullYear() + "-" + (d.getMonth()+1) + "-" + d.getDate();
        d1 = d1.getFullYear() + "-" + (d1.getMonth()+1) + "-" + d1.getDate();
        var apiai =  {
        		accessToken : "xxx",
        		sessionId : Math.floor(Math.random() * (1000000 - 100000)) + 100000,
        		baseUrl : "https://api.api.ai/v1/" 
        	};
        var tmdb = {
        		apiKey : "xxx",
        		baseUrl : "http://api.themoviedb.org/3/"
        	};
        
        var recency = "";
        var genre = "";
        
        var genres  = [
                       		{
                    	      "id": 28,
                    	      "name": "action"
                    	    },
                    	    {
                    	      "id": 12,
                    	      "name": "adventure"
                    	    },
                    	    {
                    	      "id": 16,
                    	      "name": "animation"
                    	    },
                    	    {
                    	      "id": 35,
                    	      "name": "comedy"
                    	    },
                    	    {
                    	      "id": 80,
                    	      "name": "crime"
                    	    },
                    	    {
                    	      "id": 99,
                    	      "name": "documentary"
                    	    },
                    	    {
                    	      "id": 18,
                    	      "name": "drama"
                    	    },
                    	    {
                    	      "id": 10751,
                    	      "name": "family"
                    	    },
                    	    {
                    	      "id": 14,
                    	      "name": "fantasy"
                    	    },
                    	    {
                    	      "id": 10769,
                    	      "name": "foreign"
                    	    },
                    	    {
                    	      "id": 36,
                    	      "name": "history"
                    	    },
                    	    {
                    	      "id": 27,
                    	      "name": "horror"
                    	    },
                    	    {
                    	      "id": 10402,
                    	      "name": "music"
                    	    },
                    	    {
                    	      "id": 9648,
                    	      "name": "mystery"
                    	    },
                    	    {
                    	      "id": 10749,
                    	      "name": "romance"
                    	    },
                    	    {
                    	      "id": 878,
                    	      "name": "science fiction"
                    	    },
                    	    {
                    	      "id": 10770,
                    	      "name": "tv movie"
                    	    },
                    	    {
                    	      "id": 53,
                    	      "name": "thriller"
                    	    },
                    	    {
                    	      "id": 10752,
                    	      "name": "war"
                    	    },
                    	    {
                    	      "id": 37,
                    	      "name": "western"
                    	    }
                    	  ];

        var getConversation = function () {
            return conversation;
        };
        
        var getLatestResponse = function () {
            return conversation.length > 0 ? conversation[conversation.length - 1] : undefined;
        };

        var getResponse = function (question) {
        	
        	var req = {
					 method: 'POST',
					 url: apiai.baseUrl + "query/",
					 headers: {
					   'Content-Type': "application/json; charset=utf-8",
					   "Authorization": "Bearer " + apiai.accessToken
					 },
					 data: JSON.stringify({q: question, lang: "en", sessionId: apiai.sessionId}),
				}

			return $http(req).then(function(response){
				if(response.data.result.action === 'start-search'){
					var parameters = response.data.result.parameters;
					
					if(parameters.recency){
						recency = parameters.recency;
					}
					if(parameters.genre){
						genre = parameters.genre;
					}
					
					var with_genres = '';
					if(genre !== ''){
						var genreObj = _.find(genres, { 'name': genre.toLowerCase() });
						if(genreObj){
			        		with_genres = genreObj.id;
			        	}
					}
										
					var params = {
	                    'sort_by': 'popularity.desc',
	                    'with_genres': with_genres,
	                    'api_key': tmdb.apiKey
	                }
					if(recency === 'upcoming'){
						params['primary_release_date.gte'] = d;
					}else{
						params['primary_release_date.gte'] = d1;
						params['primary_release_date.lte'] = d;
					}
					
					recency = "";
					genre = "";
					
					return $http.get(tmdb.baseUrl + 'discover/movie', {
		                'params': params
		            }).then(function (response) {
		                var prefix = 'Here is what I found';
		                var movieList = response.data.results;
		                var movies = null;
		                
		                if (movieList && $.isArray(movieList)) {
		                    movies = [];
		                    movieList.forEach(function (film) {
		                    	if(movies.length >= 12) return;
		                    	if(film.original_language === 'en'){
		                    		movies.push({
			                        	"movieName": film.original_title,
			            				"popularity": film.popularity,
			            				"vote_average": film.vote_average,
			            				"movieId": film.id,		
			            				"overview": film.overview,
			            				"posterPath": film.poster_path ? ("http://image.tmdb.org/t/p/w185" + film.poster_path) : null,		
			            				"releaseDate": film.release_date
			                        });
		                    	}		                        
		                    });
		                }
		                           
		                return {
	                        'message': question,
	                        'responses': prefix,
	                        'movies': movies
	                    };
		            }, function (error) {
		                //Error case!
		                var response = 'Failed to get valid response from the Dialog service. Please refresh your browser';		                
		                return {
		                    'message': question,
		                    'responses': response
		                };
		            });
				}else{
					if(response.data.result.action === 'ask-for-genre' && 
							response.data.result.parameters && response.data.result.parameters.recency){
						recency = response.data.result.parameters.recency;
					}else if(response.data.result.action === 'ask-for-recency' && 
							response.data.result.parameters && response.data.result.parameters.genre){
						genre = response.data.result.parameters.genre;
					}
					var msg = 'I am sorry, I do not understand that. Are you looking for now playing or upcoming movies? Looking for any specific genre?';
					if(response.data.result.speech && response.data.result.speech !== ''){
						msg = response.data.result.speech;
					}
					return {
	                        'message': question,
	                        'responses': msg
	                    };
				}
			}, function(error){
				//Error case!
                var response = 'Failed to get valid response from the Dialog service. Please refresh your browser';               
                return {
                    'message': question,
                    'responses': response
                };
				
			});       	
        };

        var query = function (input) {
            conversation.push({
                'message': input,
                'index': index++
            });
            
            return getResponse(input).then(function (lastRes) {
                if (lastRes) {
                    conversation.forEach(function (segment) {
                        if (segment.index === index - 1) {
                            segment.responses = lastRes.responses;
                            segment.movies = lastRes.movies;
                            segment.options = lastRes.options;
                        }
                    });
                }
                return conversation;
            });
            
        };

        return {
            'getConversation': getConversation,
            'getLatestResponse': getLatestResponse,
            'query': query
        };
    });
}());
