
function MarkovChain(stringToProcess){

	var stringArray = stringToProcess.split(' ');
	var weirdChar = /[.,:;?!#]/g;
	var processedStringArray = [];

	var paranthesisString = '';
	var isInParanthesis = false;

	console.log('processing strings...');

	for(var i = 0; i<stringArray.length; i++){
		//check if end of string is a weird char
		var string = stringArray[i];
		string = string.trim();
		var lastChar = string.substr(string.length-1);
		var firstChar = string.substr(0,1);

		//SPECIAL CASE - parenthesis
		//if first character is "(" look for the word that closes the 
		// ")" and add that sentance as one word
		if(isInParanthesis){
			
			if(lastChar === ')'){
				paranthesisString += string;
				processedStringArray.push(paranthesisString);
				paranthesisString = '';
				isInParanthesis = false;
				continue;
			}
			paranthesisString += string + ' ';
			continue;
		}

		if(firstChar === '('){
			isInParanthesis = true
			paranthesisString += string + ' ';
			continue;
		}

		//if last char is weird, handle with care
		if(lastChar.match(weirdChar)){

			//SPECIAL CASE - ...
			//if we are dealing with '...', just add it
			if(string.substr(string.length-3) === '...'){
				processedStringArray.push(string);
				continue;
			}

			//split the word in two
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
			var options = markovDictionary['#'];
			firstRun = false;
		}else{
			var options = markovDictionary[currentWord];
		}

		nextWord = options[Math.floor(Math.random()*options.length)];
		console.log(nextWord);

		//If we have a weirdChar we dont add a space before it
		if(nextWord.match(weirdChar) && nextWord.length === 1){
			//# ends the sentence
			if(nextWord === '#'){
				run = false;
				break;
			}
			console.log('sup:', nextWord);

			markovSentence = markovSentence + nextWord
		}else{

			if(currentWord === '...'){
				markovSentence = markovSentence + nextWord;
			}
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
