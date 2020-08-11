//-------------------------------------
// JATOS online experiment.
// Working memory - Exogenous attention
// 
// Task date: 01082020
//-------------------------------------

//--------------------------------------
//**************************************
// Generic task variables
//**************************************
//--------------------------------------

// initialising window size
win_x =  screen.width;
win_y =  screen.height;

//var s = Snap('#svg'); //snap svg
//var s = Snap(win_x, win_y);

//--------------------------------------
//**************************************
// Task specific variables
//**************************************
//--------------------------------------


n_blocks = 8;
n_practiceTrials = 64;

changeAngleInitial = 30;

//var noise_str;

var threshold = 0.65;
var step = 20;

/*
//--------------------------------------
//**************************************
// Generating random numbers from ND
//**************************************
//--------------------------------------
	// Box-Muller transform - for generating random numbers from normal 
	// distribution 
	// source: https://en.wikipedia.org/wiki/Box–Muller_transform
function generateGaussian(mean,std)
{
    var u1 = Math.random();
    var u2 = Math.random();
    
    const two_PI = Math.PI * 2;
    var z0 = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(two_PI * u2);
    var z1 = Math.sqrt(-2.0 * Math.log(u1)) * Math.sin(two_PI * u2);

    return Math.floor(z0 * std + mean);
}
*/
//--------------------------------------
//**************************************
// Designing of task
//**************************************
//--------------------------------------

//--------------------------------------
// CIRCLE PARAMETERS
//--------------------------------------

var c_x = [];
var c_y = [];
var radius = 70;
var dist_fromDot = 150;
c_x[0] = (win_x/2)-dist_fromDot, c_y[0] = (win_y/2)-dist_fromDot;
c_x[1] = (win_x/2)+dist_fromDot, c_y[1] = (win_y/2)-dist_fromDot;
c_x[2] = (win_x/2)-dist_fromDot, c_y[2] = (win_y/2)+dist_fromDot;
c_x[3] = (win_x/2)+dist_fromDot, c_y[3] = (win_y/2)+dist_fromDot;

//--------------------------------------
// FIXATION DOT
//--------------------------------------

function fixationDot(probe_pos)
{
	var dot_radius = 8;
	var fix_dot = s.circle(win_x/2, win_y/2, dot_radius);

	if(probe_pos!=NaN)
	{	
		switch(probe_pos)
		{
			case 0:
				probe_quad = s.path("M"+(win_x/2)+" "+(win_y/2)+" v-"+dot_radius+" a"+
							dot_radius+" "+dot_radius+" 0 0 0 -"+dot_radius+" "+dot_radius+" z")
								.attr({fill:"yellow"});
				break;

			case 1:
				probe_quad = s.path("M"+(win_x/2)+" "+(win_y/2)+" v-"+dot_radius+" a"+
							dot_radius+" "+dot_radius+" 0 0 1 "+dot_radius+" "+dot_radius+" z")
								.attr({fill:"yellow"});
				break;

			case 2:
				probe_quad = s.path("M"+(win_x/2)+" "+(win_y/2)+" v"+dot_radius+" a"+
							dot_radius+" "+dot_radius+" 0 0 1 -"+dot_radius+" -"+dot_radius+" z")
								.attr({fill:"yellow"});
				break;

			case 3:
				probe_quad = s.path("M"+(win_x/2)+" "+(win_y/2)+" v"+dot_radius+" a"+
							dot_radius+" "+dot_radius+" 0 0 0 "+dot_radius+" -"+dot_radius+" z")
								.attr({fill:"yellow"});
				break;
		}
	}
}

//--------------------------------------
// GET FINAL ANGLES
//--------------------------------------

function getFinalAngles(initialAngles, changeState, changeDirection, changeAngle)
{
	var finalAngles = [];

	for(i = 0; i<4; i++)
	{
		if(changeState[i] == 0) 
		{ 
			finalAngles[i] = initialAngles[i]; 
		}
		if(changeState[i] == 1) 
		{
			finalAngles[i] = (initialAngles[i] + (changeDirection[i] * changeAngle)).toFixed(2);
		}
	}
	return finalAngles;
}

//--------------------------------------
// 4 BARS STIMULI
//--------------------------------------

