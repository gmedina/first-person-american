$(document).ready(function() {
	var templates = [{
		relativeURL : "header.html",
		id : "tmp-header",
		model : {
			title : "First Person America"
		}, 
		callback : function(tmp) {
			var html = Mustache.to_html(tmp, this.model);
			$("#main").before(html);			
		}
	}, {
		relativeURL : "footer.html",
		id : "tmp-footer",
		model : {},
		callback : function(tmp) {
			var html = Mustache.to_html(tmp, this.model);
			$("#main").after(html);			
		}
	}];
	
	var loadTemplate = function(config) {
		$.ajax({
			url : "http://localhost:8888/public/views/templates/" + config.relativeURL,
			success : function(response) {
				console.log(response);
				$(document.body).append(response);				
				var tmp = $("#" + config.id).html();
				config.callback(tmp);
			},
			dataType : "html"
		});
	};
	
	for (var i = 0, l = templates.length; i < l; i++) {
		loadTemplate(templates[i]);
	}
});