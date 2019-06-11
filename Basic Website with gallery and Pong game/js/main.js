/*******************************************************************************
 * Projekt, Kurs: DT146G
 * File: main.js
 * Desc: main JavaScript file for webproject;
 * 
 * Henrik Johansson
 * hejo1501
 * hejo1501@student.miun.se
 ******************************************************************************/
//Variabler för browser detection
var browserArr = [ "Chrome", "Firefox", "Safari", "Opera", "MSIE", "Trident", "Edge"]; //Array med browsernamn
var browserName; //Variabel för att lagra browserns namn
var uAgent = navigator.userAgent;	//Lagra userAgent sträng

//Varibler för vid identifiering av aktuellt dokument (t.ex index.html)
var pathArray; //Variabel för att hålla en sträng med sökvägen (se startfunktion nedan)
var dokument;	//Variabel för att lagra den sista delen av sökvägen t.ex. index.html

 //Variabler som används vid animationen av den växande bilden.
var interval = null; //var för att hålla koll på intervallet 
var SPD = 5; // Används för att kontrollera animationens hastighet
var counter; // Räknare som avänds till att sätta storleken på bilden under animationen.
var SIZE = 690; //Stoppa när denna storlek nåtts på höjden
var imgElement; //Variabel för att lagra ett img element så att run funktionen kan komma åt den.

//Variabler som används vid till att processa formulären i galleri och kontaktsektion
var message = [] ;
var to, subj, name, lName, email, txt;

//Kolla vilken den aktuella läsaren är
//Återanvänd från mina laborationer
function findBrowser()
{

	//Loopa igenom browserArr och jämför mot sträng i uAgent
	for (var i = 0; i < browserArr.length; i++)
	{
		//Om strängen i detta index matchar en del av userAgent strängen.
		if (uAgent.indexOf(browserArr[i]) > -1)
		{
			browserName = browserArr[i];
			break; //Bryt loop
		}
	}

	//Microsoft edge tror den är Chrome så kolla detta
	if(browserName == "Chrome")
	{
		if(uAgent.indexOf("Edge") > -1) //Om strängen innehåller "Edge" 
			browserName = "Microsoft edge";
		else //Annars 
			browserName = "Google Chrome";
	}
 }

//funktion som anropas upprepade gånger vid animeringen av bilden så att den växer
function run()
{
	counter += SPD;
	//stoppa animationen när bilden nått önskad storlek
	if( counter >= SIZE)
	{
		//Stoppa timern
		window.clearInterval(interval);
		interval = null;
	}
	
	var img = imgElement;
	//Varje gång funktionen körs ökar bildens storlek
	img.setAttribute('style', "width: " + ( 2 * counter +"px;") + "height: " + ( counter + "px;"));
}

//Funktion som öppnar ett nytt fönster där den växande bildanimationen sker
function display(image)
{
		//Öppnar ett nytt fönster 50 pixlar från skärmens övre vänstra hörn och 50 från toppen, med storleken 1400x720px
		// Chrome och Firefox verkar beräkna detta på lite olika sätt men bilden tycks växa till att uppta samma proportioner i båda läsarna.	
		var newWin = window.open('', 'image', "top=50, left=50,width=1400, height=720");
	
		//Skriv information om ett nytt htmldokument i det nya fönstret.
		newWin.document.write('<!doctype html>');
		newWin.document.write('<html>');
		newWin.document.write('<head>');
		newWin.document.write('<title>'+ image +'</title>'); //Sätt tilteln på dokumentet = bildfilens namn
		newWin.document.write('</head>');	
		
		if (browserName ===  "Microsoft edge")
		{
			newWin.document.write('<body>');	
			//Animationen tycks inte fungera på Edge och explorer så visa bara en stor bild (nödlösning men det händer något iaf). 
			newWin.document.write('<img src = "' + image + '" alt = "Stor version av bilden" height ="710" width ="1400" />');
			newWin.document.write('</body></html>');
		}
		else
		{
			//Skriv information om ett nytt htmldokument i det nya fönstret.
			newWin.document.write('<body></body></html>');
			//Skapa ett img element och sätt dess attribut och lägg till det i dokumentets body
			imgElement = document.createElement('img');
			imgElement.setAttribute('src', image);
			imgElement.setAttribute('alt', "big version of " + image); 
			imgElement.setAttribute('id', "bigImage");
			imgElement.setAttribute('style', "width: 0px; height: 0px;");
			newWin.document.body.appendChild(imgElement);
						
			//Om interval inte är null  hoppa ur funktionen här.
			if (interval)
				return;
			
			//Counter används för att öka bildens storlek.
			counter = 0;
			//Anropa runfunktionen var 10:e millisekund interval är en unk identifierare som kan användas för att 
			//stoppa timern.
			interval = window.setInterval( "run()", 10);
		}
}

