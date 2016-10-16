var express = require('express');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var app     = express();
var Markov = require("./markovChain.js");
var wrapText = require("./utils.js")


//define prefix for different units
var CHARACTER_PREFIX = "\t\t\t\t";
var LINE_PREFIX = "\n\n\t\t";

//work in progress
app.get('/', function(req, res, next){
    console.log('sending html');  
    res.sendFile(__dirname + '/index.html');
});

// app.use(function(req, res, next) {
//     console.log("danni kann ekki .append")
//     var $ = cheerio.load('<div>...</div>');

//     $('div').append('<li class="plum">Plum</li>')
//     $.html();
// });

app.get('/scrape', function(req,res){
    var url = 'http://www.imsdb.com/scripts/Clerks.html';
    var sentance;
    var json;

    request(url, function(error, response, html){
        if(!error){
            var $ = cheerio.load(html);
            var character, sceene, lines;
            json = { character : [], sceene : '', lines : ''};

            $('pre').filter(function(){
                //var data = $(this);
                $('b').each(function(index, a){

                    var string = $(a).text();
                    var first = string.slice(0,4);
                    var next = string.slice(4,5);
                    var name = string.slice(4,string.length-1);
                    
                    if (!(next=="\t") && first == CHARACTER_PREFIX){
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

                if(temp == LINE_PREFIX && !(next == "\t")){

                    var running= true;
                    var j = i+3;
                    
                    while(running){
                        var temp2 = data.slice(j, j+2)
                        if(temp2 == "\n\n"){
                            var lines = data.slice(i+4,j);
                            lines = lines.replace(/\n\t\t|\t/g,' ');
                            lines = lines.replace(/\"/g,'');
                            lines = lines.replace(/\.\.\.|\.\.\.\./g," ... ");
                            lines = lines.replace(/  |   /g," ");

                            json.lines = json.lines + lines + " # ";
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
                            json.sceene = json.sceene + fixedSceene + " # ";
                            running = false;
                        }

                        j++
                        if(j >125040){
                            running = false;
                        }
                    }
                }
            }
        }

        //--------- WRITE SCRIPT -------//
        var script = "";

        //opening stuff, write out "scene for now"
        script += "\n\t" + "SCENE:" + "\n";

        //create scene
        var sceene = wrapText(Markov(json.sceene), 55, "\n\t");;
        script += '\t' + sceene;

        //create convo
        characters = json.character;
        for(var i = 0 ; i<10 ; i++){
            var character = characters[Math.floor(Math.random()*characters.length)];
            var line = wrapText(Markov(json.lines), 35, "\n\t\t");

            //add character says
            script += '\n\n' + CHARACTER_PREFIX + character;

            //add line that character says
            script += '\n\t\t' + line;
        }

        //write script to script.txt and send to browser
        fs.writeFile('script.txt', script,function(err){
            res.sendFile('script.txt', {root: __dirname});
        })

        // Finally, we'll just write out our json fie to output.json
        fs.writeFile('output.json', JSON.stringify(json, null, 4), function(err){
            console.log('File successfully written! - Check your project directory for the output.json file');
        });
    });
});

app.listen('8081');
console.log('Magic happens on port 8081');
exports = module.exports = app;