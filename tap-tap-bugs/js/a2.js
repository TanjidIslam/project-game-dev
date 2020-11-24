//------------
//System Vars
//------------
var CANVAS_WIDTH = 400,
    CANVAS_HEIGHT = 600,
    TIME_PER_FRAME = 33, //this equates to 30 fps
    GAME_FONTS = "bold 20px sans-serif";
    
var BUG_WIDTH = 40,
    BUG_HEIGHT = 40;
var canvas = document.getElementById("gameCanvas");
canvas.width = CANVAS_WIDTH;
canvas.height = CANVAS_HEIGHT;
var ctx = canvas.getContext("2d");
ctx.font = GAME_FONTS;
var imgLoaded = false;
var mouseX, mouseY, isClicked, urlArray, bugArray, foodArray;
var time, score, blk_bug, org_bug, red_bug;
var xArray, yArray;
var button, level;
var closestFoods = new Object();
var randBug, randIndex;
var images = {};
var change = 0;

var highSCORE = 1;
//Init values
isClicked = false;
blk_bug = "./img/black_bug.png";
red_bug = "./img/red_bug.png";
org_bug = "./img/orange_bug.png";

var foodLoc = ["./img/food_burger.png", "./img/food_pizza.png", "./img/food_soup.png", "./img/food_tomato.png", "./img/food_donut.png"];
var gameDecided;

var play_pause_button;

play_pause_button = document.getElementById("play_pause_button");
function init(){
    //Adding 3 black, 3 red and 4 orange bugs to Bug Array.
    print_hscore();
    addEvent(button, 'click', displayCanvas);
    
}



//------------
//User_defined event handler
//------------
function addEvent(target, type, handler) {
    if (target.addEventListener) {
        target.addEventListener(type, handler, false);
    } else if (target.attachEvent) {
        target.attachEvent('on' + type, function() {
            return handler.call(target, window.event);
        });
    } else {
        target['on' + type] = handler;
    }
}

//------------
//Start button: change display as start button is clicked
//------------
button = document.getElementById("button");
function displayCanvas() {
    document.getElementById("main").style.display = "none";
    document.getElementById("gameCanvas").style.display = "block";
    document.getElementById("head").style.display = 'block';
    if (document.getElementById('option_1').checked) {
        level = 1;
    } else if (document.getElementById('option_2').checked) {
        level = 2;
    }
    startGame();
}


//Starts the game by creating food objects and arranging bug img
function startGame(){
    urlArray = [org_bug];
    for(var c=0; c<3; c++){
        urlArray.push(blk_bug, red_bug, org_bug);
    }
    bugArray = [];
    time = 6000;
    foodEntry();
    score = 0;
    gameDecided = true;
    //Start the game loop
    var gameloop = setInterval(update, TIME_PER_FRAME);
    //Start the bug click event
    canvas.addEventListener("click", canvasClick, false); 
    addEvent(play_pause_button, 'click', play_pause_change);
}

//Obtain food coordinates and make sure
//food objects aren't near each other
function foodEntry(){
    xArray = new Array(); 
    yArray = new Array();

    foodArray = new Array();
    for(var z=0; z<foodLoc.length; z++){
        var newFood = new Object();
        newFood.imgUrl = foodLoc[z];
        var overlaps = true;
        while (overlaps == true){
            xVal = rand(20, canvas.width - 50);
            yVal = rand(350, canvas.height - 50);
            
            var overlaps = isOverlapping(xVal, yVal, xArray, yArray);
        }
        
        xArray.push(xVal);
        yArray.push(yVal);
        newFood.x = xArray[z];
        newFood.y = yArray[z];
        foodArray.push(newFood);
    }
}


function canvasClick(event)
{   
    mouseX = event.clientX - canvas.offsetLeft + document.body.scrollLeft;
    mouseY = event.clientY - canvas.offsetTop + document.body.scrollTop;
    isClicked = true;
} 