function _4bars(angles)
{
	var placeholder = [];
	var x_perp = [];
	var y_perp = [];
	var bar = [];

	for(i = 0; i<4; i++)
	{
		// designing the circles
		placeholder[i] = s.circle(c_x[i], c_y[i], radius);
		placeholder[i].attr(
		{
			fill: "#666666",
			stroke: "#000",
			strokeWidth: 0.5
		});
		// designing the bars
		x_perp[i] = radius * Math.cos(angles[i]);
		y_perp[i] = radius * Math.sin(angles[i]);
		bar[i] = s.line(c_x[i] - x_perp[i], c_y[i] + y_perp[i], c_x[i] + 
			x_perp[i], c_y[i] - y_perp[i]).attr({stroke:"black", strokeWidth: 2});	
	}
}

//--------------------------------------
// 4 ARCS; DISTRACTOR
//--------------------------------------

function _4arcs(cue_flag, cue_pos)
{
	var arc = [];
	var _stroke_ = ["black", "black", "black", "black"];
	var dist_ArcfromCirc = 15;
	var angle_arc = 45;
	var arc_radius = 85;

	if(cue_flag == 1)
	{
		_stroke_[cue_pos] = "white";
	}
	arc[0] = s.path("M"+(c_x[0])+" "+(c_y[0]-radius-dist_ArcfromCirc)+
				"A"+ arc_radius+" "+arc_radius+" "+ angle_arc+" 0 0"+
				(c_x[0]-radius-dist_ArcfromCirc)+" "+(c_y[0])).attr({
					fill: "none", stroke: _stroke_[0], strokeWidth: "4"});

	arc[1] = s.path("M"+(c_x[1])+" "+(c_y[1]-radius-dist_ArcfromCirc)+
				"A"+ arc_radius+" "+arc_radius+" "+ angle_arc+" 0 1"+
				(c_x[1]+radius+dist_ArcfromCirc)+" "+(c_y[1])).attr({
					fill: "none", stroke: _stroke_[1], strokeWidth: "4"});

	arc[2] = s.path("M"+(c_x[2])+" "+(c_y[2]+radius+dist_ArcfromCirc)+
				"A"+ arc_radius+" "+arc_radius+" "+ angle_arc+" 0 1"+
				(c_x[2]-radius-dist_ArcfromCirc)+" "+(c_y[2])).attr({
					fill: "none", stroke: _stroke_[2], strokeWidth: "4"});

	arc[3] = s.path("M"+(c_x[3])+" "+(c_y[3]+radius+dist_ArcfromCirc)+
				"A"+ arc_radius+" "+arc_radius+" "+ angle_arc+" 0 0"+
				(c_x[3]+radius+dist_ArcfromCirc)+" "+(c_y[3])).attr({
					fill: "none", stroke: _stroke_[3], strokeWidth: "4"});
}

//--------------------------------------
// NOISE MASK
//--------------------------------------
/*
function generateNoiseMask()
{
	var rgb_code;
	var hex_code;
	var b_circle = [];
	var y_perp = [];

	var mean = 200/2;
	var std = 30;

	var fix_dot = s.circle(win_x/2, win_y/2, 8);

	for(var i = 0; i<4; i++)
	{
		// designing the circles
		b_circle[i] = s.circle(c_x[i], c_y[i], 70);
		b_circle[i].attr(
		{
			fill: "#666666",
			stroke: "#000",
			strokeWidth: 0.5
		});

		for(var k = radius; k > 0; k--)
		{
			y_perp[k] = Math.sqrt(Math.pow(radius, 2) - Math.pow(k, 2));
			for(var j = 0; j < y_perp[k]; j++)
			{
				
				rgb_code = generateGaussian(mean, std);
				hex_code = Snap.rgb(rgb_code,rgb_code,rgb_code);
				var pix = s.circle(c_x[i]+k, c_y[i] - j, 1).attr({stroke:hex_code});
								
				rgb_code = generateGaussian(mean, std);
				hex_code = Snap.rgb(rgb_code,rgb_code,rgb_code);
				var pix = s.circle(c_x[i]+k, c_y[i] + j, 1).attr({stroke:hex_code});

				rgb_code = generateGaussian(mean, std);
				hex_code = Snap.rgb(rgb_code,rgb_code,rgb_code);
				var pix = s.circle(c_x[i]-k, c_y[i] - j, 1).attr({stroke:hex_code});

				rgb_code = generateGaussian(mean, std);
				hex_code = Snap.rgb(rgb_code,rgb_code,rgb_code);
				var pix = s.circle(c_x[i]-k, c_y[i] + j, 1).attr({stroke:hex_code});
			}
		}
	}

	_4arcs(0);
	noise_str = s.toString();
	s.clear();
	return noise_str;
}
*/
//--------------------------------------
//**************************************
// PRESENTATION SCREENS
//**************************************
//--------------------------------------

