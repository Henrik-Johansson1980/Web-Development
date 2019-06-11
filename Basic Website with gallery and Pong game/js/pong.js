/*******************************************************************************
 * Projekt, Kurs: DT146G
 * File: main.js
 * Desc: JavaScript file for pong game in webproject;
 * 
 * Henrik Johansson
 * hejo1501
 * hejo1501@student.miun.se
 ******************************************************************************/
 //variabler
var gs; //variabel för sektionstaggen gamesection 
var canvas; //För att lagra en canvas
var context; //För atr rita på canvasen 
var p1, p2, ball //Spelarna och boll
var HEIGHT, WIDTH; //höjd och bredd
var ballSide, pWidth, pHeight; //Sidlängder;
var speed, pSpeed, aiSpeed; //Bollens hastighet 
var previousTime; //Tid som gått sedan förra anropet, används vid uppdatering/animation.
var wKey = 87, sKey = 83; //Keycodes för W och s tangenterna.
var p1Score, p2Score; //Variabler för att lagra poängen
var randvel; //För att randomisera riktningen på bollen
var run; //Används för att stoppa callback

//Vektorklass som används för att ge  x,y koordinater till spelare och boll och för att ändra deras positioner
class Vec
{
	constructor(x = 0, y = 0)
	{
		this.x = x;
		this.y = y;
	}	
}

//Rektangelklass används fr att rita upp spelare tar rektangelns bred och höjd som argument.
class Rectangle
{
	 constructor (wid, hei)
	 {
		 this.pos = new Vec;
		 this.size = new Vec(wid, hei); 
	 }
}

//Klass som representerar ett bollobjekt.
 class Ball extends Rectangle
{
	constructor()
	{
		//Bollens sidor anges med värdet i ballSide.
		super(ballSide,ballSide);
		this.vel = new Vec; //Bollens "hastighet" i x- och y-led;
	}	
}

//Function för att flytta spelaren 
function movePlayer(e)
{
	
	//Spelare ett
	if (e.keyCode === wKey) //W tangenten
		p1.pos.y -= pSpeed; //dra bort  pSpeed från nuvarande position (Flytta uppåt)
	
	if(e.keyCode === sKey) //S-tangenten
		p1.pos.y += pSpeed; //lägg till pSpeed till nuvarande position (Flytta nedåt)
}

//Funktion som ritar objekt på canvas
function draw()
{
	//Rita bakgrunden svart
	context.fillStyle = "black";
	context.fillRect(0 ,0, WIDTH , HEIGHT );
	//Resten av föremålen på skärmen ritas vita
	context.fillStyle = "white";
	//Rita bollen
	context.fillRect( ball.pos.x, ball.pos.y,ball.size.x , ball.size.y);
	//Rita spelarna
	context.fillRect( p1.pos.x, p1.pos.y, p1.size.x , p1.size.y);
	context.fillRect( p2.pos.x, p2.pos.y, p2.size.x , p2.size.y);
	
	//Poäng text, något mindre för minsta fönsterstorleken
	if (window.innerWidth < 481)
	{
		context.font = "12px  Arial";
		//P1:s poäng i vänstra hörnet
		context.fillText("SCORE: " + p1Score ,20 ,15);
		//P2:s poäng i högra hörnet
		context.fillText("SCORE: " + p2Score , (WIDTH -70) ,15);
	}
	else //För de större fönsterstorlekarna
	{
		context.font = "30px  Arial";
		context.fillText("SCORE: " + p1Score ,70 ,50);
		context.fillText("SCORE: " + p2Score , (WIDTH -270) ,50);
	}

	
	//Om någon spelare når 5 poång är spelet slut.
	if(p1Score === 5 || p2Score === 5)
	{
		//Game over skärm, något mindre text vid minsta fönsterstoreken.
		if (window.innerWidth < 481)
		{
			//Rita svart bakgrund
			context.fillStyle ="black";
			context.fillRect(0 ,0, WIDTH , HEIGHT );
			//Game over text
			context.font = "30px  Arial";
			context.fillStyle = "white";
			context.fillText("Game Over!", WIDTH/4, HEIGHT/2);
			context.font = "12px  Arial";
			context.fillText("Refresh page to play again.", WIDTH/4 +5, HEIGHT/2 + 15);
		}
		else
		{
			//för de större fönsterstorlekarna
			context.fillStyle ="black";
			context.fillRect(0 ,0, WIDTH , HEIGHT );
			context.font = "60px  Arial";
			context.fillStyle = "white";

			if (window.innerWidth > 1025)
			{
				context.fillText("Game Over!", WIDTH/3, HEIGHT/2);
				context.font = "20px  Arial";
				context.fillText("Refresh page to play again.", WIDTH/3 +50, HEIGHT/2 + 30);
			}
			else
			{
				context.fillText("Game Over!", WIDTH/4, HEIGHT/2);
				context.font = "20px  Arial";
				context.fillText("Refresh page to play again.", WIDTH/4 +50, HEIGHT/2 + 30);
			}
	
		}
	}
}

