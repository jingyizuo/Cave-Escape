import {tiny, defs} from './examples/common.js';
                                                  // Pull these names into this module's scope for convenience:
const { Vector, Vector3, vec, vec3, vec4, color, Matrix, Mat4, Light, Shape, Material, Shader, Texture, Scene,
        Canvas_Widget, Code_Widget, Text_Widget } = tiny;

    // Now we have loaded everything in the files tiny-graphics.js, tiny-graphics-widgets.js, and common.js.
    // This yielded "tiny", an object wrapping the stuff in the first two files, and "defs" for wrapping all the rest.

    // ******************** Extra step only for when executing on a local machine:  
    //                      Load any more files in your directory and copy them into "defs."
    //                      (On the web, a server should instead just pack all these as well 
    //                      as common.js into one file for you, such as "dependencies.js")

const Minimal_Webgl_Demo = defs.Minimal_Webgl_Demo;
import { Axes_Viewer, Axes_Viewer_Test_Scene } 
  from "./examples/axes-viewer.js"
import { Inertia_Demo, Collision_Demo }
  from "./examples/collisions-demo.js"
import { Many_Lights_Demo }
  from "./examples/many-lights-demo.js"
import { Obj_File_Demo }
  from "./examples/obj-file-demo.js"
import { Scene_To_Texture_Demo }
  from "./examples/scene-to-texture-demo.js"
import { Surfaces_Demo }
  from "./examples/surfaces-demo.js"
import { Text_Demo }
  from "./examples/text-demo.js"
import { Transforms_Sandbox }
  from "./examples/transforms-sandbox.js"
import {Shape_From_File} from "./examples/obj-file-demo";

Object.assign( defs,
                     { Axes_Viewer, Axes_Viewer_Test_Scene },
                     { Inertia_Demo, Collision_Demo },
                     { Many_Lights_Demo },
                     { Obj_File_Demo },
                     { Scene_To_Texture_Demo },
                     { Surfaces_Demo },
                     { Text_Demo },
                     { Transforms_Sandbox } );

    // ******************** End extra step

// (Can define Main_Scene's class here)



const Main_Scene = Obj_File_Demo;
const Additional_Scenes = [];

export { Main_Scene, Additional_Scenes, Canvas_Widget, Code_Widget, Text_Widget, defs }
/*
window.cave =
    class cave extends Scene
    {

        const phone_shader = new defs.Phong_Shader (2);
        constructor()
        { super();
          // Load the model file:
          this.shapes={
            'key': new Shape_From_File("asserts/key.obj"),
          }
          const phone_shader = new defs.Phong_Shader (2);
          // Don't create any DOM elements to control this scene:
          this.widget_options = { make_controls: false };
          // Non bump mapped:
          this.stars = new Material( new defs.Textured_Phong( 1 ),  { color: color( .5,.5,.5,1 ),
            ambient: .3, diffusivity: .5, specularity: .5, texture: new Texture( "assets/stars.png" ) });
          // Bump mapped:
          this.bumps = new Material( new defs.Fake_Bump_Map( 1 ), { color: color( .5,.5,.5,1 ),
            ambient: .3, diffusivity: .5, specularity: .5, texture: new Texture( "assets/stars.png" ) });
        }


        display (context, program_state )
        { const t = program_state.animation_time;

          program_state.set_camera( Mat4.translation( 0,0,-5 ) );    // Locate the camera here (inverted matrix).
          program_state.projection_transform = Mat4.perspective( Math.PI/4, context.width/context.height, 1, 500 );
          // A spinning light to show off the bump map:
          program_state.lights = [ new Light(
              Mat4.rotation( t/300,   1,0,0 ).times( vec4( 3,2,10,1 ) ),
              color( 1,.7,.7,1 ), 100000 ) ];

          for( let i of [ -1, 1 ] )
          {                                       // Spin the 3D model shapes as well.
            const model_transform = Mat4.rotation( t/2000,   0,2,1 )
                .times( Mat4.translation( 2*i, 0, 0 ) )
                .times( Mat4.rotation( t/1500,   -1,2,0 ) )
                .times( Mat4.rotation( -Math.PI/2,   1,0,0 ) );
            this.shapes.teapot.draw( context, program_state, model_transform, i == 1 ? this.stars : this.bumps );
          }
    }

 */