//--------------------------------------
// FIXATION DOT
//--------------------------------------

function screen1(duration, curr_totalTrialNum)
{
	var changeAngle;
	var countCorrect;
	var staircaseCorrect;
	var countNAN;

	var psychBlock_NR =
	{
		type:"html-keyboard-response",
		trial_duration: duration,
		choices: jsPsych.NO_KEYS,
		stimulus: function()
		{
			a = (new Date()).getTime();
			//------------------------------------------------------------------
			// PASS ON DATA
			//------------------------------------------------------------------
			changeAngle = jsPsych.data.get().last(1).values()[0].changeAngle;

			countCorrect = jsPsych.data.get().last(1).values()[0].countCorrect;
			staircaseCorrect = jsPsych.data.get().last(1).values()[0].staircaseCorrect;
			countNAN = jsPsych.data.get().last(1).values()[0].countNAN;
			//------------------------------------------------------------------

			fixationDot();
			stim_str = s.toString();
			s.clear();
			return stim_str;
			
		},
		on_load: function() 
		{
			console.log("START OF NEW TRIAL "+curr_totalTrialNum);
//  		    console.log('s1 just finished loading.');
  		},
  		on_finish: function(data)
  		{
  			console.log("s1 = "+((new Date()).getTime() - a));
  			//------------------------------------------------------------------
			// PASS ON DATA
			//------------------------------------------------------------------
  			data.changeAngle = changeAngle;
  			data.countCorrect = countCorrect;
  			data.staircaseCorrect = staircaseCorrect;
  			data.countNAN = countNAN;
  			//------------------------------------------------------------------
  		}
	}
	return psychBlock_NR;
}

//--------------------------------------
// STIMULUS 1 PRESENTATION
//--------------------------------------

function screen2(duration, initialAngles)
{
	var changeAngle;
	var countCorrect;
	var staircaseCorrect;
	var countNAN;

	var psychBlock_NR =
	{
		type:"html-keyboard-response",
		trial_duration: duration,
		choices: jsPsych.NO_KEYS,
		stimulus: function()
		{
			a = (new Date()).getTime();
			//------------------------------------------------------------------
			// PASS ON DATA
			//------------------------------------------------------------------
			changeAngle = jsPsych.data.get().last(1).values()[0].changeAngle;

			countCorrect = jsPsych.data.get().last(1).values()[0].countCorrect;
			staircaseCorrect = jsPsych.data.get().last(1).values()[0].staircaseCorrect;
			countNAN = jsPsych.data.get().last(1).values()[0].countNAN;
			//------------------------------------------------------------------

			fixationDot();
			_4bars(initialAngles);
			cue_flag = 0;
			_4arcs(cue_flag);

			stim_str = s.toString();
			s.clear();
			return stim_str;
		},
/*		on_load: function() 
		{
  		    console.log('s2 just finished loading.');
  		},
*/	  	on_finish: function(data)
  		{
  			console.log("s2 = "+((new Date()).getTime() - a));
  			//------------------------------------------------------------------
			// PASS ON DATA
			//------------------------------------------------------------------
  			data.changeAngle = changeAngle;
  			data.countCorrect = countCorrect;
  			data.staircaseCorrect = staircaseCorrect;
  			data.countNAN = countNAN;
  			//------------------------------------------------------------------
  		}
	}
	return psychBlock_NR;
}

//--------------------------------------
// NOISE MASK / BACKWARD VISUAL MASK
//--------------------------------------

function screen3(duration)
{
	var changeAngle;
	var countCorrect;
	var staircaseCorrect;
	var countNAN;

	var img_path = "image/noise.png";

	var psychBlock_NR_IMG = 
	{
		type: "image-keyboard-response",
		stimulus_height: 477-0.25,
		stimulus_width: 477-0.25, // 0.25 is the image correction value
		stimulus: img_path,
		choices: jsPsych.NO_KEYS,
		trial_duration: duration,
		on_load: function() 
		{
			a = (new Date()).getTime();
//  		    console.log('s3 just finished loading.');
  		    //------------------------------------------------------------------
			// PASS ON DATA
			//------------------------------------------------------------------
			changeAngle = jsPsych.data.get().last(1).values()[0].changeAngle;

			countCorrect = jsPsych.data.get().last(1).values()[0].countCorrect;
			staircaseCorrect = jsPsych.data.get().last(1).values()[0].staircaseCorrect;
			countNAN = jsPsych.data.get().last(1).values()[0].countNAN;
			//------------------------------------------------------------------
  		},
  		on_finish: function(data)
  		{
  			console.log("s3 = "+((new Date()).getTime() - a));
  			//------------------------------------------------------------------
			// PASS ON DATA
			//------------------------------------------------------------------
  			data.changeAngle = changeAngle;
  			data.countCorrect = countCorrect;
  			data.staircaseCorrect = staircaseCorrect;
  			data.countNAN = countNAN;
  			//------------------------------------------------------------------
  		}
	}
	return psychBlock_NR_IMG;
}

