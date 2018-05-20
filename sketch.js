//Created by Thomas Luxton

//IMPORTANT NOTE: May not work in Chrome for somereason,
//Works perfectly in FireFox

//This Game can be called "Get Down Mr President" but can also be interpreted as many other  
//... things due to its visual design.

//Link to urban dictonary: "Get Down Mr President"
//http://www.urbandictionary.com/define.php?term=Get%20Down%20Mr.%20President%21

//I use --(criteria mark)-- to note for the marker when certain code relates to certain 
//... criteria for instance, below i use Global Variables, which relates to "code neatness"  
//...  so its commented accordingly as you can see in the next comment.

//--(Code NeatNess)--
//global variables

var bGuard; 
var player; 
var score;
var gOScreen;


//score starts at 0
var gScore = 0;

//game is not over
var gameOver = false;

//preload font and 2 images 
//--(Text display)--
//--(Drawing images)--
function preload(){
  myFont = loadFont('assets/Saira.ttf');
  flag = loadImage('assets/flag.jpg');
  president = loadImage('assets/president.png');
}

//setup by creating canvas, setting frame rate and setting functions
//bGuard.initial() is used to add enemies to the game
function setup() { 
  createCanvas(600, 600); 
  frameRate(50);
	bGuard = new BGuard();
  bGuard.initial();
  player = new Player();
  score = new Score();
  gOScreen = new GOScreen();
}

//if game over is false, draw the main game, if game over is true: draw the game over screen
function draw() { 
  //--(Colour)--
	//background colour =blue 
  background('#213472');
  //--(if statement)--
  if (gameOver !== true){
  	mainGame();
  } else if (gameOver == true){
    gOScreen.render();
  }
}

//main game which includes all functions that need to be within draw
//includes rendering the player image and drawing where they move 
//same with bodyguard but has function in that increases the amount of Body guards
//last function is the score 
function mainGame(){  
  if (gameOver !== true){
    player.render();
    player.move();
    bGuard.increment();
    bGuard.render();
    bGuard.chase();
    score.render();
  }
}

//game over screen that fills with red (colour makes users angry when they die)
function GOScreen(){
  this.render = function(){
    //--(Colour)--
    //fill with red (same as red in flag)
    fill('#b72222');
    noStroke();
    //create rectangle that take up background
    //------(Drawing shapes)--------- 1/2
    rect(0,0,width,height);
    //load image of upsidown flag over screen
    //--(Drawing images)--
    image(flag,0, height/5.2, width,height/2);
    fill('black');
    textAlign(CENTER);
    textSize(40);
    //--(Text display)--
    text("GAME OVER", width/2, height/6.2)
    text("Press Space Bar to play again" , width/2, height/1.2)
    //displays the nearest whole number of the score.score function 
    textSize(66);
    text("Your Score: " + String(round(gScore)), width/2, height/2.6)
    if(keyIsDown(32)){
    	gameOver = false;
			setup();
      draw();
    }
  }
}

//function that keeps tract of score
//--(Scoring)--
function Score(){
  //start at 0
  gScore = 0;
  //increase score by 10 every framecount/50 (since fps is 50, its every second)
  this.ticker = function(){
    if(frameCount % 50 == 0){
      gScore += 10;
  	}
  }
  //get and save final score for display upon death
  this.endGame = function(){
  	this.finalScore = gScore;
  }
  
  // if game is running continue ticking, if not stop the ticker with endGame
  this.render = function(){
    if (gameOver == false){
    	this.ticker();
    } else if (gameOver == true){
      	this.endGame();
    }
    //draw score in middle top showing whole number
    //--(Text display)--
    textFont(myFont);
    textSize(14);
    fill("white");
    textAlign(CENTER);
    text("Score: " + String(round(gScore)), width/2, 50);
     //draw controls in middle bottom, delets itself when score reachs 100
    if (gScore < 100){
    	text("WASD to move", width/2, height - 50);
    }
  }
}

//bodyguard function which uses an array to manage objects of x and y of visual shapes on screen
function BGuard(){
	this.amount = 0;
  this.each = [];

  //--(Array)--
  //--(Randomness)--
  //for each of amount, create an array of objects showing a random x and random y
	//amount starts as 0 at start but incements in the following function
  this.initial = function(){
    for(i = 0; i <= this.amount; i++){
      this.each[i] ={
        x : random(width),
        y : random(height)
      }
    }
  }
  
  //when framecount = 200 or when it = 1000, spawn a new bodyguard that trys to take down
  //...mr president. I added the (|| frameCount % 1000 == 0), as it gives a sense of randomness
  //... to the game, wherein the player feels like they cant tell when the double spawn comes
  //... this is due to the framecount runnining even when the Gameover screen is showing
  //... meaning a double spawn could come at any time!
  //incriment() works by pushing new item into array
  this.increment = function(){
    if(frameCount % 200 == 0 || frameCount % 1000 == 0){
    	this.amount++;
      this.rand =[];
    	this.rand = {
      x : random(width),
  		y : random(height)
      }
      this.each.push(this.rand);
    }
     if(frameCount % 700 == 0){
    	this.amount++;
      this.rand =[];
    	this.rand = {
      x : random(width),
  		y : random(height)
      }
      this.each.push(this.rand);
    }
  }
  //draws the ellipses of body guards
  this.render = function(){
		//--(for loop)--
		for(i = 0; i <= this.amount;i++){

    	fill('black');
      stroke('white');
      //------(Drawing shapes)--------- 2/2
    	ellipse(this.each[i].x, this.each[i].y, 50, 50);
        
    }
  }
  //sets speed
  this.speed = 1.5;
  
  //--(Animation)--
  //--(Collision Detection)--
  //finds out where player is in regards to body guard and moves that way at speed level
  //If the player and a bodyguard is closer than 50px then it is GAMEOVER
  this.chase = function(){
    for(i = 0; i <= this.amount; i++){
      if(this.each[i].x < player.x){
        this.each[i].x += this.speed;
      } else if(this.each[i].x > player.x){
        this.each[i].x -= this.speed;
      }
      if(this.each[i].y < player.y){
        this.each[i].y += this.speed;
      } else if(this.each[i].y > player.y){
        this.each[i].y -= this.speed;
      }
      if (dist(player.x,player.y,this.each[i].x,this.each[i].y) <= 50 ){
    		gameOver = true;
    	}
    }
  }
}


//function for player
//sets starting point and selects width/height of ellipse
function Player(){
  //player starting position 
  this.x = width/2;
  this.y = height/2;
  //player starting width and height
  this.w = 50;
  this.h = 50;
  
  //render player along with player icon
  //--(Drawing images)--
  this.render = function(){
  	ellipse(this.x, this.y, this.w, this.h);
    image(president,(this.x-this.w/2),(this.y-this.h/2),this.w,this.h)
  }
  //set player speed
  this.speed = 3.5;
  
  //moving way corresponds to "wasd" keys, but makes sure player does not go beyong borders 
  //... of width & height
  //cannot go beyond the border of canvas
  //--(Interactivity)--
  //--(Animation)--2/2
  //--(Collision Detection)--
  this.move = function(){
    if((keyIsDown(68)||(keyIsDown(39))) && this.x<=width) {
   		this.x+=this.speed;
  	}
  	if((keyIsDown(65)||(keyIsDown(37))) && this.x>=0) {
    	this.x-=this.speed;
  	}
  	if((keyIsDown(83)||(keyIsDown(40))) && this.y<=height) {
    	this.y+=this.speed;
  	}
  	if((keyIsDown(87)||(keyIsDown(38))) && this.y>=0) {
    	this.y-=this.speed;
  	}
  }
}


