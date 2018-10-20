
var gl, vertices, clicks;


window.onload = function init()
{
    var canvas = document.getElementById( "gl-canvas" );
    clicks = 0;
    
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    //triangle 
    vertices = [
        vec2( -0.8 , -0.8 ),
        vec2(  0.8 , -0.8 ),
        vec2(  0 ,  0.8 )
    ] 

    
    canvas.addEventListener( "click" , ()=>{
        console.log("clicked");
        clicks++
        if(clicks==1){
            vertices = [
                vec2( -0.8 , -0.8 ),
                vec2(  0.8 , -0.8 ),
                vec2(  0.8 ,  0.8 ),
                vec2( -0.8 ,  0.8 )
            ]
            
        }
        else if(clicks==2){
            vertices = [
                vec2( -0.4, -0.8 ),
                vec2(  0.4, -0.8 ),
                vec2(  0.0,  0.0 ),
                vec2( -0.8, -0.4 ),
                vec2( -0.8,  0.4 ),
                vec2( -0.4,  0.8 ),
                vec2(  0.4,  0.8 ),
                vec2(  0.8,  0.4 ),
                vec2(  0.8, -0.4 ),
                vec2(  0.4, -0.8 )
            ]
            

        }else{
            //triangle 
            vertices = [
                vec2( -0.8 , -0.8 ),
                vec2(  0.8 , -0.8 ),
                vec2(  0 ,  0.8 )
            ] 
        
            clicks =0
        }

        load()
        render()
    })


    //  Configure WebGL

    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 0.8, 0.8, 0.8, 1.0 );
    
   
    load()
    render()
};


function load() {
     //  Load shaders and initialize attribute buffers
    
     var program = initShaders( gl, "vertex-shader", "fragment-shader" );
     gl.useProgram( program );
     
    // Load the data into the GPU
    
    var bufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
    gl.bufferData( gl.ARRAY_BUFFER,flatten(vertices), gl.STATIC_DRAW );

    // Associate out shader variables with our data buffer
    
    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

}

function render() {
    gl.clear( gl.COLOR_BUFFER_BIT );
    gl.drawArrays( gl.TRIANGLE_FAN, 0, vertices.length );
}
