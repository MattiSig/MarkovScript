
function wrapString(string, len, splitter){
	string = string.trim();
	var stringArray = string.split(' ');

	var linelength = 0;
	var line = '';

	for(i in stringArray){
		word = stringArray[i];

		linelength += word.length;
		if(linelength > len){
			line += splitter;
			linelength = 0;
		}else{
			line += word + ' ';
		}
	}

	return line;
}

module.exports = wrapString;