/*
// for generating noise mask on the fly..
	var psychBlock_NR =
	{
		type: "html-keyboard-response",
		stimulus: generateNoiseMask(),
		trial_duration: 50,
		choices: jsPsych.NO_KEYS,
		on_load: function() 
		{
  		    console.log('s3 just finished loading.');
  		    a = (new Date()).getTime();
  		},
  		on_finish: function()
  		{
  			console.log((new Date()).getTime() - a);
  		}
	}
*/


//--------------------------------------
// DELAY SCREEN
//--------------------------------------

function delay_cue(duration, cue_flag, cue_pos) 
{
	var changeAngle;
	var countCorrect;
	var staircaseCorrect;
	var countNAN;

	var psychBlock_NR =
	{
		type:"html-keyboard-response",
		trial_duration: duration,
		choices: jsPsych.NO_KEYS,
		stimulus: function()
		{
			a = (new Date()).getTime();
			//------------------------------------------------------------------
			// PASS ON DATA
			//------------------------------------------------------------------
			changeAngle = jsPsych.data.get().last(1).values()[0].changeAngle;

			countCorrect = jsPsych.data.get().last(1).values()[0].countCorrect;
			staircaseCorrect = jsPsych.data.get().last(1).values()[0].staircaseCorrect;
			countNAN = jsPsych.data.get().last(1).values()[0].countNAN;
			//------------------------------------------------------------------

			fixationDot();
			_4arcs(cue_flag, cue_pos);
			stim_str = s.toString();
			s.clear();
			return stim_str;
		},
/*		on_load: function() 
		{
  		    console.log('s4/5/6 just finished loading.');
  		},
*/  	on_finish: function(data)
  		{
  			console.log("s4/5/6 = "+((new Date()).getTime() - a));
  			//------------------------------------------------------------------
			// PASS ON DATA
			//------------------------------------------------------------------
  			data.changeAngle = changeAngle;
  			data.countCorrect = countCorrect;
  			data.staircaseCorrect = staircaseCorrect;
  			data.countNAN = countNAN;
  			//------------------------------------------------------------------
  		}
	}
	return psychBlock_NR;
}

//--------------------------------------
// STIMULUS 2 PRESENTATION
//--------------------------------------

function screen7(duration, initialAngles, changeState, changeDirection)
{
	finalAngles = [];
	var changeAngle;
	var countCorrect;
	var staircaseCorrect;
	var countNAN;

	var psychBlock_NR =
	{
		type:"html-keyboard-response",
		trial_duration: duration,
		choices: jsPsych.NO_KEYS,
		stimulus: function(data)
		{
			a = (new Date()).getTime();
			
			// used for final angles calculation
			changeAngle = jsPsych.data.get().last(1).values()[0].changeAngle;

			//------------------------------------------------------------------
			// PASS ON DATA
			//------------------------------------------------------------------
			countCorrect = jsPsych.data.get().last(1).values()[0].countCorrect;
			staircaseCorrect = jsPsych.data.get().last(1).values()[0].staircaseCorrect;
			countNAN = jsPsych.data.get().last(1).values()[0].countNAN;
			
			finalAngles = getFinalAngles(initialAngles, changeState, changeDirection, changeAngle);
			//------------------------------------------------------------------

			fixationDot();
			_4bars(finalAngles);
			cue_flag = 0;
			_4arcs(cue_flag);
			stim_str = s.toString();
			s.clear();
			return stim_str;
		},
/*		on_load: function() 
		{
  		    console.log('s7 just finished loading.');
  		},
*/  	on_finish: function(data)
  		{
  			//------------------------------------------------------------------
			// PASS ON DATA
			//------------------------------------------------------------------
  			data.changeAngle = changeAngle;
  			console.log("changeAngle - "+data.changeAngle);

  			data.finalAngles = finalAngles;
  			console.log("initial - "+initialAngles);
  			console.log("final - "+data.finalAngles);

  			data.countCorrect = countCorrect;
  			data.staircaseCorrect = staircaseCorrect;
  			data.countNAN = countNAN;
  			//------------------------------------------------------------------

  			console.log("s7 = "+((new Date()).getTime() - a));
  		}
	}
	return psychBlock_NR;
}

