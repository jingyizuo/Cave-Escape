import {tiny, defs} from './common.js';

                                                  // Pull these names into this module's scope for convenience:
const { vec3, vec4, color, Mat4, Light, Shape, Material, Shader, Texture, Scene } = tiny;
const { Triangle, Square, Tetrahedron, Windmill, Cube, Subdivision_Sphere, Shape_From_File,Scene_To_Texture_Demo } = defs;


export class Transforms_Sandbox_Base extends Scene
{                                          // **Transforms_Sandbox_Base** is a Scene that can be added to any display canvas.
                                           // This particular scene is broken up into two pieces for easier understanding.
                                           // The piece here is the base class, which sets up the machinery to draw a simple 
                                           // scene demonstrating a few concepts.  A subclass of it, Transforms_Sandbox,
                                           // exposes only the display() method, which actually places and draws the shapes,
                                           // isolating that code so it can be experimented with on its own.
  constructor()
    {                  // constructor(): Scenes begin by populating initial values like the Shapes and Materials they'll need.

      super();
      this.hover = this.swarm = false;
                                                        // At the beginning of our program, load one of each of these shape 
                                                        // definitions onto the GPU.  NOTE:  Only do this ONCE per shape it
                                                        // would be redundant to tell it again.  You should just re-use the
                                                        // one called "box" more than once in display() to draw multiple cubes.
                                                        // Don't define more than one blueprint for the same thing here.
      this.gl=null;
      this.off=null;
      this.framebuffer=null;
      this.pixels=vec4(1,0,0,0);
      this.shapes = { 'box'  : new Cube(),
                      'ball' : new Subdivision_Sphere( 4 ),
                      'cave' : new Shape_From_File("../assets/cave.obj"),
                      'torch' : new Shape_From_File("../assets/wall_torch.obj"),
                      'door_left' : new Shape_From_File("../assets/door_left.obj"),
                      'door_right' : new Shape_From_File("../assets/door_right.obj"),
                      'door_plane' : new Shape_From_File("../assets/doorplane.obj"),
                      'box_1':   new defs.Cube(),
                      'box_2': new defs.Cube(),
                      'plane': new defs.Square(),
                      
                    };

            this.scratchpad = document.getElementById("surface");
                                    // A hidden canvas for re-sizing the real canvas to be square:
        this.scratchpad_context = this.scratchpad.getContext('2d');
        this.scratchpad.width   = 256;
        this.scratchpad.height  = 256;                // Initial image source: Blank gif file:
        this.texture = new Texture( "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7" );

      
      this.shapes.cave.arrays.texture_coord.forEach( p => p.scale_by( 10 ) );
      this.shapes.torch.arrays.texture_coord.forEach( p => p.scale_by( 10 ) );
      this.shapes.door_left.arrays.texture_coord.forEach( p => p.scale_by( 10 ) );
      this.shapes.door_right.arrays.texture_coord.forEach( p => p.scale_by( 10 ) );
      this.shapes.door_plane.arrays.texture_coord.forEach( p => p.scale_by( 10 ) );
      
      
                                                  // *** Materials: *** Define a shader, and then define materials that use
                                                  // that shader.  Materials wrap a dictionary of "options" for the shader.
                                                  // Here we use a Phong shader and the Material stores the scalar 
                                                  // coefficients that appear in the Phong lighting formulas so that the
                                                  // appearance of particular materials can be tweaked via these numbers.
      const bump = new defs.Fake_Bump_Map();
      const phong = new defs.Phong_Shader();
      const off_shader=new defs.Offscreen_Shader();
      this.materials = { plastic: new Material( phong,
                                    { ambient: .3, diffusivity: 1, specularity: .5, color: color( .9,.5,.9,1 ) } ),
                          metal: new Material( phong, 
                                    { ambient: .2, diffusivity: 1, specularity:  1, color: color( .9,.5,.9,1 ) } ) ,
                          a: new Material( bump, { ambient: 1}),
                         c: new Material( bump, { ambient:  1, texture: this.texture }),
                                    };
          
                                                           // Bump mapped:
      this.bumps = new Material( new defs.Fake_Bump_Map( 1 ), { color: color( .5,.5,.5,1 ), 
          ambient: .3, diffusivity: .5, specularity: .5, texture: new Texture( "assets/cave.png" ) });
      this.offscreen=new Material( off_shader,
        { ambient: 1, color: color( 0,1,1,1 ) } );



  

    }
  make_control_panel()
    {                                 // make_control_panel(): Sets up a panel of interactive HTML elements, including
                                      // buttons with key bindings for affecting this scene, and live info readouts.
      this.control_panel.innerHTML += "Dragonfly rotation angle: <br>";
                                                // The next line adds a live text readout of a data member of our Scene.
      this.live_string( box => { box.textContent = ( this.hover ? 0 : ( this.t % (2*Math.PI)).toFixed(2) ) + " radians" } ); 
      this.new_line();
                                                // Add buttons so the user can actively toggle data members of our Scene:
      this.key_triggered_button( "Hover dragonfly in place", [ "h" ], function() { this.hover ^= 1; } );
      this.new_line();
      this.key_triggered_button( "Swarm mode", [ "m" ], function() { this.swarm ^= 1; } );
      this.live_string( box => box.textContent = this.pixels);
      this.new_line();
    }
  
