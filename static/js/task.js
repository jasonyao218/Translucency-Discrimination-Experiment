/*
 * Requires:
 *     psiturk.js
 *     utils.js
 */

// Initalize psiturk object
var psiTurk = new PsiTurk(uniqueId, adServerLoc, mode);

var mycondition = condition;  // these two variables are passed by the psiturk server process
var mycounterbalance = counterbalance;  // they tell you which condition you have been assigned to
// they are not used in the stroop code but may be useful to you

// All pages to be loaded
var pages = [
	"instructions/instruct-1.html",
	"instructions/instruct-ready.html",
	"stage.html",
	"postquestionnaire.html"
];

psiTurk.preloadPages(pages);

var instructionPages = [ // add as a list as many pages as you like
	"instructions/instruct-1.html",
	"instructions/instruct-ready.html"
];


/********************
* HTML manipulation
*
* All HTML files in the templates directory are requested 
* from the server when the PsiTurk object is created above. We
* need code to get those pages from the PsiTurk object and 
* insert them into the document.
*
********************/



/********************
* STROOP TEST       *
********************/
var StroopExperiment = function() {

	var wordon, // time word is presented
	    listening = false;

	// Stimuli for a basic Stroop experiment
	
	// var stims = [
	// 		["00", "cap", "cube"],
	// 		["00", "buddha", "dragon"],
	// 		["00", "lucy", "bust"],
	// 		["00", "star_smooth", "bunny"],
	// 		["00", "bunny", "lucy"]
	// 	];
	function getStims(){
		var stims = [];
		$.ajax({
			url: "/pick_trail",
			type: "POST",
			dataType: "json",
			async: false,
			success: function(data){
				for (var i in data){
					stims.push(data[i])
				}
			}
		});
		return stims;
	}
	var stims = getStims();
	console.log(stims);
	stims = _.shuffle(stims);

	var next = function() {
		if (stims.length===0) {
			// console.log(123);
			finish();
		}
		else {
			stim = stims.shift();
			console.log(stim);
			render_img(stim);
			wordon = new Date().getTime();
			listening = true;
			d3.select("#query").html('<p id="prompt">Both "A" and "B" have two different translucenct objects.</p><p id="prompt">Which of the pair has larger difference in translucency? Please press &uarr; key for "A" or &darr; key for "B"</p>');
		}
	};
	
	var response_handler = function(e) {
		if (!listening) return;

		var keyCode = e.keyCode,
			response;

		switch (keyCode) {
			case 38:
				response="up";
				break;
			case 40:
				response="down";
				break;
			default:
				response = "";
				break;
		}
		if (response.length>0) {
			listening = false;
			var hit = response == stim[1];
			var rt = new Date().getTime() - wordon;
			if(response == "up"){
				psiTurk.recordTrialData({'phase':"TEST",
                                     'folder':stim[0],
                                     'object1':stim[1],
                                     'object2':stim[2],
                                     'response':stim[1],
                                     'hit':hit,
                                     'rt':rt}
                                   );
			}
			if(response == "down"){
				psiTurk.recordTrialData({'phase':"TEST",
                                     'folder':stim[0],
                                     'object1':stim[1],
                                     'object2':stim[2],
                                     'response':stim[2],
                                     'hit':hit,
                                     'rt':rt}
                                   );
			}
			remove_img();
			next();
		}
	};

	var finish = function() {
	    $("body").unbind("keydown", response_handler); // Unbind keys
	    currentview = new Questionnaire();
	};
	
	var render_img = function(stim) {
		var upimage_1 = "static/datasets/" + stim[0] + "/" + stim[1] + "/0.png";
		var upimage_2 = "static/datasets/" + stim[0] + "/" + stim[1] + "/1.png"; 
		var downimage_1 = "static/datasets/" + stim[0] + "/" + stim[2] + "/0.png";
		var downimage_2 = "static/datasets/" + stim[0] + "/" + stim[2] + "/1.png";
		d3.select("#up-image-grp")
			.append("img")
			.attr("src",upimage_1)
			.attr("id","img1")
			.style("width","49%")
			.style("flex","49%")
			.style("padding","5px");
		d3.select("#up-image-grp")
			.append("img")
			.attr("src",upimage_2)
			.attr("id","img2")
			.style("width","49%")
			.style("flex","49%")
			.style("padding","5px");
		d3.select("#down-image-grp")
			.append("img")
			.attr("src",downimage_1)
			.attr("id","img3")
			.style("width","49%")
			.style("flex","49%")
			.style("padding","5px");
		d3.select("#down-image-grp")
			.append("img")
			.attr("src",downimage_2)
			.attr("id","img4")
			.style("width","49%")
			.style("flex","49%")
			.style("padding","5px");
	};

	var remove_img = function() {
		d3.select("#img1").remove();
		d3.select("#img2").remove();
		d3.select("#img3").remove();
		d3.select("#img4").remove();
	};

	
	// Load the stage.html snippet into the body of the page
	psiTurk.showPage('stage.html');

	// Register the response handler that is defined above to handle any
	// key down events.
	$("body").focus().keydown(response_handler); 

	// Start the test
	next();
};


/****************
* Questionnaire *
****************/

var Questionnaire = function() {

	var error_message = "<h1>Oops!</h1><p>Something went wrong submitting your HIT. This might happen if you lose your internet connection. Press the button to resubmit.</p><button id='resubmit'>Resubmit</button>";

	record_responses = function() {

		psiTurk.recordTrialData({'phase':'postquestionnaire', 'status':'submit'});

		$('textarea').each( function(i, val) {
			psiTurk.recordUnstructuredData(this.id, this.value);
		});
		$('select').each( function(i, val) {
			psiTurk.recordUnstructuredData(this.id, this.value);		
		});

	};

	prompt_resubmit = function() {
		document.body.innerHTML = error_message;
		$("#resubmit").click(resubmit);
	};

	resubmit = function() {
		document.body.innerHTML = "<h1>Trying to resubmit...</h1>";
		reprompt = setTimeout(prompt_resubmit, 10000);
		
		psiTurk.saveData({
			success: function() {
			    clearInterval(reprompt); 
                psiTurk.computeBonus('compute_bonus', function(){
                	psiTurk.completeHIT(); // when finished saving compute bonus, the quit
                }); 


			}, 
			error: prompt_resubmit
		});
	};

	// Load the questionnaire snippet 
	psiTurk.showPage('postquestionnaire.html');
	psiTurk.recordTrialData({'phase':'postquestionnaire', 'status':'begin'});
	
	$("#next").click(function () {
	    record_responses();
	    psiTurk.saveData({
            success: function(){
                psiTurk.computeBonus('compute_bonus', function() { 
                	psiTurk.completeHIT(); // when finished saving compute bonus, the quit
                }); 
            }, 
            error: prompt_resubmit});
	});
    
	
};

// Task object to keep track of the current phase
var currentview;

/*******************
 * Run Task
 ******************/
$(window).load( function(){
    psiTurk.doInstructions(
    	instructionPages, // a list of pages you want to display in sequence
    	function() { currentview = new StroopExperiment(); } // what you want to do when you are done with instructions
    );
});
