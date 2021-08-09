let request = require("request");
let cheerio = require("cheerio");
let fs = require("fs");
let path = require("path");

// let url = "https://www.espncricinfo.com/series/ipl-2020-21-1210595/delhi-capitals-vs-mumbai-indians-final-1237181/full-scorecard"
// request(url,cb);

function processSingleMatch(url){
request(url,cb);
}

function cb(error,response,html){
    if(error){
        console.log(error);
    }else if(response.statusCode == 404){
        console.log("PAGE NOT FOUND");
    }else{
        dataExtracter(html);
    }
} 

function dataExtracter(html){
    //search tool
    let searchTool = cheerio.load(html);
    // css selector
    let bothInningsArr = searchTool(".Collapsible");
    for(let i =0;i < bothInningsArr.length;i++){
        let teamNameElem = searchTool(bothInningsArr[i]).find("h5").text().trim();
        let teamName = teamNameElem.split("INNINGS")[0];
        //console.log(teamName);
        let srcpath = process.cwd();
        //console.log(srcpath);
        let newPath = path.join(srcpath,`${teamName}`);
        //console.log(newPath);
        if(fs.existsSync(newPath)==false){
            fs.mkdirSync(newPath);
        }
        let batsmanTableBodyAllRows = searchTool(bothInningsArr[i]).find(".table.batsman tbody tr");
        for(let j = 0;j<batsmanTableBodyAllRows.length;j++){
            let numberOFTD = searchTool(batsmanTableBodyAllRows[j]).find("td");
            if(numberOFTD.length == 8){
                let playerName = searchTool(numberOFTD[0]).text().trim();
                console.log(playerName);
                let playerPath = path.join(newPath,`${playerName}`);
                if(fs.existsSync(playerPath)==false){
                    fs.mkdirSync(playerPath);
                }
            }
        }
        console.log("``````````````````````````````");
    }

    
}

module.exports ={
    processSingleMatch
}

