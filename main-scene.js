window.Cube = window.classes.Cube =
class Cube extends Shape                 // Here's a complete, working example of a Shape subclass.  It is a blueprint for a cube.
  { constructor()
      { super( "positions", "normals" ); // Name the values we'll define per each vertex.  They'll have positions and normals.

        // First, specify the vertex positions -- just a bunch of points that exist at the corners of an imaginary cube.
        this.positions.push( ...Vec.cast( [-1,-1,-1], [1,-1,-1], [-1,-1,1], [1,-1,1], [1,1,-1],  [-1,1,-1],  [1,1,1],  [-1,1,1],
                                          [-1,-1,-1], [-1,-1,1], [-1,1,-1], [-1,1,1], [1,-1,1],  [1,-1,-1],  [1,1,1],  [1,1,-1],
                                          [-1,-1,1],  [1,-1,1],  [-1,1,1],  [1,1,1], [1,-1,-1], [-1,-1,-1], [1,1,-1], [-1,1,-1] ) );
        // Supply vectors that point away from eace face of the cube.  They should match up with the points in the above list
        // Normal vectors are needed so the graphics engine can know if the shape is pointed at light or not, and color it accordingly.
        this.normals.push(   ...Vec.cast( [0,-1,0], [0,-1,0], [0,-1,0], [0,-1,0], [0,1,0], [0,1,0], [0,1,0], [0,1,0], [-1,0,0], [-1,0,0],
                                          [-1,0,0], [-1,0,0], [1,0,0],  [1,0,0],  [1,0,0], [1,0,0], [0,0,1], [0,0,1], [0,0,1],   [0,0,1],
                                          [0,0,-1], [0,0,-1], [0,0,-1], [0,0,-1] ) );

                 // Those two lists, positions and normals, fully describe the "vertices".  What's the "i"th vertex?  Simply the combined
                 // data you get if you look up index "i" of both lists above -- a position and a normal vector, together.  Now let's
                 // tell it how to connect vertex entries into triangles.  Every three indices in this list makes one triangle:
        this.indices.push( 0, 1, 2, 1, 3, 2, 4, 5, 6, 5, 7, 6, 8, 9, 10, 9, 11, 10, 12, 13,
                          14, 13, 15, 14, 16, 17, 18, 17, 19, 18, 20, 21, 22, 21, 23, 22 );
        // It stinks to manage arrays this big.  Later we'll show code that generates these same cube vertices more automatically.
      }
  }

window.Transforms_Sandbox = window.classes.Transforms_Sandbox =
class Transforms_Sandbox extends Tutorial_Animation   // This subclass of some other Scene overrides the display() function.  By only
{ display( graphics_state )                           // exposing that one function, which draws everything, this creates a very small code
                                                      // sandbox for editing a simple scene, and for experimenting with matrix transforms.
    { let model_transform = Mat4.identity();      // Variable model_transform will be a temporary matrix that helps us draw most shapes.
                                                  // It starts over as the identity every single frame - coordinate axes at the origin.
      graphics_state.lights = this.lights;        // Use the lights stored in this.lights.
      /**********************************
      Start coding down here!!!!
      **********************************/         // From here on down it's just some example shapes drawn for you -- freely replace them
                                                  // with your own!  Notice the usage of the functions translation(), scale(), and rotation()
                                                  // to generate matrices, and the functions times(), which generates products of matrices.

      const blue = Color.of( 0,0,1,1 ), yellow = Color.of( 1,1,0,1 );
      model_transform = model_transform.times( Mat4.translation([ 0, 3, 20 ]) );
      this.shapes.box.draw( graphics_state, model_transform, this.plastic.override({ color: yellow }) );   // Draw the top box.

      const t = this.t = graphics_state.animation_time/1000;     // Find how much time has passed in seconds, and use that to place shapes.

      model_transform = model_transform.times( Mat4.translation([ 0, -2, 0 ]) );  // Tweak our coordinate system downward for the next shape.
      this.shapes.ball.draw( graphics_state, model_transform, this.plastic.override({ color: blue }) );    // Draw the ball.

      if( !this.hover )     // The first line below won't execute if the button on the page has been toggled:
        model_transform = model_transform.times( Mat4.rotation( t, Vec.of( 0,1,0 ) ) )  // Spin our coordinate frame as a function of time.
      model_transform   = model_transform.times( Mat4.rotation( 1, Vec.of( 0,0,1 ) ) )  // Rotate another axis by a constant value.
                                         .times( Mat4.scale      ([ 1,   2, 1 ]) )      // Stretch the coordinate frame.
                                         .times( Mat4.translation([ 0,-1.5, 0 ]) );     // Translate down enough for the two volumes to miss.
      this.shapes.box.draw( graphics_state, model_transform, this.plastic.override({ color: yellow }) );   // Draw the bottom box.
    }
}