//------------
//Game Loop
//------------
function update()
{   
    gameDecider();
    updateBackground();
    createFood();
    
    //Check if we should generate a new bug will be sent
    if (Math.random() < 0.015)
    {
        var newBug = new Object();
        newBug.x = rand(10, canvas.width-10);
        newBug.y = -10;
        randIndex = rand(0, urlArray.length);
        newBug.imgUrl = urlArray[randIndex];
        bugArray.push(newBug);
    }
    time-=3;        //Updates with frame/sec
    var closestFood;
    //Update the position of the rectangles
    for (var i=bugArray.length - 1; i >= 0; i--)
    {   closestFood = closest(bugArray[i], foodArray);

        //Bug detects where to go
        if (closestFood.x < bugArray[i].x ){
            if(level==1 && bugArray[i].imgUrl == blk_bug){
                bugArray[i].x-=5;    
            } 
            else if(level == 2 && bugArray[i].imgUrl == blk_bug){
                bugArray[i].x-=7;
            }
            else if(level==1 && bugArray[i].imgUrl == red_bug){
                bugArray[i].x-=3;    
            }
            else if(level == 2 && bugArray[i].imgUrl == red_bug){
                bugArray[i].x-=4;
            }
            else if(level==1 && bugArray[i].imgUrl == org_bug){
                bugArray[i].x-=2;    
            } 
            else if(level == 2 && bugArray[i].imgUrl == org_bug){
                bugArray[i].x-=3;
            }
        }
        else if (closestFood.x > bugArray[i].x ){
            if(level==1 && bugArray[i].imgUrl == blk_bug){
                bugArray[i].x+=5;    
            } 
            else if(level == 2 && bugArray[i].imgUrl == blk_bug){
                bugArray[i].x+=7;
            }
            else if(level==1 && bugArray[i].imgUrl == red_bug){
                bugArray[i].x+=3;    
            }
            else if(level == 2 && bugArray[i].imgUrl == red_bug){
                bugArray[i].x+=4;
            }
            else if(level==1 && bugArray[i].imgUrl == org_bug){
                bugArray[i].x+=2;    
            } 
            else if(level == 2 && bugArray[i].imgUrl == org_bug){
                bugArray[i].x+=3;
            }
        }
        if (closestFood.y < bugArray[i].y ){
            if(level==1 && bugArray[i].imgUrl == blk_bug){
                bugArray[i].y-=5;    
            } 
            else if(level == 2 && bugArray[i].imgUrl == blk_bug){
                bugArray[i].y-=7;
            }
            else if(level==1 && bugArray[i].imgUrl == red_bug){
                bugArray[i].y-=3;    
            }
            else if(level == 2 && bugArray[i].imgUrl == red_bug){
                bugArray[i].y-=4;
            }
            else if(level==1 && bugArray[i].imgUrl == org_bug){
                bugArray[i].y-=2;    
            } 
            else if(level == 2 && bugArray[i].imgUrl == org_bug){
                bugArray[i].y-=3;
            }
        }
        else if (closestFood.y > bugArray[i].y ){
            if(level==1 && bugArray[i].imgUrl == blk_bug){
                bugArray[i].y+=5;    
            } 
            else if(level == 2 && bugArray[i].imgUrl == blk_bug){
                bugArray[i].y+=7;
            }
            else if(level==1 && bugArray[i].imgUrl == red_bug){
                bugArray[i].y+=3;    
            }
            else if(level == 2 && bugArray[i].imgUrl == red_bug){
                bugArray[i].y+=4;
            }
            else if(level==1 && bugArray[i].imgUrl == org_bug){
                bugArray[i].y+=2;    
            } 
            else if(level == 2 && bugArray[i].imgUrl == org_bug){
                bugArray[i].y+=3;
            }
        } 

        //If bug hits the food, then delete the food object from the array & canvas
        if(hitTestPoint(
            bugArray[i].x, bugArray[i].y, BUG_WIDTH, BUG_HEIGHT, closestFood.x, closestFood.y)) {
            var closestIndex = foodArray.indexOf(closestFood);
            foodArray.splice(closestIndex,1);
        }
        //if bug is out of the canvas range, then remove it
        if (bugArray[i].y > canvas.height)
            bugArray.splice(i, 1);
        else
        {   //dray the bug
            drawObj(bugArray[i].x, bugArray[i].y, bugArray[i].imgUrl);

            if (isClicked)
            {
                //Check for collision
                if (hitTestPoint(
                    bugArray[i].x, bugArray[i].y, BUG_WIDTH, BUG_HEIGHT, mouseX, mouseY))
                {
                    //Update score according to bug specification
                    if(bugArray[i].imgUrl == blk_bug){
                        score += 5;
                    } else if (bugArray[i].imgUrl == red_bug){
                        score += 3;
                    } else {
                        score++;
                    }
                    bugArray.splice(i, 1);
                }                   
            }
        }       
    }
    
    isClicked = false;
    
    //Update Score
    if(score > highSCORE){
        highSCORE = score;
    }
    score_update();

    count_down_timer();
}


