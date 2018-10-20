var gl, vertices;
let vers = [];
var colors = [
    vec4(0.831, 0.635, 0.416, 1.0), // brownish
    vec4(0.323, 0.357, 0.573, 1.0), // blueish
    vec4(0.298, 0.6, 0.42, 1.0), // greenish

];

const moveUpDown = .4;
const moveLeftRight = .4;
window.onload = function init() {
    var canvas = document.getElementById("gl-canvas");

    gl = WebGLUtils.setupWebGL(canvas);
    if (!gl) {
        alert("WebGL isn't available");
    }

    //  Configure WebGL
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(0.8, 0.8, 0.8, 1.0);

    //rectangle
    vertices = [
        vec2(-0.4, -0.2),
        vec2(-0.4, 0.2),
        vec2(0.0, -0.2),
        vec2(0.4,0.2),
        vec2(0.4,-0.2)
    ]

    vers =  [
        vec2(-0.4, -0.2),
        vec2(-0.4, 0.2),
        vec2(0.0, -0.2),
        vec2(0.4,0.2),
        vec2(0.4,-0.2)
    ]
   

    window.onkeypress = e=>{
        switch (e.key) {
            case "a":

            if(canMoveLeft(vers)){
                for (let index = 0; index < vers.length; index++) 
                        vers[index] = vec2(vers[index][0]-moveLeftRight, vers[index][1])
                    
                    load(vers);
                    render();
            }
                    
               
                break;
    
            case "s":
                if(canMoveDown(vers)){
                    for (let index = 0; index < vers.length; index++) 
                        vers[index] = vec2(vers[index][0], vers[index][1]-moveUpDown)

                    load(vers);
                    render();
                }
            break;
            
            case "d":

            if(canMoveRight(vers)){
                for (let index = 0; index < vers.length; index++)
                vers[index] = vec2(vers[index][0]+moveLeftRight, vers[index][1])
            
            load(vers);
            render();
            }
               
              
                break;
    
            case "w":
            if(canMoveUP(vers)){
                
                for (let index = 0; index < vers.length; index++) 
                    vers[index] = vec2(vers[index][0], vers[index][1]+moveUpDown) ;                  

                load(vers);
                render();
            }
            
            break;
    
            case "1":
            for (let i = 0; i < vertices.length; i++) 
                vers[i] = vertices[i];
                
            load(vertices);
            render();
            break;
    
            default:
                break;
        }
    }

    load(vertices);
    render()
};

const load = (vertices)=>{
     //  Load shaders and initialize attribute buffers
     var program = initShaders(gl, "vertex-shader", "fragment-shader");
     gl.useProgram(program);
 
     // Load the data into the GPU
     var bufferId = gl.createBuffer();
     gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);
     gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW);
 
     // Associate out shader variables with our data buffer
     var vPosition = gl.getAttribLocation(program, "vPosition");
     gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
     gl.enableVertexAttribArray(vPosition);
 
     var cBuffer = gl.createBuffer();
     gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
     gl.bufferData(gl.ARRAY_BUFFER, 16*5, gl.STATIC_DRAW);
 
     var vColor = gl.getAttribLocation( program, "vColor" );
     gl.vertexAttribPointer( vColor, 3, gl.FLOAT, false, 0, 0 );
     gl.enableVertexAttribArray( vColor );
 
     for (let index = 0; index < vertices.length; index++) {
         gl.bindBuffer( gl.ARRAY_BUFFER, bufferId);
         gl.bufferSubData(gl.ARRAY_BUFFER, 8*index, flatten(vertices[index]));
 
         gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer);
         gl.bufferSubData(gl.ARRAY_BUFFER, 16*index, flatten(colors[index%3]));
     }
}

const canMoveUP = (vertices)=>{
    for (let i = 0; i < vertices.length; i++) {
        if((vertices[i][1]+.4) >1)
            return false
    }
    return true
}

const canMoveLeft = (vertices)=>{
    for (let i = 0; i < vertices.length; i++) {
        if(vertices[i][0]-.4 <-1)
            return false
    }
    return true
}
const canMoveRight = (vertices)=>{
    for (let i = 0; i < vertices.length; i++) {
        if(vertices[i][0]+.4 >1)
            return false
    }
    return true
}
const canMoveDown = (vertices)=>{
    let i = 0;
    for (let i = 0; i < vertices.length; i++) {
        if (vertices[i][1]-moveUpDown <-1){
            return false
        }
        
    }
    return true

}


function render() {
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLE_STRIP,0, vertices.length);
}