window.Cube_Outline = window.classes.Cube_Outline =
class Cube_Outline extends Shape
  { constructor()
      { super( "positions", "colors" ); // Name the values we'll define per each vertex.
      this.positions.push( ...Vec.cast( [-1,-1,-1], [1,-1,-1], [-1,-1,1], [1,-1,1], [1,1,-1],  [-1,1,-1],  [1,1,1],  [-1,1,1],
                                        [-1,-1,-1], [-1,-1,1], [-1,1,-1], [-1,1,1], [1,-1,1],  [1,-1,-1],  [1,1,1],  [1,1,-1],
                                        [1,1,-1],  [1,-1,-1],  [1,1,1], [1,-1,1], [-1,1,1], [-1,-1,1], [-1,1,-1], [-1,-1,-1] ) );
      this.colors.push( ...Vec.cast( [1,1,1,1], [1,1,1,1], [1,1,1,1], [1,1,1,1], [1,1,1,1], [1,1,1,1], [1,1,1,1], [1,1,1,1],
                                     [1,1,1,1], [1,1,1,1], [1,1,1,1], [1,1,1,1], [1,1,1,1], [1,1,1,1], [1,1,1,1], [1,1,1,1],
                                     [1,1,1,1], [1,1,1,1], [1,1,1,1], [1,1,1,1], [1,1,1,1], [1,1,1,1], [1,1,1,1], [1,1,1,1] ) );
      this.indexed = false;       // Do this so we won't need to define "this.indices".
        //  TODO (Requirement 5).
                                // When a set of lines is used in graphics, you should think of the list entries as
                                // broken down into pairs; each pair of vertices will be drawn as a line segment.

        this.indexed = false;       // Do this so we won't need to define "this.indices".
      }
  }

window.Cube_Single_Strip = window.classes.Cube_Single_Strip =
class Cube_Single_Strip extends Shape
  { constructor()
      { super( "positions", "normals" );
        this.positions.push( ...Vec.cast( [-1,1,1],[1,1,1],[-1,-1,1],[1,-1,1],[1,-1,-1],[1,1,1],[1,1,-1],
                                          [-1,1,1],[-1,1,-1],[-1,-1,1],[-1,-1,-1],[1,-1,-1],[-1,1,-1],[1,1,-1] ) );

        this.normals.push(   ...Vec.cast(  [-1,1,1],[1,1,1],[-1,-1,1],[1,-1,1],[1,-1,-1],[1,1,1],[1,1,-1],
                                           [-1,1,1],[-1,1,-1],[-1,-1,1],[-1,-1,-1],[1,-1,-1],[-1,1,-1],[1,1,-1] ) );

        this.indexed = false;
      }
  }