//--------------------------------------
// RESPONSE BLOCK
//--------------------------------------

function ResponseBlock(duration, probe_pos)
{
	finalAngles = [];
	var changeAngle;
	var countCorrect;
	var staircaseCorrect;
	var countNAN;

	var psychBlock_R =
	{
		type:"html-keyboard-response",
		trial_duration: duration,
		choices: [90, 77], // left (no change) - 90; right (change) - 77
		stimulus: function(data)
		{
			a = (new Date()).getTime();

			// used for producing the bars
			finalAngles = jsPsych.data.get().last(1).values()[0].finalAngles;

			//------------------------------------------------------------------
			// PASS ON DATA
			//------------------------------------------------------------------
			countCorrect = jsPsych.data.get().last(1).values()[0].countCorrect;
			staircaseCorrect = jsPsych.data.get().last(1).values()[0].staircaseCorrect;
			countNAN = jsPsych.data.get().last(1).values()[0].countNAN;

			changeAngle = jsPsych.data.get().last(1).values()[0].changeAngle;
			//------------------------------------------------------------------

			fixationDot(probe_pos);
			_4bars(finalAngles);
			cue_flag = 0;
			_4arcs(cue_flag);
			stim_str = s.toString();
			s.clear();
			return stim_str;
		},
/*		on_load: function() 
		{
  		    console.log('RB just finished loading.');
  		},
*/ 		on_finish: function(data)
  		{
  			// recording subject data
			sub_response = [90, 77].indexOf(data.key_press); // 0 for no change and 1 for change
  			if(data.rt == null) { sub_RT = data.rt; }
  			else { sub_RT = (data.rt).toFixed(2); }

  			//------------------------------------------------------------------
			// PASS ON DATA
			//------------------------------------------------------------------
  			data.finalAngles = finalAngles;

  			data.Response_AFC = sub_response;
  			data.RT_AFC = sub_RT;

  			data.changeAngle = changeAngle;

  			data.countCorrect = countCorrect;
  			data.staircaseCorrect = staircaseCorrect;
  			data.countNAN = countNAN;
  			//------------------------------------------------------------------
  			console.log("s8 = "+((new Date()).getTime() - a));
  		}
	}
	return psychBlock_R;
}

//--------------------------------------
// FEEDBACK MESSAGE
//--------------------------------------

