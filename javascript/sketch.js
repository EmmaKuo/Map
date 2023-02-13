//no animation / interaction chart
//if you want to use animation or create a loading state look at the cat fact example from last week 
// use a boolean to control when your data is loaded


let iss;
let world;
let loaded = false;
let canvas;
let lat, long;
let mappedlat, mappedlon;
let issDiam = 50;
let hover = false;

function setup() {
  canvas = createCanvas(1000, 445);//exact size of the image loaded in

  //bind user interaction listeners to the canvas if you don't have a full screen experience
  canvas.mouseMoved(hoverState);//hoverState is our callback function that runs when mouse moves over canvas

  world = loadImage("./assets/images/map-grid-small.jpeg");

  fetch("http://api.open-notify.org/iss-now").then(function(response) {

    console.log(response);
    return response.json();
  }).then(function(data) {

    console.log(data);
    
    iss = data;
    loaded = true;
  
  }).catch(function(err) {
    console.log(`Something went wrong: ${err}`);
  });

}


function draw() {

  if(loaded){
    image(world, 0, 0, width, height);

    //equator & GMT in red
    let equator = map(0, -90, 60, 0, height);
    let GMT = map(0, -170, 180, 0, width); // prime meridian is at Greenwhich (GMT)

    stroke(255,0,0);
    line(GMT,0,GMT,height);
    line(0,equator,width,equator);

    // get the location of iss
    lat = iss.iss_position.latitude;
    lon = iss.iss_position.longitude;

    mappedlat = map(lat, -90, 60, 0, height);
    mappedlon = map(lon, -170, 180, 0, width); 
  
    fill(255, 0, 255, 100); // use the humidity value to set the alpha
    rect(mappedlon, mappedlat, issDiam, issDiam);
  }
  else
  {
    // loading screen
    textSize(18);
    text("Loading...", width/2, height/2-25, width, 50);
  }

  if(hover){
    textSize(11);
    fill(0);
    noStroke();

    console.log(lat,lon);

    text("lat: " + lon + ", lon: " + lat, mouseX-10, mouseY-10);
  }

}

function hoverState(){
  console.log("I only run when moving over the canvas");

  if(dist(mouseX,mouseY,mappedlon,mappedlat)  < issDiam/2 ){
    hover = true;
  }else{
    hover = false;
  }

}