//Callbakfunktion som används vid animationen
function callback(millis)
{
	//Uppdatera tidskillnaden
	if (previousTime)
	{
		update( (millis - previousTime) /1000); //dela ev med tusen för att få sekunder
	}
	previousTime = millis; //Sätt previoustime  lika med värdet för milliseconds.
	if(run) //Om spelet fortfarande är igång (run == true) anropa request animation frame.
		requestAnimationFrame(callback); 
}

//Funktion som uppdaterar canvas
function update(deltaTime)
{		
	//Uopdatera bollens position
	ball.pos.x +=  ball.vel.x * deltaTime;
	ball.pos.y +=  ball.vel.y * deltaTime;
	
	//Om bollen nuddar övre eller nedre kanten och bollen är på väg i den riktningen
	//Ändra riktning så att bollen studsar
	if ( ball.pos.y  <= 0  && ball.vel.y < 0 ||  ball.pos.y + ballSide >= HEIGHT && ball.vel.y > 0 )
		ball.vel.y = -ball.vel.y; //Vänd till motsatt riktning
	

	//Ändra riktning när bollen träffar spelaren och bollen är på väg i den riktningen så att bollen studsar åt motsatt håll 
	//men släpper förbi den om spelaren missar. 
	if ( ball.pos.x < (pWidth * 2 /*p1:s högersida*/ )   &&  ball.pos.y + ballSide >= p1.pos.y &&  ball.pos.y <= p1.pos.y + pHeight && ball.vel.x < 0) 
	{
		ball.vel.x = -ball.vel.x; //Vänd till motsatt riktning
		//slumpa riktning i höjdled
		ball.vel.y = ball.vel.y * (Math.random() > 0.5 ? 1 : -1);
		//öka hastigheten med lite vid varje träff
		ball.vel.x *= 1.05; 
	}
	
	//Som ovan fast för spelare 2 
	if ( ball.pos.x + ballSide >= WIDTH - (pWidth * 2)  &&  ball.pos.y + ballSide >= p2.pos.y   &&  ball.pos.y <= p2.pos.y + pHeight && ball.vel.x > 0)
	{		
		ball.vel.x = -ball.vel.x; //Vänd till motsatt riktning
		//slumpa riktning i höjdled
		ball.vel.y = ball.vel.y * (Math.random() > 0.5 ? 1 : -1); //om det slumpade talet är större än 0.5 multiplicera med ett annars med -1.
		//öka hastigheten med lite vid varje träff
		ball.vel.x *= 1.05; 			
	}	

	
	//om bollen går förbi spelaren, öka poäng, placera bollen på mitten av planen och "serva om"
	if(ball.pos.x < 0 || ball.pos.x >WIDTH)
	{
		//Sätt poäng
		if (ball.pos.x < 0)
			p2Score++;
		else
			p1Score++;
		
		ball.pos.x = WIDTH/2 ;
		ball.pos.y = HEIGHT/2;
		ball.vel.x = (speed * (Math.random() > 0.5 ? 1 : -1)); //Ternary operator, om Math.random() är större än 0.5 multiplicera med 1
		ball.vel.y = (speed * (Math.random() > 0.5 ? 1 : -1)); // om Math.random() är mindre än 0.5 multiplicra med -1.
	}

	//Om någon spelare når 5 poång är spelet slut.
	if(p1Score === 5 || p2Score === 5)
	{
			ball.vel.x = 0;
			ball.vel.y = 0;
			run = false;
	}

	//Begraänsa spelarna till planen
	//Om spelaren rör sig utanför skärmen nollställ spelarens y-position
	if(p1.pos.y < 0)
		p1.pos.y = 0;
	else if (p1.pos.y > (HEIGHT - pHeight))
		p1.pos.y = HEIGHT - pHeight; 

	if(p2.pos.y < 0)
		p2.pos.y = 0;
	else if (p2.pos.y > (HEIGHT - pHeight))
		p2.pos.y = HEIGHT - pHeight; 

	//Ai (nåja) för spelare 2
	if(p2.pos.y + pHeight/2  < ball.pos.y)
		p2.pos.y += aiSpeed;
	else
		p2.pos.y -= aiSpeed;
	//Anropa draw för att rita in den nya informationen.
	draw();
}

