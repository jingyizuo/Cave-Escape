import { tiny, defs } from './bootstrap.js';

const { vec, vec3, vec4, Mat4, Scene } = tiny;

const Movement_Controls = defs.Movement_Controls =
class Movement_Controls extends Scene
{                                       // **Movement_Controls** is a Scene that can be attached to a canvas, like any other
                                        // Scene, but it is a Secondary Scene Component -- meant to stack alongside other 
                                        // scenes.  Rather than drawing anything it embeds both first-person and third-
                                        // person style controls into the website.  These can be used to manually move your
                                        // camera or other objects smoothly through your scene using key, mouse, and HTML
                                        // button controls to help you explore what's in it.
  constructor()
    { super();
      const data_members = { roll: 0, look_around_locked: true, 
                             thrust: vec3( 0,0,0 ), pos: vec3( 0,0,0 ), z_axis: vec3( 0,0,0 ),
                             radians_per_frame: 1/200, meters_per_frame: 20, speed_multiplier: 1 };
      Object.assign( this, data_members );
      this.r=vec(0,0);
      this.rx=0;
      this.ty=0;
      this.ang=0;
      this.mouse_enabled_canvases = new Set();
      this.will_take_over_graphics_state = true;
    }
  set_recipient( matrix_closure, inverse_closure )
    {                               // set_recipient(): The camera matrix is not actually stored here inside Movement_Controls;
                                    // instead, track an external target matrix to modify.  Targets must be pointer references
                                    // made using closures.
      this.matrix  =  matrix_closure;
      this.inverse = inverse_closure;
    }
  reset( graphics_state )
    {                         // reset(): Initially, the default target is the camera matrix that Shaders use, stored in the
                              // encountered program_state object.  Targets must be pointer references made using closures.
      this.set_recipient( () => graphics_state.camera_transform, 
                          () => graphics_state.camera_inverse   );
    }
  add_mouse_controls( canvas )
    {                                       // add_mouse_controls():  Attach HTML mouse events to the drawing canvas.
                                            // First, measure mouse steering, for rotating the flyaround camera:
      this.mouse = { "from_center": vec( 0,0 ) };
      const mouse_position = ( e, rect = canvas.getBoundingClientRect() ) => 
                                   vec( e.clientX - (rect.left + rect.right)/2, e.clientY - (rect.bottom + rect.top)/2 );
                                // Set up mouse response.  The last one stops us from reacting if the mouse leaves the canvas:
      document.addEventListener( "mouseup",   e => { this.mouse.anchor = undefined; } );
      document  .addEventListener( "mousedown", e => { 
        e.preventDefault(); //this.mouse.anchor      = mouse_position(e);
        canvas.requestPointerLock();
      } );
      canvas  .addEventListener( "mousemove", e => { 
        //e.preventDefault(); this.mouse.from_center = mouse_position(e); 
        if(document.pointerLockElement)
        {

          this.r[0]=e.movementX/200;
          this.r[1]=-(e.movementY/200);
          this.rx+=e.movementX/200;
          this.ry-=e.movementY/200;
        }
      } );
      canvas  .addEventListener( "mouseout",  e => { if( !this.mouse.anchor ) this.mouse.from_center.scale_by(0) } );
      document.addEventListener( "keydown",  e => { 
          var code = e.keyCode;
            switch(code) {
            case 87:
                this.thrust[2] =  1;
                break;
            case 83:
                this.thrust[2] = -1;
                break;
            case 65:
                this.thrust[0] =  1;
                break;
            case 68:
                this.thrust[0] = -1;
                break;
            default:
        }

      } );
      document.addEventListener( "keyup", e =>{
            this.thrust[0]=0;
            this.thrust[2]=0;} );
    }
  show_explanation( document_element ) { }
  make_control_panel()
    {                                 // make_control_panel(): Sets up a panel of interactive HTML elements, including
                                      // buttons with key bindings for affecting this scene, and live info readouts    
      this.key_triggered_button( "Forward",[ "w" ], () => this.thrust[2] =  1, undefined, () => this.thrust[2] = 0 );
      this.key_triggered_button( "Left",   [ "a" ], () => this.thrust[0] =  1, undefined, () => this.thrust[0] = 0 );
      this.key_triggered_button( "Back",   [ "s" ], () => this.thrust[2] = -1, undefined, () => this.thrust[2] = 0 );
      this.key_triggered_button( "Right",  [ "d" ], () => this.thrust[0] = -1, undefined, () => this.thrust[0] = 0 );
      this.new_line();
   
    }
  