  show_explanation( document_section)
    {
   
    } 
  display( context, program_state, off)
    {                                                // display():  Called once per frame of animation.  We'll isolate out
                                                     // the code that actually draws things into Transforms_Sandbox, a
                                                     // subclass of this Scene.  Here, the base class's display only does
                                                     // some initial setup.
 
                           // Setup -- This part sets up the scene's overall camera matrix, projection matrix, and lights:
    var canvas = document.getElementsByTagName("canvas")[1];
     this.gl = context.canvas.getContext("webgl")||context.canvas.getContext("experimental-webgl");
     var width = canvas.width;
     var height = canvas.height;
     //alert(width);
      if( !context.scratchpad.controls ) 
        { this.children.push( context.scratchpad.controls = new defs.Movement_Controls() ); 

                    // Define the global camera and projection matrices, which are stored in program_state.  The camera
                    // matrix follows the usual format for transforms, but with opposite values (cameras exist as 
                    // inverted matrices).  The projection matrix follows an unusual format and determines how depth is 
                    // treated when projecting 3D points onto a plane.  The Mat4 functions perspective() and
                    // orthographic() automatically generate valid matrices for one.  The input arguments of
                    // perspective() are field of view, aspect ratio, and distances to the near plane and far plane.
          program_state.set_camera( Mat4.translation( 0,0,0 ) );
        }

      program_state.projection_transform = Mat4.perspective( Math.PI/4, context.width/context.height, 1, 100 );
      
                                                // *** Lights: *** Values of vector or point lights.  They'll be consulted by 
                                                // the shader when coloring shapes.  See Light's class definition for inputs.
      const t = this.t = program_state.animation_time/1000;
      const angle = Math.sin( t );
      const light_position = Mat4.rotation( angle,   1,0,0 ).times( vec4( 0,-1,1,0 ) );
      program_state.lights = [ new Light( light_position, color( 1,1,1,1 ), 1000000 ) ];
    }
}


