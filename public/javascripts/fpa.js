var FPA = {
	common : {},
	basicForm : {},
	story:{}
};

(function() {
	FPA.common.datepicker = function($els) {
		$els.datepicker();
		return $els;
	};	

	FPA.story.map = function(markersArray) {

		function getCenter(coords) {
			return new google.maps.LatLng(20.000000, -10.000000);
		}

		var mapStyle = [
		  {
		    featureType: 'road',
		    stylers: [
		      {visibility: 'off'}
		    ]
		  }  		
	    ];	

	    var customMapConfig = new google.maps.StyledMapType(mapStyle, {name : "FPA Styled Map"});

        var mapOptions = {
          zoom: 1,
          mapTypeControlOptions: {
          	mapTypeIds: [google.maps.MapTypeId.ROADMAP, 'map_style']
          },
          mapTypeId: google.maps.MapTypeId.ROADMAP,
          streetViewControl: false,
          panControl: true,
          mapTypeControl: false
        };

        var map = new google.maps.Map($("#story-map")[0], mapOptions);

		map.mapTypes.set('map_style', customMapConfig);
		map.setMapTypeId('map_style');  

		var coords = [];

		for (var i = 0, l = markersArray.length; i < l; i++) {
			coords.push(new google.maps.LatLng(markersArray[i].lat, markersArray[i].lng));
			new google.maps.Marker({
				position: coords[i],
				map: map,
				title: markersArray[i].title,
				icon: "http://www.google.com/intl/en_us/mapfiles/ms/micons/blue-dot.png"
			});
		}

		var familyHistoryPath = new google.maps.Polyline({
			path: coords,
			strokeColor: "#5a68ec",
			strokeOpacity: 1.0,
			strokeWeight: 3
		});

		familyHistoryPath.setMap(map);

		map.setCenter(getCenter(coords));


	}

	var basicInfoForm = function() {
		var $form = $("#basic-info");
		var $addLocationTrigger = $form.find('.add-location');
		var initialJourneyRowCount = $form.find('.history-info .history-row').length;
		var JourneyHistory = function($el) {
			var editTrigger = $el.find("a.edit");
			var cancelTrigger = $el.find("a.cancel");
			var deleteTrigger = $el.find("a.delete");
			var isNew = function() {
				return $el.hasClass("new");
			}
			var deleteAction = function() {
				$el.find("input").attr("value", "");
				$el.fadeOut(function() {
					$el.removeClass("active");
					$el.trigger("delete");
					if (isNew) {
						$el.remove();
					}
				});
			};
			this.id = 0;
			this.el = $el;
			$el.addClass("active");
			editTrigger.on("click", function(e) {
				e.preventDefault();
				$el.find("input, label, a.cancel").removeClass("hidden-info");
				$el.find("span, a.edit, a.delete").addClass("hidden-info");
				$el.trigger("edit");
			});		
			cancelTrigger.on("click", function(e) {
				e.preventDefault();
				if (isNew()) {
					deleteAction();
					return;
				}
				$el.find("input, label, a.cancel").addClass("hidden-info");
				$el.find("span, a.edit, a.delete").removeClass("hidden-info");				
				$el.trigger("cancel");
			});
			deleteTrigger.on("click", function(e) {
				e.preventDefault();
				deleteAction();
			});
			//this event might need to be deferred
			$el.trigger("ready");
		};
		var journeyHistoryList = (function() {
			var list = [];
			var $historyTemplate = $form.find('.history-row.template');
			var addAlternatePatternClass = function() {
				$form.find(".history-info .history-row.active").each(function(index) {
					$(this).removeClass("odd");
					$(this).addClass(index % 2 == 0 ? "odd" : "");
				});
			};
			var getId = function() {
				return  "journey-date-" + ++initialJourneyRowCount;
			}			
			return {
				create : function() {
					var $clone = $historyTemplate.clone();
					var $dateEl = $clone.find("input[data-role='datepicker']");
					var $dateLabelEl = $clone.find("label");
					var id = getId();	
					$dateEl.attr("id", id);
					$dateLabelEl.attr("for", id);
					$clone.removeClass("template");
					$clone.addClass("new");
					$form.find('.history-info').append($clone);
					$dateEl.datepicker();
					$clone.find(".cancel").removeClass("hidden-info");
					this.add(new JourneyHistory($clone));
					this.colorRows();					

				},
				add : function(item) {
					list.push(item);
					item.el.on("delete", function() {
						//need to remove from list
						addAlternatePatternClass();
					});
				}, 
				getItems : function() {
					return list;
				},
				colorRows : addAlternatePatternClass
			}
		})();

		$form.find('.history-info .history-row').each(function(index) {
			var tempHistoryRow = new JourneyHistory($(this));
			journeyHistoryList.add(tempHistoryRow);
		});

		$addLocationTrigger.on("click", function(e) {
			e.preventDefault();
			journeyHistoryList.create();
		});
	};

	FPA.basicForm = basicInfoForm();

	$(document).ready(function() {
		//basic information form
		FPA.common.datepicker($(".history-info input[data-role='datepicker']"));
		
		FPA.story.map([{
			lat: -25.363882,
			lng: 131.044922,
			title: "A place"
		}, {
			lat: -22.363882,
			lng: 116.044922,
			title: "A place"
		}, {
			lat: 40.69119,
			lng: -73.970947,
			title: "New York!!!"
		}]);

		$("select").selectmenu();
		$("#jump-control").selectmenu( {
			    change: function(e, object){
			        console.log(object.value);
			        console.log($("." + object.value));
			        $("html, body").animate({
			        	scrollTop : $("." + object.value).offset().top
			        }, 500);
			    }
			}
		);      


		$("#basic-info").delegate("a.fade-toggle", "click", function(e) {
			e.preventDefault();
			var $el = $(this);
			var $target = $("." + $el.data("field"));
			var toggleText = $el.data("toggle-text");
			var currentText = $el.data("cuurent-text") || $el.html();
			$target.fadeToggle(function() {
				$el.data("toggle-text", currentText);
				$el.data("current-text", toggleText);
				$el.html(toggleText);
			});
		});
	});
})();