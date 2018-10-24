"use strict";

var canvas;
var gl;

var numVertices  = 36;

var pointsArray = [];
var normalsArray = [];

var vertices = [
        vec4( -0.25,-0.25,  0.25, 1.0 ),
        vec4( -0.25,  0.25,  0.25, 1.0 ),
        vec4( 0.25,  0.25,  0.25, 1.0 ),
        vec4( 0.25, -0.25,  0.25, 1.0 ),
        vec4( -1.0, -1.0, -1.0, 1.0 ),
        vec4( -1.0,  1.0, -1.0, 1.0 ),
        vec4( 1.0,  1.0, -1.0, 1.0 ),
        vec4( 1.0, -1.0, -1.0, 1.0 )
    ];

var lightPosition = vec4(1.0, 1.0, 5.0, 0.0 );
var lightAmbient = vec4(0.1, 0.1, 0.1, 1.0 );
var lightDiffuse = vec4( 0.5, 0.5, 0.5, 1.0 );
var lightSpecular = vec4( 0.5, 0.5, 0.5, 1.0 );

var materialAmbient = vec4( 1.0, 0.0, 1.0, 1.0 );
var materialDiffuse = vec4( 1.0, 0.8, 0.0, 1.0);
var materialSpecular = vec4( 1.0, 0.8, 0.0, 1.0 );
var materialShininess = 10.0;

var ctm;
var ambientColor, diffuseColor, specularColor;
var modelView, projection;
var viewerPos;
var program;

var xAxis = 0;
var yAxis = 1;
var zAxis = 2;
var axis = 0;
var theta =[0, 0, 0];

var thetaLoc;

var flag = true;

var near = 0.1;
var far = 10.0;
var radius = 3.5;
var theta2  = 0.0;
var phi    = 0.0;
var phi2 = 0.0;
var dr = 5.0 * Math.PI/180.0;

var  fovy = 90;  // Field-of-view in Y direction angle (in degrees)
var  aspect = 1.0;       // Viewport aspect ratio

var modelViewMatrix, projectionMatrix;
var modelViewMatrixLoc, projectionMatrixLoc;
var normalMatrix, normalMatrixLoc;

var eye;
var sideways;
const at = vec3(0.0, 0.0, 0.0);
const up = vec3(0.0, 1.0, 0.0);
function quad(a, b, c, d) {

     var t1 = subtract(vertices[b], vertices[a]);
     var t2 = subtract(vertices[c], vertices[b]);
     var normal = cross(t1, t2);
     var normal = vec3(normal);


     pointsArray.push(vertices[a]);
     normalsArray.push(normal);
     pointsArray.push(vertices[b]);
     normalsArray.push(normal);
     pointsArray.push(vertices[c]);
     normalsArray.push(normal);
     pointsArray.push(vertices[a]);
     normalsArray.push(normal);
     pointsArray.push(vertices[c]);
     normalsArray.push(normal);
     pointsArray.push(vertices[d]);
     normalsArray.push(normal);
}


function colorCube()
{
    quad( 1, 0, 3, 2 );
    quad( 2, 3, 7, 6 );
    quad( 3, 0, 4, 7 );
    quad( 6, 5, 1, 2 );
    quad( 4, 5, 6, 7 );
    quad( 5, 4, 0, 1 );
}


window.onload = function init() {
    canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );

    gl.enable(gl.DEPTH_TEST);

    //
    //  Load shaders and initialize attribute buffers
    //
    program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    colorCube();

    var nBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, nBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(normalsArray), gl.STATIC_DRAW );

    var vNormal = gl.getAttribLocation( program, "vNormal" );
    gl.vertexAttribPointer( vNormal, 3 , gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vNormal );

    var vBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(pointsArray), gl.STATIC_DRAW );

    var vPosition = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(vPosition, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);

    // thetaLoc = gl.getUniformLocation(program, "theta");

    // viewerPos = vec3(0.0, 0.0, -20.0);

    // projection = perspective(80, 1.0, 0.1,3.0);//ortho(-2, 2, -2, 2, -50, 50);

    var ambientProduct = mult(lightAmbient, materialAmbient);
    var diffuseProduct = mult(lightDiffuse, materialDiffuse);
    var specularProduct = mult(lightSpecular, materialSpecular);

   modelViewMatrixLoc = gl.getUniformLocation( program, "modelViewMatrix" );
    projectionMatrixLoc = gl.getUniformLocation( program, "projectionMatrix" );
    normalMatrixLoc = gl.getUniformLocation( program, "normalMatrix" );



    gl.uniform4fv(gl.getUniformLocation(program, "ambientProduct"),
       flatten(ambientProduct));
    gl.uniform4fv(gl.getUniformLocation(program, "diffuseProduct"),
       flatten(diffuseProduct) );
    gl.uniform4fv(gl.getUniformLocation(program, "specularProduct"),
       flatten(specularProduct) );
    gl.uniform4fv(gl.getUniformLocation(program, "lightPosition"),
       flatten(lightPosition) );

    gl.uniform1f(gl.getUniformLocation(program,
       "shininess"),materialShininess);

    // gl.uniformMatrix4fv( gl.getUniformLocation(program, "projectionMatrix"),
    //    false, flatten(projection));
    eye = vec3(radius*Math.sin(theta2)*Math.cos(phi),
        radius*Math.sin(theta2)*Math.sin(phi), radius*Math.cos(theta2));
    modelViewMatrix = lookAt(eye, at , up);
    render();
}

var render = function(){

    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    modelViewMatrix = lookAt(eye, at , up);
    projectionMatrix = perspective(fovy, aspect, near, far);

    normalMatrix = [
        vec3(modelViewMatrix[0][0], modelViewMatrix[0][1], modelViewMatrix[0][2]),
        vec3(modelViewMatrix[1][0], modelViewMatrix[1][1], modelViewMatrix[1][2]),
        vec3(modelViewMatrix[2][0], modelViewMatrix[2][1], modelViewMatrix[2][2])
    ];

    gl.uniformMatrix4fv( modelViewMatrixLoc, false, flatten(normalMatrix) );
    gl.uniformMatrix4fv( projectionMatrixLoc, false, flatten(projectionMatrix) );
    gl.drawArrays( gl.TRIANGLES, 0, numVertices );

    // flag = false;
    requestAnimFrame(render);
}

document.onkeydown = function moveShape(event){
    
    var key = String.fromCharCode(event.keyCode);
    console.log("This is: " + key);
    switch(key){
        case "A": theta2 = Math.PI/90;
                  sideways = true;
                  break;
        case "D": theta2 = -Math.PI/90;
                  sideways = true;
                    break;
        case "S":  sideways = false;
                   theta2 = Math.PI/90;
                    break;
        case "W": sideways = false; 
                  theta2 = -Math.PI/90;
                    break;
    }
    if(sideways){
      eye = vec3(Math.cos(theta2)*eye[0] + eye[2]*Math.sin(theta2),
        eye[1], eye[0]*Math.sin(-theta2) + eye[2]*Math.cos(theta2));
      console.log(" " + eye[0] + " " + eye[1] + " " + eye[2]);
    }
    else{
      eye = vec3(eye[0], Math.cos(theta2)*eye[1] + Math.sin(-theta2)*eye[2], Math.sin(theta2)*eye[1] + Math.cos(theta2)*eye[2]);
      console.log(" " + eye[0] + " " + eye[1] + " " + eye[2]);
    }
    
}