function feedback_message(duration, probe_pos, changeState, trialNum)
{
	finalAngles = [];
	var sub_response;
	var RT_AFC;
	var curr_changeAngle;

	var countCorrect;
	var staircaseCorrect;
	var countNAN;

	var feedback = 
	{
		type: "html-keyboard-response",
		choices: jsPsych.NO_KEYS,
		stimulus: function(data)
		{
			a = (new Date()).getTime();
			//------------------------------------------------------------------
			// PASS ON DATA
			//------------------------------------------------------------------
			RT_AFC = jsPsych.data.get().last(1).values()[0].RT_AFC;

			finalAngles = jsPsych.data.get().last(1).values()[0].finalAngles;
			//------------------------------------------------------------------

			// will be used for comparing subject response with atual response
			sub_response = jsPsych.data.get().last(1).values()[0].Response_AFC;	

			// will be used for new change angle calculation
			curr_changeAngle = jsPsych.data.get().last(1).values()[0].changeAngle;

			// will be used for counting responses
			countCorrect = jsPsych.data.get().last(1).values()[0].countCorrect;
			staircaseCorrect = jsPsych.data.get().last(1).values()[0].staircaseCorrect;
			countNAN = jsPsych.data.get().last(1).values()[0].countNAN;
			
			// reset after every block
			if(trialNum == 1) 
			{ 
				countCorrect = 0; 
				staircaseCorrect = 0;
				countNAN = 0;
			}
			
			// reset staircase variables after every 8 trials
			if(trialNum > 10 && trialNum % 10 == 1)
			{
				staircaseCorrect = 0;
				countNAN = 0;
			}
			
			// compare subject response and actual response
			if(sub_response == changeState[probe_pos])
			{
				countCorrect = countCorrect + 1; 
				staircaseCorrect = staircaseCorrect + 1;
				return "<p>Correct Response.</p>";
			}
			else if(sub_response == -1)
			{
				countNAN = countNAN + 1;
				return "<p>No Response recorded.</p>";
			}
			else
			{
				return "<p>Incorrect Response.</p>";
			}
		},
		trial_duration: duration,
/*		on_load: function() 
		{
  		    console.log('Feedback just finished loading.');
  		},
*/		on_finish: function(data)
		{
			//------------------------------------------------------------------
			// PASS ON DATA
			//------------------------------------------------------------------
			data.finalAngles = finalAngles;

			data.Response_AFC = sub_response;
			data.RT_AFC = RT_AFC;

			data.countCorrect = countCorrect;
			data.staircaseCorrect = staircaseCorrect;
			data.countNAN = countNAN;
			console.log("countCorrect "+data.countCorrect);
			console.log("staircaseCorrect "+data.staircaseCorrect);
			console.log("countNAN "+data.countNAN);
			//------------------------------------------------------------------

			// staircase session
			if(trialNum >= 10 && trialNum % 10 == 0 && countNAN != 10)
			{
				CR = staircaseCorrect;
				NAN = countNAN;
				meanCorrect = (CR / (10 - NAN)).toFixed(2);
				changeAngle = curr_changeAngle + ((threshold - meanCorrect) * step);

				data.meanCorrect = meanCorrect;
				data.changeAngle = changeAngle;
				data.oldChangeAngle = curr_changeAngle;

				console.log("new changeAngle = "+data.changeAngle);
				console.log("meanCorrect = "+data.meanCorrect);
			}
			else
			{
				data.changeAngle = curr_changeAngle;
				console.log("same changeAngle = "+data.changeAngle);
			}
			console.log("Feedback = "+((new Date()).getTime() - a));
		}
	}
	return feedback;
}

//--------------------------------------------
// STORING DATA
//--------------------------------------------

function storeData(blockNum, trialNum, cue_pos, initialAngles, changeState, changeDirection, delayDurationFixation, delayDuration, probe_pos)
{
	var finalAngles = [];
	var Response_AFC;
	var RT_AFC;

	var changeAngle;
	var meanCorrect;

	var countCorrect;
	var staircaseCorrect;
	var countNAN;

	var psychBlock_Func = 
	{
		type:"html-keyboard-response", // dummy
		data:
		{
			subjectNum: subjectNum,
			blockNum: blockNum,
			trialNum: trialNum,
			WM_cue: cue_pos,
			initialAngles: initialAngles,
			delayDurationFixation: delayDurationFixation,
			delayDuration: delayDuration,
			changeState: changeState,
			changeDirection: changeDirection,
			WM_Probe: probe_pos
		},
		on_load: function(data) 
		{
  		    console.log('Storing Data...');
  		},
		stimulus: function()
		{
			//------------------------------------------------------------------
			// GET DATA FOR STORING
			//------------------------------------------------------------------
			finalAngles = jsPsych.data.get().last(1).values()[0].finalAngles;

			Response_AFC = jsPsych.data.get().last(1).values()[0].Response_AFC;
			RT_AFC = jsPsych.data.get().last(1).values()[0].RT_AFC;

			countCorrect = jsPsych.data.get().last(1).values()[0].countCorrect;
			staircaseCorrect = jsPsych.data.get().last(1).values()[0].staircaseCorrect;
			countNAN = jsPsych.data.get().last(1).values()[0].countNAN;

			changeAngle = jsPsych.data.get().last(1).values()[0].changeAngle;
			meanCorrect = jsPsych.data.get().last(1).values()[0].meanCorrect;
			oldChangeAngle = jsPsych.data.get().last(1).values()[0].oldChangeAngle
			//------------------------------------------------------------------

			return " ";
		},
		trial_duration: 15,
		on_finish: function(data)
		{
			data.is_trialData = 1;

			data.finalAngles = finalAngles;
			data.Response_AFC = Response_AFC;
			data.RT_AFC = RT_AFC;

			data.countCorrect = countCorrect;
			data.staircaseCorrect = staircaseCorrect;
			data.countNAN = countNAN;

			data.changeAngle = changeAngle;
			data.meanCorrect = meanCorrect;
			data.oldChangeAngle = oldChangeAngle;

			if(trialNum % 10 == 0)
			{
				data.is_staircaseData = 1;
			}
		}
	}
	return psychBlock_Func;
}


