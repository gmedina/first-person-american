var FPA = {};
FPA.common = {};

(function() {
	FPA.common.datepicker = function($els) {
		$els.datepicker();
		return $els;
	};	
	$(document).ready(function() {
		//basic information form
		FPA.common.datepicker($("input[data-role='datepicker']"));

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