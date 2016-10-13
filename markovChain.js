
function MarkovChain(stringToProcess){

	var stringArray = stringToProcess.split(' ');
	var weirdChar = /[().,:;?!#]/g;
	var processedStringArray = [];

	console.log('processing strings...');

	for(var i = 0; i<stringArray.length; i++){
		//check if end of string is a weird char
		var string = stringArray[i];
		string = string.trim();
		var lastChar = string.substr(string.length-1);

		//if last char is weird, split the word in two
		if(lastChar.match(weirdChar)){
			var firstPart = string.substring(0,string.length-1);
			var weirdPart = lastChar;
			processedStringArray.push(firstPart);
			processedStringArray.push(weirdPart);
		}else{
			processedStringArray.push(string);
		}
	}

	//mixa dictionary með key sem orð og value sem array af orðum sem hafa komið eftir því orði
	var markovDictionary = {};

	for(var i = 0; i<processedStringArray.length; i++){
		if(i+1 < processedStringArray.length-1){
			//ná í orðið sem við erum að skoða og næsta orð
			var currentWord = processedStringArray[i];
			var nextWord = processedStringArray[i+1];

			//ná í array sem inniheldur nextWordArray við currentWord og bæta nextWord við
			var keyArray = [];
			if (markovDictionary.hasOwnProperty(currentWord)){
				keyArray = markovDictionary[currentWord];
			}
			keyArray.push(nextWord);
			markovDictionary[currentWord] = keyArray;

		}
	}

	console.log('creating markov chain...');

	var currentWord = '';
	var nextWord = '';
	var markovSentence = '';
	var run = true;
	var firstRun = true;

	while(run){
		if(firstRun){
			var options = markovDictionary['.'];
			firstRun = false;
		}else{
			var options = markovDictionary[currentWord];
		}

		nextWord = options[Math.floor(Math.random()*options.length)];
		console.log(nextWord);

		if(nextWord.match(weirdChar) && nextWord.length === 1){
			if(nextWord === '#'){
				run = false;
				break;
			}
			console.log('sup:', nextWord);

			markovSentence = markovSentence + nextWord
		}else{
			markovSentence = markovSentence + ' ' + nextWord;
		}
		currentWord = nextWord;
	}
	console.log('MarkovChain sentence is: ' + markovSentence);

	return markovSentence;
}

function endsWith(str, suffix) {
    return str.indexOf(suffix, str.length - suffix.length) !== -1;
}



module.exports = MarkovChain;