window.Assignment_One_Scene = window.classes.Assignment_One_Scene =
class Assignment_One_Scene extends Scene_Component
  { constructor( context, control_box )     // The scene begins by requesting the camera, shapes, and materials it will need.
      { super(   context, control_box );    // First, include a secondary Scene that provides movement controls:
        [ this.context,this.gl,this.framebuffer,this.pixels,this.mousspicking] = [ context,null,null,Vec.of(1,0,0,0),null ];                  // Data members
        if( !context.globals.has_controls   )
          context.register_scene_component( new Movement_Controls( context, control_box.parentElement.insertCell() ) );
          var canvas = document.getElementsByTagName("canvas")[1];
          this.gl = context.canvas.getContext("webgl")||context.canvas.getContext("experimental-webgl");
          var width = canvas.width;
          var height = canvas.height;
            //this.gl.enable(this.gl.CULL_FACE);
            var texture = this.gl.createTexture();
            this.gl.bindTexture(this.gl.TEXTURE_2D, texture);
            //this.gl.pixelStorei(this.gl.UNPACK_FLIP_Y_WEBGL, true);
            this.gl.texImage2D(this.gl.TEXTURE_2D, 0,this.gl.RGB, width, height, 0,this.gl.RGB,this.gl.UNSIGNED_BYTE, null);
            this.gl.generateMipmap(this.gl.TEXTURE_2D);
            var renderbuffer = this.gl.createRenderbuffer();
            this.gl.bindRenderbuffer(this.gl.RENDERBUFFER, renderbuffer);
            this.gl.renderbufferStorage(this.gl.RENDERBUFFER, this.gl.DEPTH_COMPONENT16, width, height);
                  // Get WebGLRenderingContext from canvas element.

            this.framebuffer = this.gl.createFramebuffer();
            this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.framebuffer);
            this.gl.framebufferTexture2D(this.gl.FRAMEBUFFER, this.gl.COLOR_ATTACHMENT0, this.gl.TEXTURE_2D, texture, 0);
            this.gl.framebufferRenderbuffer(this.gl.FRAMEBUFFER, this.gl.DEPTH_ATTACHMENT, this.gl.RENDERBUFFER, renderbuffer);
            var program=this.gl.createProgram();

           var status=this.gl.checkFramebufferStatus(this.gl.FRAMEBUFFER);
           if (status !== this.gl.FRAMEBUFFER_COMPLETE) {
              alert(status);
           }
           document.addEventListener( "mousedown",   e => {

            
    	      // off-screen rendering
    	      this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.framebuffer);
            //this.gl.uniform1i(program.uOffscreen, true);
            context.get_instance( Phong_Shader ).update_flag(true);
            this.gl.clear(this.gl.COLOR_BUFFER_BIT |this.gl.DEPTH_BUFFER_BIT);
    	      this.display(context.globals.graphics_state);

    	
            var colorPicked = new Uint8Array(4);
            this.gl.readPixels(width/2, height/2, 1, 1, this.gl.RGBA, this.gl.UNSIGNED_BYTE, colorPicked);
            this.pixels=colorPicked;

            if(colorPicked[0]==255&&colorPicked[1]==0&&colorPicked[2]==0){
              this.mousepicking="door";
            }
            else
              this.mousepicking=null;

            // on-screen rendering
    	      this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);
            //this.gl.uniform1i(program.uOffscreen, false);
            context.get_instance( Phong_Shader ).update_flag(false);
            this.gl.clear(this.gl.COLOR_BUFFER_BIT |this.gl.DEPTH_BUFFER_BIT);
            this.display(context.globals.graphics_state);


           } );



           this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.framebuffer);



            this.gl.bindTexture(this.gl.TEXTURE_2D, null);
            this.gl.bindRenderbuffer(this.gl.RENDERBUFFER, null);
            this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);


        const r = context.width/context.height;
        context.globals.graphics_state.    camera_transform = Mat4.translation([ 0,5,0 ]);  // Locate the camera here (inverted matrix).
        context.globals.graphics_state.projection_transform = Mat4.perspective( Math.PI/4, r, .1, 1000 );

        const shapes = { 'box': new Cube(),               // At the beginning of our program, load one of each of these shape
                       'strip': new Cube_Single_Strip(),  // definitions onto the GPU.  NOTE:  Only do this ONCE per shape
                     'outline': new Cube_Outline() ,
                     planet_1: new (Subdivision_Sphere)(3)
                    }      // design.  Once you've told the GPU what the design of a cube is,
        this.submit_shapes( context, shapes );            // it would be redundant to tell it again.  You should just re-use
                                                          // the one called "box" more than once in display() to draw
                                                          // multiple cubes.  Don't define more than one blueprint for the
                                                          // same thing here.

                                     // Make some Material objects available to you:
        this.clay   = context.get_instance( Phong_Shader ).material( Color.of( .9,.5,.9, 1 ), { ambient: 0.3, diffusivity: 0.8,specular:0.4 } );
        this.white  = context.get_instance( Basic_Shader ).material();
        this.plastic = this.clay.override({ specularity: .6 });

        this.lights = [ new Light( Vec.of( 0,5,5,1 ), Color.of( 1, 0, 0, 1 ), 10000 ) ];

        this.materials =
          { sun_material:     context.get_instance( Phong_Shader ).material( Color.of( 1,1,1,1 ), { ambient:1 } ),
            p1_material:     context.get_instance( Phong_Shader ).material( Color.of( 0.72, 0.74, 0.9,1 ), { diffusivity: 1} ),
            p2_material:     context.get_instance( Phong_Shader ).material( Color.of( 0.1,0.5,0.48,1 ), { diffusivity: .3 ,specular: 1} ),
            p3_material:     context.get_instance( Phong_Shader ).material( Color.of( 0.9,0.5,0.39,1 ), { diffusivity: 1 ,specular: 1 } ),
            p4_material:     context.get_instance( Phong_Shader ).material( Color.of( 0.1,0.1,0.9,1 ), { specular: 0.8 } ),
            p5_material:     context.get_instance( Phong_Shader ).material( Color.of( 0.74,0.7,0.76,1 ), { diffusivity: 1 ,specular: 1 } )

                                // TODO:  Fill in as many additional material objects as needed in this key/value table.
                                //        (Requirement 1)
          }

        this.rgba=[];
        this.outline_flag=false;
        this.rotate_flag=true;
        this.set_outline_flag();
        this.set_colors();
        this.set_rotate();

      }
    set_outline_flag(){
          this.outline_flag=!this.outline_flag;
    }
    set_colors() {
          // TODO:  Create a class member variable to store your cube's colors.
          for( let i=0;i<=7;i++ )
          {
            this.rgba[i]=Color.of(Math.random(),Math.random(),Math.random(),1);
          }
      }
    set_rotate(){
          this.rotate_flag=!this.rotate_flag;
    }

    make_control_panel()             // Draw the scene's buttons, setup their actions and keyboard shortcuts, and monitor live measurements.
      {
        this.key_triggered_button( "Change Colors", [ "c" ], this.set_colors );    // Add a button for controlling the scene.
        this.key_triggered_button( "Outline",       [ "o" ], this.set_outline_flag );
        this.key_triggered_button( "Sit still",     [ "m" ], this.set_rotate );
        this.live_string( box => box.textContent = this.pixels);
        this.new_line();
        this.live_string( box => box.textContent = this.mousepicking);
        this.new_line();
      }
    render(graphics_state, model_transform) {
      const yellow = Color.of( 1,1,0,1 );
      var program=this.gl.createProgram();
    	// off-screen rendering
    	this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.framebuffer);
      this.gl.uniform1i(program.uOffscreen, true);
      context.get_instance( Phong_Shader ).update_flag(true);
    	this.shapes.box.draw( graphics_state, model_transform,this.plastic.override({ color: yellow }));

    	// on-screen rendering
    	this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);
      this.gl.uniform1i(program.uOffscreen, false);
      context.get_instance( Phong_Shader ).update_flag(false);
      this.shapes.box.draw( graphics_state, model_transform,this.plastic.override({ color: yellow }));

    }
    draw_box( graphics_state, model_transform,index )
      {
        // TODO:  Helper function for requirement 3 (see hint).
        //        This should make changes to the model_transform matrix, draw the next box, and return the newest model_transform.
        if(index==0) {
          //this.shapes.outline.draw( graphics_state, model_transform2, this.white, "LINES"  );
          this.shapes.strip.draw( graphics_state, model_transform, this.plastic.override({color: this.rgba[index] } ), "TRIANGLE_STRIP"  );
        }
        else {
          if( !this.outline_flag ) {
            this.shapes.outline.draw( graphics_state, model_transform, this.white, "LINES"  );
          }
          else {
            this.shapes.box.draw( graphics_state, model_transform, this.plastic.override({color: this.rgba[index] } ) );
          }
        }
        //model_transform=this.draw_box( graphics_state, model_transform,i )
        if(!this.rotate_flag )  {
          model_transform = model_transform.times( Mat4.translation(Vec.of(1,1,1)));
          model_transform = model_transform.times( Mat4.rotation( -0.02*Math.PI-0.02*Math.PI*Math.sin(20*this.t), Vec.of( 0,0,1 ) ) );
          model_transform = model_transform.times( Mat4.translation(Vec.of(-1,1,-1)));
        }
        else{
          model_transform = model_transform.times( Mat4.translation(Vec.of(1,1,1)));
          model_transform = model_transform.times( Mat4.rotation( -0.02*Math.PI-0.02*Math.PI*1, Vec.of( 0,0,1) ) );
          model_transform = model_transform.times( Mat4.translation(Vec.of(-1,1,-1)));

        }
        return model_transform;
      }
    display( graphics_state )
      {
        const t = graphics_state.animation_time / 1000, dt = graphics_state.animation_delta_time / 1000;
        var fire_pos=(Mat4.inverse(graphics_state.camera_transform)).times(Vec.of(0,0,0,1));
        let light=new Light( fire_pos, Color.of(1,0.2,0,1), 5+Math.random()*3);
        this.lights.pop();
        this.lights.push(light);
        //graphics_state.lights = this.lights;
        graphics_state.lights = this.lights;        // Use the lights stored in this.lights.
        const blue = Color.of( 0,0,1,1 ), yellow = Color.of( 1,1,0,1 );

        let model_transform = Mat4.identity();
        model_transform=Mat4.scale([10,8,0.1]).times(model_transform);
        model_transform=Mat4.translation([0,0,-10]).times(model_transform);
        this.shapes.box.draw( graphics_state, model_transform, this.plastic.override({ color: blue }));
        //this.render(graphics_state, model_transform);
        model_transform = Mat4.identity();
        model_transform=Mat4.scale([0.1,8,10]).times(model_transform);
        model_transform=Mat4.translation([-10,0,0]).times(model_transform);
        this.shapes.box.draw( graphics_state, model_transform,this.plastic.override({ color: yellow }));

        //this.render(graphics_state, model_transform);

        model_transform = Mat4.identity();
        model_transform=Mat4.scale([0.1,8,10]).times(model_transform);
        model_transform=Mat4.translation([10,0,0]).times(model_transform);
        this.shapes.box.draw( graphics_state, model_transform,this.plastic.override({ color: yellow }));
        //this.render(graphics_state, model_transform);
        model_transform = Mat4.identity();
        model_transform=Mat4.scale([10,8,0.1]).times(model_transform);
        model_transform=Mat4.translation([0,0,10]).times(model_transform);
        this.shapes.box.draw( graphics_state, model_transform,this.plastic.override({ color: blue }));

        model_transform = Mat4.identity();
        model_transform=Mat4.scale([10,0.1,10]).times(model_transform);
        model_transform=Mat4.translation([0,-8,0]).times(model_transform);
        this.shapes.box.draw( graphics_state, model_transform,this.plastic.override({ color: Color.of(1,1,1,1) }));

        model_transform = Mat4.identity();
        model_transform=Mat4.scale([3,4,0.1]).times(model_transform);
        model_transform=Mat4.translation([0,-4,-9.9]).times(model_transform);
        if(this.mousepicking)
          this.shapes.box.draw( graphics_state, model_transform,this.plastic.override({ color: Color.of(1,1,0,1) }));
        else
          this.shapes.box.draw( graphics_state, model_transform,this.plastic.override({ color: Color.of(1,0,0,1) }));

        model_transform = Mat4.scale([0.2,0.5,0.2]);
        //model_transform = Mat4.translation([2,-3,2]).times(model_transform);
        //model_transform=Mat4.inverse(graphics_state.camera_transform).times(model_transform);
        //model_transform = Mat4.translation([2,-3,2]).times(model_transform);
        //this.shapes.box.draw( graphics_state, model_transform,this.plastic.override({ color: Color.of(1,0,1,1) }));
        model_transform = Mat4.identity();
        this.shapes.planet_1.draw( graphics_state, model_transform,this.plastic.override({ color: Color.of(1,1,1,1) }));
        // TODO:  Draw your entire scene here.  Use this.draw_box( graphics_state, model_transform ) to call your helper.
      }
  }
