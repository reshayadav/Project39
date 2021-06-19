var PLAY = 1;
var END = 0;
var gameState = PLAY;
var life, heart;
var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;

var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;

var score;
var gameOverImg,restartImg
var jumpSound , checkPointSound, dieSound
localStorage["highScore"] = 0;



function preload(){
  trex_running = loadAnimation("trex1.png","trex3.png","trex4.png");
  trex_collided = loadAnimation("trex_collided.png");
  
  groundImage = loadImage("ground2.png");
  heart =loadImage("heart.png")
  cloudImage = loadImage("cloud.png");
  
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");
  
  restartImg = loadImage("restart.png")
  gameOverImg = loadImage("gameOver.png")
  
  jumpSound = loadSound("jump.mp3")
  dieSound = loadSound("die.mp3")
  checkPointSound = loadSound("checkPoint.mp3")
}

function setup() {
  createCanvas(windowWidth, windowHeight);

 
  trex = createSprite(50,height -40,20,50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided", trex_collided);
  

  trex.scale = 0.6;
  
  ground = createSprite(width/2,height-20,width,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  
  gameOver = createSprite(width/2, height/2 -50);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(width/2,height/2);
  restart.addImage(restartImg);

  life1=createSprite(100, 50);
  life1.addImage(heart);
  life1.scale=0.01;

  life2= createSprite(150, 50);
  life2.addImage(heart);
  life2.scale = 0.01;

   life3= createSprite(200, 50);
  life3.addImage(heart);
  life3.scale = 0.01;
 
  gameOver.scale = 0.5;
  restart.scale = 0.5;
  
  invisibleGround = createSprite(width/2,height -10,width,10);
  invisibleGround.visible = false;
  
  //create Obstacle and Cloud Groups
  obstaclesGroup = createGroup();
  cloudsGroup = createGroup();

  
  trex.setCollider("rectangle",0,0,trex.width,trex.height);
  trex.debug = true
  
  score = 0;
  
}

function draw() {
  
  background(153,217,236);
  //displaying score
  text("Score: "+ score, width-100,50);
  
  
  if(gameState === PLAY){

    gameOver.visible = false;
    restart.visible = false;
    
    ground.velocityX = -(4 + 3* score/100)
    //scoring
    score = score + Math.round(getFrameRate()/60);
  
    if(score>0 && score%100 === 0){
       checkPointSound.play() 
}
    
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
    
    //jump when the space key is pressed
    if(keyDown("space")&& trex.y >= 100 || touches.length >0) {
        trex.velocityY = -12;
        jumpSound.play();
        touches = [];
    }
    
    //add gravity
    trex.velocityY = trex.velocityY + 0.8
  
    //spawn the clouds
    spawnClouds();
  
    //spawn obstacles on the ground
    spawnObstacles();
    
  //   if(obstaclesGroup.isTouching(trex)){
  //       trex.velocityY = -12;
  //       jumpSound.play();
  //       gameState = END;
  //       dieSound.play()
  // }



  

    if(obstaclesGroup.isTouching(trex)){
    life1.lifetime=0;
    obstaclesGroup.destroyEach();
    trex.velocityY = -12;
    dieSound.play()
 }

 
 if( life1.lifetime==0 && obstaclesGroup.isTouching(trex)){
  life2.lifetime=0;
  obstaclesGroup.destroyEach();
  trex.velocityY = -12;
  dieSound.play()
  gameState =END;
}
 
  
 
 

  }
   else if (gameState === END) {
      gameOver.visible = true;
      restart.visible = true;
  
     //change the trex animation

      ground.velocityX = 0;
      trex.velocityY = 0
  
     
      //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
     
     obstaclesGroup.setVelocityXEach(0);
     cloudsGroup.setVelocityXEach(0);    
}
  
 
  //stop trex from falling down
  trex.collide(invisibleGround);
  
  if(mousePressedOver(restart) || touches.length >0) {
      reset();
      touches =[];
    }


  drawSprites();
}

function reset(){
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  
  trex.changeAnimation("running");
  if(localStorage["highScore"] < score){ 
   localStorage["highScore"] =score;
   console.log("I am here"); 

  }
 console.log("highScore" + localStorage["highScore"]);
 score = 0;
}


function spawnObstacles(){
 if (frameCount % 60 === 0){
   var obstacle = createSprite(width,height -35,10,40);
   obstacle.velocityX = -(6 + score/100);
   
    //generate random obstacles
    var rand = Math.round(random(1,6));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
      case 4: obstacle.addImage(obstacle4);
              break;
      case 5: obstacle.addImage(obstacle5);
              break;
      case 6: obstacle.addImage(obstacle6);
              break;
      default: break;
    }
   
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.5;
    obstacle.lifetime = width/6;
   
   //add each obstacle to the group
    obstaclesGroup.add(obstacle);
 }
}

function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount % 60 === 0) {
    var cloud = createSprite(width,height/2 ,40,10);
    cloud.y = Math.round(random(height/2 +40,height/2 +100));
    cloud.addImage(cloudImage);
    cloud.scale = 0.5;
    cloud.velocityX = -3;
    
     //assign lifetime to the variable
    cloud.lifetime = width/3;
    
    //adjust the depth
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    //add each cloud to the group
    cloudsGroup.add(cloud);
  }
}

