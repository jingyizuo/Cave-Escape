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
      this.mousepicking=null;
      this.framebuffer=null;
      this.box=true;
      this.light=false;
      this.light_num=[0,0,0,0];
      this.gun=false;
      this.shoot=false;
      this.is_key=false;
      this.sound=false;
      this.light_pos=[vec4(0,0,0,1),vec4(0,0,0,1),vec4(0,0,0,1),vec4(0,0,0,1)];
      this.pixels=vec4(1,0,0,0);
      this.shapes = {
                      'cave1' : new Shape_From_File("../assets/cave/cave1.obj"),
                      'cave2' : new Shape_From_File("../assets/cave/cave2.obj"),
                      'cave3' : new Shape_From_File("../assets/cave/cave3.obj"),
                      'cave4' : new Shape_From_File("../assets/cave/cave4.obj"),
                      'cave5' : new Shape_From_File("../assets/cave/cave5.obj"),
                      'torch' : new Shape_From_File("../assets/wall_torch.obj"),
                      'door_left' : new Shape_From_File("../assets/door_left.obj"),
                      'door_right' : new Shape_From_File("../assets/door_right.obj"),
                      'door_plane' : new Shape_From_File("../assets/doorplane.obj"),                      
                      'gun':   new Shape_From_File("../assets/Pistol_obj.obj"),
                      'plane': new defs.Square(),
                      'gun_black': new Shape_From_File("../assets/gunblack.obj"),
                      'gun_silver': new Shape_From_File("../assets/gunsliver.obj"),
                      'box_bottom': new Shape_From_File("../assets/box_open.obj"),
                      'box_unopened': new Shape_From_File("../assets/box_unopen.obj"),
                      'key': new Shape_From_File("../assets/key.obj"),
                      'statue': new Shape_From_File("../assets/statue.obj")
                      
                    };

            this.scratchpad = document.getElementById("surface");
                                    // A hidden canvas for re-sizing the real canvas to be square:
        this.scratchpad_context = this.scratchpad.getContext('2d');
        this.scratchpad.width   = 256;
        this.scratchpad.height  = 256;                // Initial image source: Blank gif file:
        this.texture = new Texture( "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7" );

      
      this.shapes.cave1.arrays.texture_coord.forEach( p => p.scale_by( 10 ) );
      this.shapes.cave2.arrays.texture_coord.forEach( p => p.scale_by( 10 ) );
      this.shapes.cave3.arrays.texture_coord.forEach( p => p.scale_by( 10 ) );
      this.shapes.cave4.arrays.texture_coord.forEach( p => p.scale_by( 10 ) );
      this.shapes.cave5.arrays.texture_coord.forEach( p => p.scale_by( 10 ) );
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

      const off_shader=new defs.Offscreen_Shader(2);
      this.materials = { plastic: new Material( phong,
                                    { ambient: .3, diffusivity: 1, specularity: .5, color: color( .9,.5,.9,1 ) } ),
                          metal: new Material( phong, 
                                    { ambient: .2, diffusivity: 1, specularity:  1, color: color( .9,.5,.9,1 ) } ) ,
                          a: new Material( bump, { ambient: 1}),
                         c: new Material( bump, { ambient:  1, texture: this.texture }),
                                    };
          
                                                           // Bump mapped:
      this.bumps = new Material( new defs.Fake_Bump_Map( ), { color: color( .5,.5,.5,1 ), 
          ambient: .1, diffusivity: .7, specularity: .7, texture: new Texture( "assets/cave.png" ) });
      this.wood = new Material( bump, { color: color( .5,.5,.5,1 ), 
            ambient: .1, diffusivity: .7, specularity: .7, texture: new Texture( "assets/keybox.png" ) });
      this.offscreen=new Material( off_shader,
        { ambient: 1, color: color( 0,1,1,1 ) } );
      var answer_set_str=["011","101","110"];
      var answer_set=[[0,1,1],[1,0,1],[1,1,0]];
      var key_num=getRandomInt(3);
      this.answer_str=answer_set_str[key_num];
      this.answer=answer_set[key_num];
      this.answer_photo = new Material(new defs.Textured_Phong(), { color: color( .5,.5,.5,1 ), 
            ambient: .1, diffusivity: .7, specularity: .7, texture: new Texture( "assets/answers/answer"+this.answer_str+".png" ) });


      document.addEventListener( "mouseup",   e => {
           
            var r=this.pixels[0];
            var g=this.pixels[1];
            var b=this.pixels[2];
            if(r==0 && g==0){
                  switch(b) {
              case 1:
                this.mousepicking="torch1";
                this.light=true;
                if(!this.gun){
                   this.light_num[0]=(this.light_num[0]+1)%2;
                }
                break;
              case 2:
                this.mousepicking="torch2";
                this.light=true;
                if(!this.gun){
                   this.light_num[1]=(this.light_num[1]+1)%2;
                }
                break;
              case 3:
                this.mousepicking="torch3";
                this.light=true;
                if(!this.gun){
                   this.light_num[2]=(this.light_num[2]+1)%2;
                }
                break;
              case 4:
                this.mousepicking="torch4";
                this.light=true;
                if(!this.gun){
                   this.light_num[3]=(this.light_num[3]+1)%2;
                }
                break;
              case 5:
                this.mousepicking="door_left";
                break;
              case 6:
                this.mousepicking="door_right";
                break;
              case 7:
                this.mousepicking="keybox";
                if(this.gun){                      
                  last_fire=true;
                  key=true;
                  this.shoot=true;
                  this.gun=false;
                  this.box=false;                  
                }
                break;
              case 8:
                this.mousepicking="key";
                this.is_key=true;
                break;
              case 9:
                this.mousepicking="gun";
                this.gun=true;
                first_fire=true;
                break;
              case 10:
                this.mousepicking="statue";
                break;
              default:
                this.mousepicking=null;
            }
                  if(b==7&& this.gun==false && last_fire!=true){
                        tempAlert(" This BOX is LOCKED... ",1000);
                  }
                  if((b==5 ||b==6) && this.is_key==false){
                        tempAlert("This DOOR is LOCKED...",1000);
                  }
                  if(b<=4 && b>=0 && this.gun==false){
                        tempAlert("TORCH",800);
                  }
                  if(b==9){
                        tempAlert("GUN",800);
                  }
                  if(b==8){
                        tempAlert("KEY",800);
                  }
                  if(b==10 && this.gun==false){
                        tempAlert("STATUE...Nothing Special",800);
                  }
            }
            else
                  this.mousepicking=null;
            
    	    if(this.light_num[0]+this.light_num[1]+this.light_num[2]+this.light_num[3]!=0 && this.sound==false){                
                 document.getElementById('fire_audio').src ="https://www.youtube.com/embed/zLiHMw-Pfxg?&autoplay=1&loop=1&playlist=zLiHMw-Pfxg";
                 this.sound=true;
            }
            else if(this.light_num[0]+this.light_num[1]+this.light_num[2]+this.light_num[3]!=0 && this.sound==true){}
            else{
                document.getElementById('fire_audio').src ="";
                this.sound=false;
            }
            


           } );
  

    }
  make_control_panel()
    {                                 // make_control_panel(): Sets up a panel of interactive HTML elements, including
                                      // buttons with key bindings for affecting this scene, and live info readouts.
    }
 
  show_explanation( document_section)
    {
   
    } 
  display( context, program_state, off,pixels)
    {                                                // display():  Called once per frame of animation.  We'll isolate out
                                                     // the code that actually draws things into Transforms_Sandbox, a
                                                     // subclass of this Scene.  Here, the base class's display only does
                                                     // some initial setup.
 
                           // Setup -- This part sets up the scene's overall camera matrix, projection matrix, and lights:
      this.pixels=pixels;
      if( !context.scratchpad.controls ) 
        { this.children.push( context.scratchpad.controls = new defs.Movement_Controls() ); 

                    // Define the global camera and projection matrices, which are stored in program_state.  The camera
                    // matrix follows the usual format for transforms, but with opposite values (cameras exist as 
                    // inverted matrices).  The projection matrix follows an unusual format and determines how depth is 
                    // treated when projecting 3D points onto a plane.  The Mat4 functions perspective() and
                    // orthographic() automatically generate valid matrices for one.  The input arguments of
                    // perspective() are field of view, aspect ratio, and distances to the near plane and far plane.
          program_state.set_camera( Mat4.translation( -42,3,-85 ) );
        }

      program_state.projection_transform = Mat4.perspective( Math.PI/4, context.width/context.height, 1, 10000 );
      
                                                // *** Lights: *** Values of vector or point lights.  They'll be consulted by 
                                                // the shader when coloring shapes.  See Light's class definition for inputs.
      const t = this.t = program_state.animation_time/1000;
      const angle = Math.sin( t );
      this.num=this.light_num[0]+this.light_num[1]+this.light_num[2]+this.light_num[3];
      if(this.num!=0){
        program_state.lights = [ new Light(program_state.camera_transform.times( vec4( -0.1,1+0.1*Math.random(),1,0 ) ),color(1,0.2+0.1*Math.random(),0,1),3*this.num)]
      }
      else
        program_state.lights = [ new Light(program_state.camera_transform.times( vec4( 0,-1,1,0 ) ),color(1,1,1,1),.3)];
      //this.check(this.pixels);
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
  display( context, program_state,off,pixels )
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
      super.display( context, program_state ,off,pixels);

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
      switch(this.num){
        case 0:
          this.bumps=this.bumps.override({ambient: .02});
          this.wood=this.wood.override({ambient: .02});
          break;
        case 1:
          this.bumps=this.bumps.override({ambient: 0.05});
          this.wood=this.wood.override({ambient: 0.05});
          break;
        case 2:
          this.bumps=this.bumps.override({ambient: 0.07});
          this.wood=this.wood.override({ambient: 0.07});
          break;
        case 3:
          this.bumps=this.bumps.override({ambient: 0.09});
          this.wood=this.wood.override({ambient: 0.09});
          break;
        case 4:
          this.bumps=this.bumps.override({ambient: 0.10});
          this.wood=this.wood.override({ambient: 0.10});
          break;
      }
      //gun
      model_transform=Mat4.translation(34,-2.7,11).times(Mat4.scale(0.3,0.3,0.3)).times(Mat4.rotation(0,0,0,1));  
      if(this.light_num[3]==this.answer[0] && this.light_num[2]==this.answer[1] && this.light_num[1]==this.answer[2]){
        if(!this.gun && this.shoot==false){
          if(off){
            this.shapes.gun_black.draw(context, program_state, model_transform,this.offscreen.override( color(0,0,9/255,1) ));
            this.shapes.gun_silver.draw(context, program_state, model_transform,this.offscreen.override( color(0,0,9/255,1) ));
          }
          else{
            this.shapes.gun_black.draw(context, program_state, model_transform,this.materials.plastic.override( color(.1,.1,.1,1) ));
            this.shapes.gun_silver.draw(context, program_state, model_transform,this.materials.metal.override( color(.75,.75,.75,1) ));
          }
        }
        else if(!this.shoot){
          model_transform=program_state.camera_transform.times(Mat4.translation(1,-2,-3)).times(Mat4.scale(.2,.2,-.2));
          this.shapes.gun_black.draw(context, program_state, model_transform,this.materials.plastic.override( color(.1,.1,.1,1) ));
          this.shapes.gun_silver.draw(context, program_state, model_transform,this.materials.metal.override( color(.75,.75,.75,1) ));  
        }
        
      }  
      //keybox                                   
      model_transform=Mat4.translation(50,-14,78).times(Mat4.scale(3,3,3));
      if(this.box){
        if(off)
          this.shapes.box_unopened.draw(context, program_state, model_transform,this.offscreen.override(color(0,0,7/255,1)));
        else                                            
          this.shapes.box_unopened.draw(context, program_state, model_transform,this.wood.override(color(0.75,0.5,0.3,1)));
      }
      else{
        model_transform=model_transform.times(Mat4.rotation(Math.PI/2,0,1,0));
        this.shapes.box_bottom.draw(context, program_state, model_transform,this.wood.override(color(0.75,0.5,0.3,1)));
        //this.shapes.box_lid.draw(context, program_state, model_transform,this.wood.override(color(0.75,0.5,0.3,1)));
        //this.shapes.box_side.draw(context, program_state, model_transform,this.wood.override(color(0.75,0.5,0.3,1)));
        model_transform=model_transform.times(Mat4.translation(0.4,-1,0.4)).times(Mat4.rotation(Math.PI/2,1,0,0)).times(Mat4.scale(1.5,1.5,1.5));
        if(!this.is_key){
          if(off){
            this.shapes.key.draw(context, program_state, model_transform,this.offscreen.override(color(0,0,8/255,1)));
          }
          else
            this.shapes.key.draw(context, program_state, model_transform,this.materials.metal.override(color(0.5,0.5,0.1,1)));
        }
        
      }
      //key
      if(this.is_key){
        model_transform=program_state.camera_transform.times(Mat4.translation(6,-3,-25)).times(Mat4.scale(10,10,10)).times(Mat4.rotation(Math.PI/2,0,1,0));
        this.shapes.key.draw(context, program_state, model_transform,this.materials.metal.override(color(0.5,0.5,0.1,1)));
      }


      //torch2
      model_transform= Mat4.identity();
      model_transform=Mat4.rotation(0.2,0,0,1).times(model_transform);
       model_transform=Mat4.scale(10,11,10).times(model_transform);
      model_transform=Mat4.translation(17,-7,60).times(model_transform);
      if(off){
        this.shapes.torch.draw(context, program_state, model_transform,this.offscreen.override(color(0,0,2/255,1)));
      }
      else 
        this.shapes.torch.draw(context, program_state, model_transform,this.bumps);
      //torch3
      model_transform= Mat4.identity();
      model_transform=Mat4.rotation(0.2,0,0,1).times(model_transform);
       model_transform=Mat4.scale(10,11,10).times(model_transform);
      model_transform=Mat4.translation(14,-7,90).times(model_transform);
      if(off){
        this.shapes.torch.draw(context, program_state, model_transform,this.offscreen.override(color(0,0,3/255,1)));
      }
      else 
        this.shapes.torch.draw(context, program_state, model_transform,this.bumps);
      //torch4
      model_transform= Mat4.identity();
      model_transform=Mat4.rotation(0.2,0,0,1).times(model_transform);
       model_transform=Mat4.scale(10,11,10).times(model_transform);
      model_transform=Mat4.translation(14.5,-7,120).times(model_transform);
      if(off){
        this.shapes.torch.draw(context, program_state, model_transform,this.offscreen.override(color(0,0,4/255,1)));
      }
      else 
        this.shapes.torch.draw(context, program_state, model_transform,this.bumps);

      //cave
      model_transform= Mat4.identity();
      model_transform=Mat4.scale(20,20,20).times(model_transform);
      model_transform=Mat4.translation(40,0,70).times(model_transform);
      this.shapes.cave1.draw(context, program_state, model_transform,this.bumps);
      this.shapes.cave2.draw(context, program_state, model_transform,this.bumps);
      this.shapes.cave3.draw(context, program_state, model_transform,this.bumps);
      this.shapes.cave4.draw(context, program_state, model_transform,this.bumps);
      this.shapes.cave5.draw(context, program_state, model_transform,this.bumps);

      //left door
        if(this.mousepicking=="door_left" && this.is_key==true){
           
        model_transform= Mat4.identity();
        model_transform=Mat4.scale(17,20,20).times(model_transform);
        model_transform=Mat4.rotation(0.3+5*Math.PI/6,0,1,0).times(model_transform);
        model_transform=Mat4.translation(70,10.5,5).times(model_transform);
           if(off){
            this.shapes.door_left.draw(context, program_state, model_transform,this.offscreen.override(color(0,0,6/255,1)));
          }
          else
            this.shapes.door_left.draw(context, program_state, model_transform,this.bumps);
          document.exitPointerLock();  
          window.location.href='end.html';
        }
        else{
          model_transform= Mat4.identity();
          model_transform = Mat4.rotation(5*Math.PI/6,0,1,0).times(model_transform);
          model_transform=Mat4.scale(18,20,20).times(model_transform);
          model_transform=Mat4.translation(50,10.5,-9.5).times(model_transform);
          if(off){
           this.shapes.door_left.draw(context, program_state, model_transform,this.offscreen.override(color(0,0,5/255,1)));
          }
          else
           this.shapes.door_left.draw(context, program_state, model_transform,this.bumps);
        }
  
        //right door
        if(this.mousepicking=="door_right" && this.is_key==true){
           model_transform= Mat4.identity();
           model_transform=Mat4.rotation(-0.3+5*Math.PI/6,0,1,0).times(model_transform);
           model_transform=Mat4.scale(17,20,20).times(model_transform);
           model_transform=Mat4.translation(48,10.5,-33.5).times(model_transform);
           if(off){
            this.shapes.door_right.draw(context, program_state, model_transform,this.offscreen.override(color(0,0,6/255,1)));
          }
          else
            this.shapes.door_right.draw(context, program_state, model_transform,this.bumps);
          document.exitPointerLock();  
          window.location.href='end.html';
        }
        else{
          model_transform= Mat4.identity();
          model_transform = Mat4.rotation(5*Math.PI/6,0,1,0).times(model_transform);
          model_transform=Mat4.scale(18,20,20).times(model_transform);
          model_transform=Mat4.translation(50,10.5,-9.5).times(model_transform);
          if(off){
            this.shapes.door_right.draw(context, program_state, model_transform,this.offscreen.override(color(0,0,6/255,1)));
          }
          else
            this.shapes.door_right.draw(context, program_state, model_transform,this.bumps);
        }
  
       
  
        //door plane
      
        model_transform= Mat4.identity();
        model_transform = Mat4.rotation(5*Math.PI/6,0,1,0).times(model_transform);
        model_transform=Mat4.scale(18,20,20).times(model_transform);
        model_transform=Mat4.translation(165,11,-96).times(model_transform);

         
      
        this.shapes.door_plane.draw(context, program_state, model_transform,this.bumps);


        //statue
        model_transform= Mat4.identity();
        model_transform = Mat4.rotation(Math.PI/2,0,1,0).times(model_transform);
        model_transform=Mat4.scale(50,60,50).times(model_transform);
        model_transform=Mat4.translation(32,-19,10).times(model_transform);
        if(off){
            this.shapes.statue.draw(context,program_state,model_transform, this.offscreen.override(color(0,0,10/255,1)));
        }
        else
            this.shapes.statue.draw(context,program_state,model_transform, this.bumps);
        this.texture.image.src = this.scratchpad.toDataURL("image/png");

                                    // Don't call copy to GPU until the event loop has had a chance
                                    // to act on our SRC setting once:
        if( this.skipped_first_frame )
                                                     // Update the texture with the current scene:
            this.texture.copy_onto_graphics_card( context.context, false );
        this.skipped_first_frame = true;

                                   
       
        this.cube_2 = Mat4.translation( 59.5,9,2.2 ).times(Mat4.rotation(0.1-0.1*Math.random(),0,0,1)).times(Mat4.rotation(Math.PI/2+.3*Math.random(),0,1,0)).times(Mat4.scale(5,6,1));
  //  context.context.clear( context.context.COLOR_BUFFER_BIT | context.context.DEPTH_BUFFER_BIT);
        if(this.light_num[1]==1)
          this.shapes.plane.draw( context, program_state, this.cube_2, this.materials.c );

         this.cube_2 = Mat4.translation( 56.5,9,32 ).times(Mat4.rotation(.1-0.1*Math.random(),0,0,1)).times(Mat4.rotation(Math.PI/2+.3*Math.random(),0,1,0)).times(Mat4.scale(5,6,1));
  //  context.context.clear( context.context.COLOR_BUFFER_BIT | context.context.DEPTH_BUFFER_BIT);
        if(this.light_num[2]==1)
          this.shapes.plane.draw( context, program_state, this.cube_2, this.materials.c );


         this.cube_2 = Mat4.translation( 57.5,9,61.5).times(Mat4.rotation(.1-0.1*Math.random(),0,0,1)).times(Mat4.rotation(Math.PI/2+.3*Math.random(),0,1,0)).times(Mat4.scale(5,6,1));
  //  context.context.clear( context.context.COLOR_BUFFER_BIT | context.context.DEPTH_BUFFER_BIT);
        if(this.light_num[3]==1)
          this.shapes.plane.draw( context, program_state, this.cube_2, this.materials.c );
       if(!off){
         if(!key){
          model_transform= Mat4.translation(50,-14,75.2).times(Mat4.scale(3,3,1)).times(Mat4.rotation(0,0,1,0));
          this.shapes.plane.draw( context, program_state, model_transform, this.answer_photo ); 
       }
       }
       
    }
}