  first_person_flyaround( radians_per_frame, meters_per_frame, leeway = 70 )
    {                                                     // (Internal helper function)
                                                          // Compare mouse's location to all four corners of a dead box:
      const offsets_from_dead_box = { plus: [ this.mouse.from_center[0] + leeway, this.mouse.from_center[1] + leeway ],
                                     minus: [ this.mouse.from_center[0] - leeway, this.mouse.from_center[1] - leeway ] }; 
                                                          // Apply a camera rotation movement, but only when the mouse is
                                                          // past a minimum distance (leeway) from the canvas's center:
      if( !this.look_around_locked )
                                              // If steering, steer according to "mouse_from_center" vector, but don't
                                              // start increasing until outside a leeway window from the center.                                          
        for( let i = 0; i < 2; i++ )
        {                                     // The &&'s in the next line might zero the vectors out:
          let o = offsets_from_dead_box,
            velocity = ( ( o.minus[i] > 0 && o.minus[i] ) || ( o.plus[i] < 0 && o.plus[i] ) ) * radians_per_frame;
                                              // On X step, rotate around Y axis, and vice versa.
          this.matrix().post_multiply( Mat4.rotation( -velocity,   i, 1-i, 0 ) );
          this.inverse().pre_multiply( Mat4.rotation( +velocity,   i, 1-i, 0 ) );
        }
      if(this.r[0]!=0 && this.r[1]!=0){
        var eye=this.pos;
        var rx=this.r[0];
        var ry=this.r[1];
        var mx=this.pos[0];
        var my=this.pos[1];
        var mz=this.pos[2];
        var F=vec3(Math.sin(rx)*Math.cos(ry), Math.sin(ry), -Math.cos(rx) * Math.cos(ry)).normalized();
        var at=vec3(F[0]+mx,F[1]+my,F[2]+mz);
        var angle=getAngle(vec(0,-1), vec(F[0], F[2]) );
        var angle2=getAngle(vec(0,-1),vec(F[1],-Math.sqrt(F[0]*F[0]+F[2]*F[2])));
        var R = vec3(Math.cos(angle), 0, Math.sin(angle));
        var up=R.cross(F);
        var z=vec3(at[0]-eye[0],at[1]-eye[1],at[2]-eye[2]);
        var x=z.cross(up).normalized();
        var y=x.cross(z).normalized();
        this.ang-=angle2;
        if(this.ang >= Math.PI/3) {
          angle2=this.ang+angle2-Math.PI/3;
          this.ang = Math.PI/3;
          //angle2=0;
        }
        else if(this.ang <= -Math.PI/3) {
          angle2=this.ang+angle2+Math.PI/3;
          this.ang = -Math.PI/3;
        }
        this.matrix().post_multiply( Mat4.rotation( +angle2,   1,0,0 ) );
        this.inverse().pre_multiply( Mat4.rotation( -angle2,   1,0,0 ) );

        this.matrix().post_multiply( Mat4.rotation( +this.ang,   1,0,0 ) );
        this.inverse().pre_multiply( Mat4.rotation( -this.ang,   1,0,0 ) );

        this.matrix().post_multiply( Mat4.rotation( -angle,   0,1,0 ) );
        this.inverse().pre_multiply( Mat4.rotation( +angle,   0,1,0 ) );

        this.matrix().post_multiply( Mat4.rotation( -this.ang,   1,0,0 ) );
        this.inverse().pre_multiply( Mat4.rotation( +this.ang,   1,0,0 ) );
        this.r[0]=0;
        this.r[1]=0;

      }
      //this.matrix().post_multiply( Mat4.rotation( -.1 * this.roll,   0,0,1 ) );
      //this.inverse().pre_multiply( Mat4.rotation( +.1 * this.roll,   0,0,1 ) );
                                    // Now apply translation movement of the camera, in the newest local coordinate frame.
      this.matrix().post_multiply( Mat4.rotation( +this.ang,   1,0,0 ) );
      this.inverse().pre_multiply( Mat4.rotation( -this.ang,   1,0,0 ) );
      this.matrix().post_multiply( Mat4.translation( ...this.thrust.times( -meters_per_frame ) ) );
      this.inverse().pre_multiply( Mat4.translation( ...this.thrust.times( +meters_per_frame ) ) );
      this.matrix().post_multiply( Mat4.rotation( -this.ang,   1,0,0 ) );
      this.inverse().pre_multiply( Mat4.rotation( +this.ang,   1,0,0 ) );
    }

  third_person_arcball( radians_per_frame )
    {                                           // (Internal helper function)
                                                // Spin the scene around a point on an axis determined by user mouse drag:
      const dragging_vector = this.mouse.from_center.minus( this.mouse.anchor );
      if( dragging_vector.norm() <= 0 )
        return;
      this.matrix().post_multiply( Mat4.translation( 0,0, -25 ) );
      this.inverse().pre_multiply( Mat4.translation( 0,0, +25 ) );

      const rotation = Mat4.rotation( radians_per_frame * dragging_vector.norm(), 
                                                  dragging_vector[1], dragging_vector[0], 0 );
      this.matrix().post_multiply( rotation );
      this.inverse().pre_multiply( rotation );

      this. matrix().post_multiply( Mat4.translation( 0,0, +25 ) );
      this.inverse().pre_multiply(  Mat4.translation( 0,0, -25 ) );
    }
  display( context, graphics_state,off,pix, dt = graphics_state.animation_delta_time / 1000 )
    {                                                            // The whole process of acting upon controls begins here.
      const m = this.speed_multiplier * this. meters_per_frame,
            r = this.speed_multiplier * this.radians_per_frame;

      if( this.will_take_over_graphics_state )
      { this.reset( graphics_state );
        this.will_take_over_graphics_state = false;
      }

      if( !this.mouse_enabled_canvases.has( context.canvas ) )
      { this.add_mouse_controls( context.canvas );
        this.mouse_enabled_canvases.add( context.canvas )
      }
                                     // Move in first-person.  Scale the normal camera aiming speed by dt for smoothness:
      this.first_person_flyaround( dt * r, dt * m );
                                     // Also apply third-person "arcball" camera mode if a mouse drag is occurring:
      if( this.mouse.anchor )
        this.third_person_arcball( dt * r );           
                                     // Log some values:
      this.pos    = this.inverse().times( vec4( 0,0,0,1 ) );
      this.z_axis = this.inverse().times( vec4( 0,0,1,0 ) );
    }
}



const Program_State_Viewer = defs.Program_State_Viewer =
class Program_State_Viewer extends Scene
{                                             // **Program_State_Viewer** just toggles, monitors, and reports some
                                              // global values via its control panel.
  make_control_panel()
    {                         // display() of this scene will replace the following object:  
    }
  display( context, program_state )
    { this.program_state = program_state;      
    }
}
