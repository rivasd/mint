
function runExperiment(){
	
	//little helper function to detect whether an stimulus is a match or mismatch
	
	function isMatch(url){
		if(url.includes('_mat')){
			return true;
		}
		else if( url.includes('_mis') ){
			return false;
		}
		else{
			return undefined;
		}
	}
	
	
	
	//Ask the server to give you all the params we worked so hard for!
	Percept.request(function (settings){
		
		//make adjustments to our timeline
		settings.timeline.forEach(function(block, idx, timeline){
			
			//adjusting the audio check block
			if(block.name == "audiocheck"){
		        block.timeline = [{stimulus: "/media/mint/predict/Cond_predict_18_mat.mp3", key_answer: 'n'}]
			}
			
			//adding stimuli to the musicianship test block
			else if (block.name == "musiciancheck"){
		        //find in settings.resources.audio all files that are in the muscheck folder, and build the subtimeline with them
				var subtimeline = [];
				
				settings.resources.audio.forEach(function(url){ //! adds one trial per file that has muscheck in its URL
					if(url.includes('muscheck')){
						subtimeline.push({
							stimulus: url,
							key_answer: isMatch(url) ? 'q' : 'p'
						});
					}
				});
				
				settings.resources.video.forEach(function(url){ //! adds one trial per file that has muscheck in its URL
					if(url.includes('muscheck')){
						subtimeline.push({
							stimulus: url,
							type: 'video',
							key_answer: isMatch(url) ? 'q' : 'p'
						});
					}
				});
				
				
				block.timeline = subtimeline;
		    }
			
			
			else if(block.name == "noisedemo"){
				var noisetimeline = [];
				
				settings.resources.audio.forEach(function(url){ //! adds one trial per file that has noisedemo in its URL
					if(url.includes('noisedemo')){
						noisetimeline.push({
							stimulus: url,
							key_answer: isMatch(url) ? 'q' : 'p'
						});
					}
				});
				
				settings.resources.video.forEach(function(url){ //! adds one trial per file that has noisedemo in its URL
					if(url.includes('noisedemo')){
						noisetimeline.push({
							stimulus: url,
							type: 'video',
							key_answer: isMatch(url) ? 'q' : 'p'
						});
					}
				});
				
				block.timeline = noisetimeline;
			}
			
			else if( block.name == "main"){
				
				//randomly decide on one of 4 versions
				var version = Math.floor(Math.random() * 4) + 1;
				
				//returns a timeline of the correct stimuli given a folder and a version code
				function findStim(list, folder, version){
					
					var trials = [];
					list.forEach(function(url){
						if(url.includes(folder) && url.includes(version)){ //DONT MIX MP3 and MP4 in the same folder!!!!
							trials.push({
								stimulus : url,
								key_answer: isMatch(url) ? 'q' : 'p'
							});
						}
					})
					
					trials = jsPsych.randomization.shuffle(trials);
					return trials;
				}
				
				
				
				var folder = ['pitch', 'rythm', 'predict', 'spatial', 'visual'];
				
				var subblocks = [];
				for(var i=0;i < 5; i++){
					
					var type = i>3 ? 'video': ' audio-categorization';
					subblocks.push({
						type: type,
						timeline: findStim( type == 'video' ? settings.resources.video : settings.resources.audio, folder[i], version)
					});
				}
				
				subblocks = jsPsych.randomization.shuffle(subblocks);
				block.timeline = subblocks;
			}
			
		});
		
		
		//Run the experiment with our modified timeline and send the data afterwards!
		jsPsych.init({
			timeline: settings.timeline,
			on_finish:function(data){
				Percept.save({
					data:data
				})
			},
			display_element: 'jsPsychTarget',
			on_trial_start:function(){
				$("#jsPsychTarget")[0].scrollIntoView();
			}
		});
	});
}
