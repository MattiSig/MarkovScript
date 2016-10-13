var express = require('express');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var app     = express();
var Markov = require("./markovChain.js");

app.get('/scrape', function(req, res){

var url = 'http://www.imsdb.com/scripts/Clerks.html';
var sentance;

request(url, function(error, response, html){
    if(!error){
        var $ = cheerio.load(html);

    var character, sceene, lines;
    var json = { character : [], sceene : '', lines : ''};

    $('pre').filter(function(){
        //var data = $(this);
        $('b').each(function(index, a){

            var string = $(a).text();
            var first = string.slice(0,4);
            var next = string.slice(4,5);
            var name = string.slice(4,string.length-1);
            
            if (!(next=="\t") && first == "\t\t\t\t"){
                json.character.push(name);
            }
        });
    });
    
    var data = ($("pre")
    .clone()    //clone the element
    .children() //select all the children
    .remove()   //remove all the children
    .end()  //again go back to selected element
    .text());
    
    console.log(data.length);

    for(var i=0; i < data.length-1; i++){
        var temp = data.slice(i,i+4);
        var next = data.slice(i+4,i+5);

        if(temp == "\n\n\t\t" && !(next == "\t")){
            var running= true;
            var j = i+3;
            
            while(running){
                var temp2 = data.slice(j, j+2)
                if(temp2 == "\n\n"){
                    var lines = data.slice(i+4,j);
                    var fixedLines = lines.replace(/\n\t\t|\t/g,' ');
                    var fixedAgain = fixedLines.replace(/\"/g,'');
                    json.lines = json.lines + fixedAgain + "# ";
                    running = false;
                }

                j++
                if(j >125040){
                    running = false;
                }
            }
        }
    }

    for(var i=0; i<data.length-1; i++){
        var temp = data.slice(i,i+3);
        var next = data.slice(i+3,i+4);

        if(temp == "\n\n\t" && !(next == "\t")){
            var running= true;
            var j = i+3;
            
            while(running){
                var temp2 = data.slice(j, j+2)
                if(temp2 == "\n\n"){
                    var sceene = data.slice(i+3,j);
                    var fixedSceene = sceene.replace(/\n\t/g,' ');
                    json.sceene = json.sceene + fixedSceene + "#";
                    running = false;
                }

                j++
                if(j >125040){
                    running = false;
                }
            }
        }
    }

    sentance = Markov(json.lines);
}

// To write to the system we will use the built in 'fs' library.
// In this example we will pass 3 parameters to the writeFile function
// Parameter 1 :  output.json - this is what the created filename will be called
// Parameter 2 :  JSON.stringify(json, null, 4) - the data to write, here we do an extra step by calling JSON.stringify to make our JSON easier to read
// Parameter 3 :  callback function - a callback function to let us know the status of our function

fs.writeFile('output.json', JSON.stringify(json, null, 4), function(err){

    console.log('File successfully written! - Check your project directory for the output.json file');

});

// Finally, we'll just send out a message to the browser reminding you that this app does not have a UI.
res.send(sentance);

    });
});

app.listen('8081');
console.log('Magic happens on port 8081');
exports = module.exports = app;