//Hantering av formulären
//Denna funktion skriver ut informationen i formulärets input till ett nytt fönster.
// tar en array med input data som argument
function printMail(message)
{
		//Öppnar ett nytt fönster
		var newWin = window.open('', 'mailoutput', "top=50, left=50,width=400, height=600");
		newWin.document.write('<!doctype html>');
		newWin.document.write('<meta charset="UTF-8">');
		newWin.document.write('<title>Kontakt</title>');
		newWin.document.write('<link rel= "stylesheet" href="css/style.css" media = "print">');
		newWin.document.write('<h1>Email output</h1>');
		newWin.document.write('<p><strong>Till:</strong> ' + message[0] + '</p>');
		newWin.document.write('<p><strong>Ämne:</strong> '+ message[1] + '</p>');
		newWin.document.write('<p><strong>Från:</strong> '+ message[2] + '</p>');
		newWin.document.write('<p><strong>Avsändarens namn:</strong> ' + message[3] + ' ' + message[4] + '</p>');
		newWin.document.write('<p><strong>Innehåll:</strong><br/>' + message[5] +'</p>');
}

// Funktion som läser in den angivna informationen i input fälten
// och lägger dem i arrayen message. Därefter anropas printMailfunktionen med message som argument.
// 
function processMail()
{	message = new Array();
	if(dokument === "contact.html")
	{
		//Eftersom vi inte gått igenom serverside programmering är submitknappen avstängd.
		//document.getElementById("contactSubmitbutton").disabled = true;
		var to = document.getElementById("Mottagare").value;
		var subj = document.getElementById("contactSubj").value;
		var name = document.getElementById("contactFn").value;
		var lName= document.getElementById("contactLn").value;
		var email = document.getElementById("contactEmail").value;
		var txt = document.getElementById("contactTextArea").value;
		//console.log(to, subj, name, lName, email, txt);
	}
	else if(dokument === "gallery.html")
	{
		//Eftersom vi inte gått igenom serverside programmering är submitknappen avstängd.
		//document.getElementById("feedSubmitbutton").disabled = true;
		var to = document.getElementById("Mottagare").value;
		var subj = document.getElementById("Ämne").value;
		var name = document.getElementById("feedFn").value;
		var lName= document.getElementById("feedLn").value;
		var email = document.getElementById("feedEmail").value;
		var txt = document.getElementById("feedbackTextArea").value;
		//console.log(to, subj, name, lName, email, txt);
	}
		//Lagra värden i arrayen message 
		message.push(to);
		message.push(subj);
		message.push(email);
		message.push(name);
		message.push(lName);
		message.push(txt);

		printMail(message); //Värden i arrayen skickas med som argument till funktionen printmail.
} 

 //startfunktion som ska köras när sidan laddas för att 
 //ta reda på vilket det aktuella dokumentet är och initiera eventuella listeners m.m
 function start()
 {

 	//Funktion som kontrollerar vilken browser som används.
	//Nödvändigt då jag inte fått animationen att fungera på MS Edge, så bilden öppnas utan animation. 
	findBrowser();
	 //Dela upp strängen vid / för att lättare komma åt sista delen av pathsträngen
	 pathArray = window.location.pathname.split('/'); 
	//plocka namnet på det aktuella htmldokumentet
	 dokument = pathArray[pathArray.length - 1]; 
	
	if(dokument === "contact.html")
	{
		//Eftersom vi inte gått igenom serverside programmering fungerar inte mejlfunktionen utan meddelandet skrivs bara till ett
		// nytt fönster och ett dynamiskt skapat dokument med den inmatatde texten.
		//document.getElementById("contactSubmitbutton").addEventListener('click', processMail, false);
		document.getElementById("contactform").addEventListener('submit', processMail, false);
	}
	//Om det aktiva dokumentet är gallery.html
	else if (dokument === "gallery.html")
	{
		//lägg till eventlisteners på bilderna
		//när anv. klickar på en av bilderna öppnas ett nytt fönster där en större bild växer fram.
		//vid klick anropas en anonym funktion som ger den större bildens namn (och katalog) 
		//som skickas till funktionen display.
		document.getElementById("img1").addEventListener('click', function() {display("img/autumnchill_large.png");}, false);
		document.getElementById("img2").addEventListener('click', function() {display("img/sunsetbeach_large.png");}, false);
		document.getElementById("img3").addEventListener('click', function() {display("img/lakesetting_large.png");}, false);
		document.getElementById("img4").addEventListener('click', function() {display("img/monochrome_large.png");}, false);
		document.getElementById("img5").addEventListener('click', function() {display("img/eveningboat_large.png");}, false);
		document.getElementById("img6").addEventListener('click', function() {display("img/goldenflowers_large.png");}, false);
		document.getElementById("img7").addEventListener('click', function() {display("img/sunsettree_large.png");}, false);
		
		//Eftersom vi inte gått igenom serverside programmering fungerar inte mejlfunktionen utan meddelandet skrivs bara till ett
		// nytt fönster och ett dynamiskt skapat dokument med den inmatatde texten.
		//Eventlyssnare för formuläret som anropar funktionen processMail när det skickas.
		document.getElementById("feedbackform").addEventListener('submit', processMail, false);
	}
 }
 //Kör startfunktion när sidan laddas
 window.addEventListener("load", start, false); 