export class Transforms_Sandbox extends Transforms_Sandbox_Base
{                                                    // **Transforms_Sandbox** is a Scene object that can be added to any display canvas.
                                                     // This particular scene is broken up into two pieces for easier understanding.
                                                     // See the other piece, Transforms_Sandbox_Base, if you need to see the setup code.
                                                     // The piece here exposes only the display() method, which actually places and draws 
                                                     // the shapes.  We isolate that code so it can be experimented with on its own.
                                                     // This gives you a very small code sandbox for editing a simple scene, and for
                                                     // experimenting with matrix transformations.
  display( context, program_state,off )
    {                                                // display():  Called once per frame of animation.  For each shape that you want to
                                                     // appear onscreen, place a .draw() call for it inside.  Each time, pass in a
                                                     // different matrix value to control where the shape appears.

                                                     // Variables that are in scope for you to use:
                                                     // this.shapes.box:   A vertex array object defining a 2x2x2 cube.
                                                     // this.shapes.ball:  A vertex array object defining a 2x2x2 spherical surface.
                                                     // this.materials.metal:    Selects a shader and draws with a shiny surface.
                                                     // this.materials.plastic:  Selects a shader and draws a more matte surface.
                                                     // this.lights:  A pre-made collection of Light objects.
                                                     // this.hover:  A boolean variable that changes when the user presses a button.
                                                     // program_state:  Information the shader needs for drawing.  Pass to draw().
                                                     // context:  Wraps the WebGL rendering context shown onscreen.  Pass to draw().                                                       

                                                // Call the setup code that we left inside the base class:
      super.display( context, program_state ,off);

      /**********************************
      Start coding down here!!!!
      **********************************/         
                                                  // From here on down it's just some example shapes drawn for you -- freely 
                                                  // replace them with your own!  Notice the usage of the Mat4 functions 
                                                  // translation(), scale(), and rotation() to generate matrices, and the 
                                                  // function times(), which generates products of matrices.

      const blue = color( 0,0,1,1 ), yellow = color( 1,1,0,1 );

                                    // Variable model_transform will be a local matrix value that helps us position shapes.
                                    // It starts over as the identity every single frame - coordinate axes at the origin.
      let model_transform = Mat4.identity();
      if(off)
        this.shapes.box.draw(context, program_state, model_transform,this.offscreen);
      else                                            
        this.shapes.box.draw(context, program_state, model_transform,this.materials.plastic.override( color(1,1,1,1) ));


      model_transform= Mat4.identity();
      model_transform=Mat4.rotation(0.2,0,0,1).times(model_transform);
      model_transform=Mat4.scale(10,10,10).times(model_transform);
      model_transform=Mat4.translation(5,-7,50).times(model_transform);
      this.shapes.torch.draw(context, program_state, model_transform,this.bumps);

      model_transform= Mat4.identity();
      model_transform=Mat4.rotation(0.2,0,0,1).times(model_transform);
       model_transform=Mat4.scale(10,10,10).times(model_transform);
      model_transform=Mat4.translation(28,-7,90).times(model_transform);
      this.shapes.torch.draw(context, program_state, model_transform,this.bumps);

      model_transform= Mat4.identity();
      model_transform=Mat4.rotation(0.2,0,0,1).times(model_transform);
       model_transform=Mat4.scale(10,10,10).times(model_transform);
      model_transform=Mat4.translation(27,-7,130).times(model_transform);
      this.shapes.torch.draw(context, program_state, model_transform,this.bumps);

      model_transform= Mat4.identity();
      model_transform=Mat4.rotation(0.2,0,0,1).times(model_transform);
       model_transform=Mat4.scale(10,10,10).times(model_transform);
      model_transform=Mat4.translation(5.7,-7,180).times(model_transform);
      this.shapes.torch.draw(context, program_state, model_transform,this.bumps);


      model_transform= Mat4.identity();
      model_transform=Mat4.scale(20,20,20).times(model_transform);
      model_transform=Mat4.translation(40,0,70).times(model_transform);
      this.shapes.cave.draw(context, program_state, model_transform,this.bumps);

      model_transform= Mat4.identity();
      model_transform=Mat4.scale(20,20,20).times(model_transform);
      model_transform=Mat4.translation(40,0,70).times(model_transform);
      this.shapes.door_left.draw(context, program_state, model_transform,this.bumps);

      model_transform= Mat4.identity();
      model_transform=Mat4.scale(20,20,20).times(model_transform);
      model_transform=Mat4.translation(40,0,70).times(model_transform);
      this.shapes.door_right.draw(context, program_state, model_transform,this.bumps);

      
      model_transform= Mat4.identity();
      model_transform=Mat4.scale(20,20,20).times(model_transform);
      model_transform=Mat4.translation(-30,0,208).times(model_transform);
      this.shapes.door_plane.draw(context, program_state, model_transform,this.bumps);


      
        this.texture.image.src = this.scratchpad.toDataURL("image/png");

                                    // Don't call copy to GPU until the event loop has had a chance
                                    // to act on our SRC setting once:
        if( this.skipped_first_frame )
                                                     // Update the texture with the current scene:
            this.texture.copy_onto_graphics_card( context.context, false );
        this.skipped_first_frame = true;

                                    // Start over on a new drawing, never displaying the prior one:
        this.cube_2 = Mat4.translation( 44,12,-8 ).times(Mat4.rotation(Math.PI/7-0.1*Math.random(),0,0,1)).times(Mat4.rotation(Math.PI/4,0,1,0)).times(Mat4.scale(3,10,1));
  //  context.context.clear( context.context.COLOR_BUFFER_BIT | context.context.DEPTH_BUFFER_BIT);
        this.shapes.plane.draw( context, program_state, this.cube_2, this.materials.c );
       
        this.cube_2 = Mat4.translation( 67,12,32 ).times(Mat4.rotation(Math.PI/7-0.1*Math.random(),0,0,1)).times(Mat4.rotation(Math.PI/3.5,0,1,0)).times(Mat4.scale(3,10,1));
  //  context.context.clear( context.context.COLOR_BUFFER_BIT | context.context.DEPTH_BUFFER_BIT);
        this.shapes.plane.draw( context, program_state, this.cube_2, this.materials.c );

         this.cube_2 = Mat4.translation( 66,12,72 ).times(Mat4.rotation(Math.PI/7-0.1*Math.random(),0,0,1)).times(Mat4.rotation(Math.PI/3.5,0,1,0)).times(Mat4.scale(3,10,1));
  //  context.context.clear( context.context.COLOR_BUFFER_BIT | context.context.DEPTH_BUFFER_BIT);
        this.shapes.plane.draw( context, program_state, this.cube_2, this.materials.c );


         this.cube_2 = Mat4.translation( 46,12,122).times(Mat4.rotation(Math.PI/7-0.1*Math.random(),0,0,1)).times(Mat4.rotation(Math.PI/3.5,0,1,0)).times(Mat4.scale(3,10,1));
  //  context.context.clear( context.context.COLOR_BUFFER_BIT | context.context.DEPTH_BUFFER_BIT);
        this.shapes.plane.draw( context, program_state, this.cube_2, this.materials.c );

                              // Note that our coordinate system stored in model_transform still has non-uniform scaling
                              // due to our scale() call.  This could have undesired effects for subsequent transforms;
                              // rotations will behave like shears.  To avoid this it may have been better to do the
                              // scale() last and then immediately unscale after the draw.  Or better yet, don't store
                              // the scaled matrix back in model_transform at all -- but instead in just a temporary
                              // expression that we pass into draw(), or store under a different name.
    }
}