//Decides if game should be restarted or exited to startpage
function gameDecider(){
    var timeOut = Math.ceil(time) <= 0;
    var foodOut = foodArray.length <= 0;
    if ( timeOut || foodOut ){
       if (foodOut) {
            alert("You LOST!!"); 
       }
       else if (timeOut) {
            alert("You WON!!");
       }
       alert("Your score is: "+score);
       
       var playAgain = confirm("Do you wish to play again?");
       if(playAgain){
            bugArray = [];
            foodEntry();        
            score = 0;       
            time = 6000;
       }
       else{
            print_hscore();
            location.reload(false);
       }  
    }

}

function updateBackground(){
    
    var background = new Image();
    background.src = "./img/canvas_background.jpg";
    ctx.drawImage(background, 0, 0  );
}

function createFood(){
    for (var k=0; k<foodArray.length; k++){
        var img = new Image();
        img.src = foodArray[k].imgUrl;
        ctx.drawImage(img, foodArray[k].x, foodArray[k].y);
    }
}

function drawObj(xPos, yPos, urlImg)
{    
    var img = new Image();
    img.onload = function(){
        imgLoaded = true;
    }
    img.src = urlImg;
    setTimeout(ctx.drawImage(img, xPos, yPos));

}


function hitTestPoint(x1, y1, w1, h1, x2, y2)
{
    //x1, y1 = x and y coordinates of object 1
    //w1, h1 = width and height of object 1
    //x2, y2 = x and y coordinates of object 2 (usually midpt)
    if ((x1 <= x2 && x1+w1 >= x2) &&
        (y1 <= y2 && y1+h1 >= y2))
            return true;
    else
        return false;
}

function score_update(){

    var score_element = document.getElementById("score");
    score_element.innerHTML = "Score " + score;
}

function count_down_timer(){

    var count_element = document.getElementById("timer");
    count_element.innerHTML = Math.ceil(time/100) + " sec";
}

function print_hscore(){
    var count_high = document.getElementById("high_score");
    count_high.innerHTML = highSCORE;
}
function isOverlapping(x1, y1, xArray, yArray) {
    for(var w=0; w<xArray.length; w++){
        if ((x1>xArray[w]-70 && x1<xArray[w]+70) && 
            (y1>yArray[w]-70 && y1<yArray[w]+70)) {
            return true;
        }
    }
    return false;
}

function play_pause_change () {
    alert("PAUSED");
    alert("Click OKAY to PLAY again");
}

function closest(bug, foodArray){
    var listDistance = [];
    var min_delta = 9999999999999;
    var closestFood = foodArray[0];
    for (var j=0; j<foodArray.length; j++){
        var a = foodArray[j].x - bug.x;
        var b = foodArray[j].y - bug.y;
        var delta = Math.sqrt(a*a + b*b);
        if(min_delta >= delta){  
            min_delta = delta;
            closestFood = foodArray[j];
        }
    }
    return closestFood;
}

function rand(min,max){
    return Math.floor(Math.random()*(max-min+1)+min);
}

window.addEventListener('load',init,false);