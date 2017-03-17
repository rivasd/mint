function runExperiment(){
	
	serverPsych.request(function (settings){
	    	jsPsych.randomization.shuffle(settings.timeline);
		settings.timeline.forEach(function(block, idx, timeline){
			if(block.type == "pitch"){
		        block.timeline = [
		        /* to add things manually to your timeline, by example your stimuli */
		        ];
    
			}
			else if (block.type == "Your block name 2"){
		        block.timeline = [
		        /* to add things manually to your timeline, by example your stimuli */
		        ];    
		    }
			
		});
				
		jsPsych.init({
			timeline: settings.timeline,
			on_finish:function(data){
				serverPsych.save({
					data:data
				})
			},
			display_element: $('#jsPsychTarget'),
			on_trial_start:function(){
				$("#jsPsychTarget")[0].scrollIntoView();
			}
		});
	});
}
