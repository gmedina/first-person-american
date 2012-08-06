var FPA = {
	common : {},
	basicForm : {}
};

(function() {
	FPA.common.datepicker = function($els) {
		$els.datepicker();
		return $els;
	};	

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

		$("select").selectmenu();
		$("#jump-control").selectmenu( {
			    change: function(e, object){
			        console.log(object.value);
			        console.log($("." + object.value));
			        $("html, body").animate({
			        	scrollTop : $("." + object.value).offset().top - 20
			        }, 500);
			  //            $('html, body').animate({
     //     scrollTop: $("#elementtoScrollToID").offset().top
     // }, 2000);

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