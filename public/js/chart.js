var info = document.getElementById('info').innerHTML;
var numberinfo = document.getElementById('numberinfo').innerHTML;
var question = document.getElementById('resultsquestion').innerHTML;
//get answers for chart
var answers = [];

info = info.substring(info.indexOf('[') + 1, info.indexOf(']'));
info = info.split('{');
    
    for(var i = 0; i < info.length; i++){   
        var startParse = info[i].indexOf("'") + 1;
        var endParse = info[i].lastIndexOf("'");
        if(startParse != -1 && endParse != -1){
            var parsedAnswer = info[i].substring(startParse, endParse);
            answers.push(testForSlash(parsedAnswer));
        }
    }
//get numbers for chart
var numbers = [];

numberinfo = numberinfo.split('|');
numberinfo.splice(0, 1);

for(var i = 0; i < numberinfo.length; i++){
    numbers.push(parseInt(numberinfo[i]));
}

new Chart(document.getElementById("myChart"), {
    type: 'doughnut',
    data: {
      labels: answers,
      datasets: [
        {
          label: question,
          backgroundColor: ["#3e95cd", "#8e5ea2","#3cba9f","#e8c3b9","#c45850"],
          data: numbers
        }
      ]
    },
    options: {
      title: {
        display: true,
        text: question,
        fontSize: 50
      }
    }
});
//check for escape backslashes 
function testForSlash(thisStr){

    if(thisStr.indexOf("'") != -1){
        thisStr = thisStr.split("");
        thisStr.splice(thisStr.indexOf("'") - 1, 1);
        return thisStr.join("");       
    }
    return thisStr;
}