function init()
{
	//Hämta sektionen som ska innehålla spelet 
	gs =  document.getElementById("gamesection");
	//rita olika storelekar på spelplanen och dess komponenter beroende på fönstrets storlek.
	if(window.innerWidth <481)
	{
		WIDTH = 360;
		HEIGHT = 200;
		ballSide = 10;
		pWidth =10;
		pHeight = 40;
		speed = 100;
		pSpeed = 5;
		aiSpeed = 1.2;
	}
	else if (window.innerWidth > 481 && window.innerWidth < 1025) //Mellanstorleken
	{
		WIDTH = 800;
		HEIGHT = 450;
		ballSide = 20;
		pWidth = 20;
		pHeight = 120;
		speed = 200;
		pSpeed = 5;
		aiSpeed = 2.5;
	}
	else if (window.innerWidth >1025) //Största fönstret
	{
		WIDTH = 950;
		HEIGHT = 500;
		ballSide = 30;
		pWidth = 30;
		pHeight = 150;
		speed = 200;
		pSpeed = 10;
		aiSpeed = 2.5;
	}
	//Styla in en marginal
	gs.style.margin = "1em"; 
	//göm scrolllister i yled
	document.getElementById("gamemain").style.overflow = "hidden";
	//Skapa en canvas
	canvas = document.createElement('canvas');
	canvas.setAttribute('id', "gameCanvas");
	//Sätt canvasens storlek 
	canvas.width = WIDTH;
	canvas.height = HEIGHT; 
	//Rita 
	context = canvas.getContext("2d");
	//Sätt in canvas elementet på sidan
	gs.appendChild(canvas);
	
	//Initiera bollen
	ball = new Ball;
	
	//Placera bollen i mitten av planen 
	ball.pos.x = (WIDTH/2 - ballSide/2); 
	ball.pos.y = (HEIGHT/2 - ballSide/2);
	
	//Sätt bollens riktning i en slumpmässig riktning.
	ball.vel.x = (speed *  (Math.random() > 0.5 ? 1 : -1)); //Ternary operator, om Math.random() är större än 0.5 multiplicera med 1
	ball.vel.y = (speed *  (Math.random() > 0.5 ? 1 : -1)); // om Math.random() är mindre än 0.5 multiplicra med -1.
	
	//initiera spelare etts postition 
	p1 = new Rectangle(pWidth,pHeight);
	p1.pos.x = p1.pos.x + pWidth; 
	p1.pos.y = HEIGHT/2 - pHeight/2;
	
	//initiera spelare tvås postition 
	p2 = new Rectangle(pWidth,pHeight);
	p2.pos.x = WIDTH - pWidth * 2; 
	p2.pos.y = HEIGHT/2 - pHeight/2;
	
	//Nollställ poängräknare
	p1Score = p2Score = 0;
	
	//Spelet startar
	run = true;
	//Starta callbackfunktionen.
	callback();
	//Rita ut på skärmen
	draw();
	//Eventlyssnare för  om en tangent är nedtryckt vilket anropar movePlayerfunktionen
	window.addEventListener('keydown', movePlayer, false);
}
//Kör init funktionen vid laddning av fönstret.
window.addEventListener('load', init, false);