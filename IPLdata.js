let request = require("request");
let cheerio = require("cheerio");
let scorecard = require("./step3");

let url = "https://www.espncricinfo.com/series/ipl-2020-21-1210595"

request(url,cb);

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
    let anchorrep = searchTool('a[data-hover="View All Results"]');
    let link = anchorrep.attr("href");
    //console.log(link);
    let fullAllMatchPageLink = `https://www.espncricinfo.com${link}`;
    //console.log(fullAllMatchPageLink);
    request(fullAllMatchPageLink,allMatchPageCb);

}
function allMatchPageCb(error,response,html){
    if(error){
        console.log(error);
    }else if(response.statusCode == 404){
        console.log("PAGE NOT FOUND");
    }else{
        getAllScoreCardLink(html);
    }
}
function getAllScoreCardLink(html){
    let searchTool = cheerio.load(html);
    let scorecardsArr = searchTool("a[data-hover='Scorecard']");
    //console.log(scorecardsArr.length);
    for(let i =0;i<scorecardsArr.length;i++){
        let link = searchTool(scorecardsArr[i]).attr("href");
        let fullAllMatchPageLink = `https://www.espncricinfo.com${link}`;
        // console.log(fullAllMatchPageLink);
        scorecard.processSingleMatch(fullAllMatchPageLink);
    }
}
