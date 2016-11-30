var express = require('express');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var app     = express();
var Markov = require("./markovChain.js");
var wrapText = require("./utils.js")
var path = require('path');

//define prefix for different units
var CHARACTER_PREFIX = "\t\t\t\t";
var LINE_PREFIX = "\n\n\t\t";
var script = "";

//use css
app.use(express.static(__dirname));
var visits = 0;
//work in progress
app.get('/', function(req, res, next){
    visits++;
    console.log('visits : ' + visits);  
    res.sendFile(__dirname + '/index.html');
});
var clicked = 0
app.get('/scrape', function(req,res){
    var url = 'http://www.imsdb.com/scripts/Clerks.html';
    var sentance;
    var json = { character : ["Bergur", "Jón Gunnar", "Hannes", "Björn", "Finnur"], sceene : '', lines : ''};
    var sceene = fs.readFileSync('textaskra/sceene.txt', 'UTF-8');
    var lines = fs.readFileSync('textaskra/lines.txt', 'UTF-8');
    json.sceene = sceene;
    json.lines = lines;
    clicked++;
    console.log("clicked : " + clicked);
    /*request(url, function(error, response, html){
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
        script += "<br/>" + "SCENE:" + "\n";

        //create scene
        var sceene = wrapText(Markov(json.sceene), 55, "\n\t");;
        script += '\t' + sceene;
        //console.log(script);

        //create convo
        characters = json.character;
        for(var i = 0 ; i<10 ; i++){
            var character = characters[Math.floor(Math.random()*characters.length)];
            var line = wrapText(Markov(json.lines), 35, "\n\t\t");

            //add character says
            script += '<br/><br/><b>' + character + '</b>';

            //add line that character says
            script += '<br/>' + line;
        }
        var jsonScript = [{script: ""}];
        jsonScript.script = script;
        console.log(jsonScript.script);
        
        res.send(jsonScript.script);
        //þarf ekki lengur að gera .txt og .json srkár
        // Finally, we'll just write out our json fie to output.json
        /*fs.writeFile('output.json', JSON.stringify(json, null, 4), function(err){
            console.log('File successfully written! - Check your project directory for the output.json file');
        });

        //write script to script.txt and send to browser
        fs.writeFile('script.txt', script,function(err){
            var file = __dirname + '/script.txt';

            var filename = path.basename(file);
            var mimetype = 'application/x-please-download-me';

            res.setHeader('Content-disposition', 'attachment; filename=' + filename);
            res.setHeader('Content-type', mimetype);

            var filestream = fs.createReadStream(file);
            filestream.pipe(res);
        })
    });*/
//--------- WRITE SCRIPT -------//
        var script = "";

        //opening stuff, write out "scene for now"
        script += "<br/>" + "\n";

        //create scene
        var sceene = wrapText(Markov(json.sceene), 55, "\n\t");;
        script += '<I>' + sceene + '</I>';
        //console.log(script);

        //create convo
        characters = json.character;
        for(var i = 0 ; i<15 ; i++){
        if((Math.random()*100) > 70){
            var sceene = Markov(json.sceene);
            sceene = sceene.replace(/<name>/g, characters[Math.floor(Math.random()*characters.length)]);
            script += '<br/><br/><I>' + sceene + '</I>';
        }else{
            var character = characters[Math.floor(Math.random()*characters.length)];
            var line = Markov(json.lines);
            line = line.replace(/<name>/g, characters[Math.floor(Math.random()*characters.length)]);
            //add character says
            script += '<br/><br/><b>' + character + '</b>';

            //add line that character says
            script += '<br/>' + line};
        }
        var jsonScript = [{script: ""}];
        jsonScript.script = script;
        console.log(typeof(characters[Math.floor(Math.random()*characters.length)]));
        res.send(jsonScript.script);

});

app.listen('8081');
console.log('Magic happens on port 8081');
exports = module.exports = app;