//--------------------------------------
//**************************************
// Messages to the subject - Psych blocks
//**************************************
//--------------------------------------

//--------------------------------------------
// AT THE START OF THE EXPERIMENT
//--------------------------------------------

var full_screen = 
{
	type: "fullscreen",
	fullscreen_mode: true,
};

// Welcome
var welcome_block = 
{
	type: "html-keyboard-response",
	stimulus: "<p style = 'font-size:20px'>Welcome to the practice experiment..</p><p style = 'font-size:20px'>Press any key to "
			  +"begin.</p>",
};

// resizing the sizes of stimuli based on input from subject
var inputs = 
{
  type: 'resize',
  item_width: 3 + 3/8,
  item_height: 2 + 1/8,
  prompt: "<p style = 'font-size:20px'>Click and drag the lower right corner of the box until it is the size of a credit card held up to the screen.</p>",
  pixels_per_unit: 135
};

// Instructions
var instructions = 
{
	type: "html-keyboard-response",
	stimulus: "<p style = 'font-size:27px'><strong>INSTRUCTIONS</strong></p><p style = 'font-size:27px'>In this experiment, "
			  +"there will be 4 circular placeholders on the "
			  +"screen. You need to maintain eye fixation on the "
			  +"dot at the centre of the screen throughout the duration of the"
			  +" experiment.</p><p style = 'font-size:27px'>Each of the placeholders will contain a "
			  +"randomly oriented bar. You will be given a small duration of "
			  +"time to memorise the orientations at their respective "
			  +"locations. Shortly after, there may be a a brief flash "
			  +"on any one of the arcs located adjacent to the placeholders. "
			  +"This has no relevancy to the task in the experiment.</p><p style = 'font-size:27px'>" 
			  +"The next screen will consist of another 4 oriented bars but "
			  +"with any number of bars having changed angles. One of quadrants "
			  +"of the dot at the centre will have changed to yellow. This "
			  +"indicates the location where you are being probed about "
			  +"whether a change has occured from the first set of oriented "
			  +"bars.</p><p style = 'font-size:27px'>To indicate a <strong>change</strong>, press the "
			  +"<strong>'m' key</strong>, and to indicate a "
			  +"<strong>no change</strong>, press the <strong>'z' key"
			  +"</strong>.</p><p style = 'font-size:27px'>There are 64 such trials, in a single block. "
			  +"You are required to complete 8 such blocks. You will be able "
			  +"to take breaks in between each block.</p><p style = 'font-size:27px'>Press any key "
			  +"to continue.</p>"
};

// example image
var example = 
{
	type: "image-keyboard-response",
	stimulus: 'image/example.png',
	prompt: "<p style = 'font-size:30px'>This is an example of sequence of events occuring "
			+"in a single trial."
} 

//--------------------------------------------
// DURING THE EXPERIMENT
//--------------------------------------------

function pre_block_msg(blockNum, isTrial1)
{
	var changeAngle;
	var countCorrect;
	var staircaseCorrect;
	var countNAN;

	var msg = 
	{
		type: "html-keyboard-response",
		stimulus: function(data)
		{
			// initialising at the start
			if(blockNum == 1 && isTrial1)
			{
				changeAngle = 30;
				countCorrect = 0;
				staircaseCorrect = 0;
				countNAN = 0;
			}
			else
			{
				//------------------------------------------------------------------
				// PASS ON DATA
				//------------------------------------------------------------------
				changeAngle = jsPsych.data.get().last(1).values()[0].changeAngle;

				countCorrect = jsPsych.data.get().last(1).values()[0].countCorrect;
				staircaseCorrect = jsPsych.data.get().last(1).values()[0].staircaseCorrect;
				countNAN = jsPsych.data.get().last(1).values()[0].countNAN;
				//------------------------------------------------------------------
			}

			return "<p style = 'font-size:25px'>This is experiment block - "+(blockNum)+"</p>"
				   +"<p style = 'font-size:25px'>Press any key to start the block.</p>";
		},
		on_finish: function(data)
		{
			//------------------------------------------------------------------
			// PASS ON DATA
			//------------------------------------------------------------------
			data.changeAngle = changeAngle;

			data.countCorrect = countCorrect;
			data.staircaseCorrect = staircaseCorrect;
			data.countNAN = countNAN;
			//------------------------------------------------------------------
		}
	};
	return msg;
}

function post_block_msg(curr_totalTrialNum)
{
	var changeAngle;
	var countCorrect;
	var staircaseCorrect;
	var countNAN;

	var msg = 
	{
		type: "html-keyboard-response",
		stimulus: function(data)
		{
			//------------------------------------------------------------------
			// PASS ON DATA
			//------------------------------------------------------------------
			changeAngle = jsPsych.data.get().last(1).values()[0].changeAngle;

			countCorrect = jsPsych.data.get().last(1).values()[0].countCorrect;
			staircaseCorrect = jsPsych.data.get().last(1).values()[0].staircaseCorrect;
			countNAN = jsPsych.data.get().last(1).values()[0].countNAN;
			//------------------------------------------------------------------

			var accuracy = (countCorrect/curr_totalTrialNum).toFixed(4);

			return "<p style = 'font-size:20px'>Accuracy: "+accuracy+"</p>"
				  +"<p style = 'font-size:20px'>You can now take a break. To begin the next block"
				  +", <strong>press any key</strong>.</p>";
		},
		on_finish: function(data)
		{
			//------------------------------------------------------------------
			// PASS ON DATA
			//------------------------------------------------------------------
			data.changeAngle = changeAngle;

			data.countCorrect = countCorrect;
			data.staircaseCorrect = staircaseCorrect;
			data.countNAN = countNAN;
			//------------------------------------------------------------------
			console.log("changeAngle - "+data.changeAngle);
		}
	};
	return msg;
}


//--------------------------------------
//**************************************
// Timeline of the experiment
//**************************************
//--------------------------------------

function createTimeline()
{
	var exp_timeline = [];
	jsPsych.data.addProperties({subjectNum: subjectNum});
//	noise_str = generateNoiseMask();
	exp_timeline.push(full_screen, welcome_block, inputs, instructions, example);

	var curr_totalTrialNum = 0;
	var isTrial1 = 1;

	for(curr_blockNum = 0; curr_blockNum < n_blocks; curr_blockNum++)
	{
		exp_timeline.push(pre_block_msg(curr_blockNum+1, isTrial1));
		isTrial1 = 0;

		for(curr_trialNum = 0; curr_trialNum < n_practiceTrials; curr_trialNum++)
		{	
			// counterbalance
			var initialAngles = [];
			var changeState = [];
			var changeDirection = [];
			cue_pos = cue_sequence[curr_totalTrialNum];
			probe_pos = probe_sequence[curr_totalTrialNum];
			delaytime = timeorder[curr_totalTrialNum];
			for(i = 0; i < 4; i++)
			{
				initialAngles[i] = initialAnglesMat[i][curr_totalTrialNum];
				changeState[i] = changeStateMat[i][curr_totalTrialNum];
				changeDirection[i] = changeDirectionMat[i][curr_totalTrialNum];
			}

			screen1_time = Math.floor((Math.random()*50) + 450);
			exp_timeline.push(screen1(screen1_time, curr_totalTrialNum+1));
			screen2_time = 200;
			exp_timeline.push(screen2(screen2_time, initialAngles));
			screen3_time = 50;
			exp_timeline.push(screen3(screen3_time));
			screen4_time = delaytime;
			cue_flag = 0;
			exp_timeline.push(delay_cue(screen4_time, cue_flag));
			screen5_time = 50;
			cue_flag = 1;
			exp_timeline.push(delay_cue(screen5_time, cue_flag, cue_pos));
			screen6_time = 1500 - (screen2_time + screen3_time + screen4_time + screen5_time);
			cue_flag = 0;
			exp_timeline.push(delay_cue(screen6_time, cue_flag));
			screen7_time = 200;
			exp_timeline.push(screen7(screen7_time, initialAngles, changeState, changeDirection));
			ResponseBlock_time = 1800;
			exp_timeline.push(ResponseBlock(ResponseBlock_time, probe_pos));
			feedback_message_time = 2000;
			exp_timeline.push(feedback_message(feedback_message_time, probe_pos, changeState, curr_trialNum+1));
			exp_timeline.push(storeData(curr_blockNum+1, curr_trialNum+1, cue_pos+1, initialAngles, changeState, changeDirection, screen1_time, delaytime, probe_pos+1))

			curr_totalTrialNum++;
		}
		exp_timeline.push(post_block_msg(curr_totalTrialNum));
	}
	return exp_timeline;
}









