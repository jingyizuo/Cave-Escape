
window.Assignment_Four_Scene = window.classes.Assignment_Four_Scene =
class Assignment_Four_Scene extends Scene_Component
  { constructor( context, control_box )     // The scene begins by requesting the camera, shapes, and materials it will need.
      { super(   context, control_box );    // First, include a secondary Scene that provides movement controls:
        [ this.context,this.gl,this.framebuffer,this.pixels,this.mousspicking] = [ context,null,null,Vec.of(1,0,0,0),null ];                  // Data members
        if( !context.globals.has_controls   )
          context.register_scene_component( new Movement_Controls( context, control_box.parentElement.insertCell() ) );
          var canvas = document.getElementsByTagName("canvas")[1];
          this.gl = context.canvas.getContext("webgl")||context.canvas.getContext("experimental-webgl");
          this.gl.getExtension('OES_standard_derivatives');
          this.gl.getExtension('OES_texture_float');
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
        this.door=[];
        this.door.push(context.get_instance("./assets/door.jpg"));
        this.door.push(context.get_instance("./assets/doortext.jpg"));
        //this.door_shader=context.get_instance(Fake_Bump_Map).material(Color.of( 0,0,0,1 ), { ambient:1,texture: context.get_instance("./assets/doortext.jpg") })
        this.materials =
          { sun_material:     context.get_instance( Phong_Shader ).material( Color.of( 1,1,1,1 ), { ambient:1 } ),
            p1_material:     context.get_instance( Phong_Shader ).material( Color.of( 0.72, 0.74, 0.9,1 ), { diffusivity: 1} ),
            p2_material:     context.get_instance( Phong_Shader ).material( Color.of( 0.1,0.5,0.48,1 ), { diffusivity: .3 ,specular: 1} ),
            p3_material:     context.get_instance( Phong_Shader ).material( Color.of( 0.9,0.5,0.39,1 ), { diffusivity: 1 ,specular: 1 } ),
            p4_material:     context.get_instance( Phong_Shader ).material( Color.of( 0.1,0.1,0.9,1 ), { specular: 0.8 } ),
            p5_material:     context.get_instance( Phong_Shader ).material( Color.of( 0.74,0.7,0.76,1 ), { diffusivity: 1 ,specular: 1 } ),
            door:            context.get_instance( Phong_Shader ).material( Color.of( 0,0,0,1 ), { ambient:1,texture: context.get_instance("./assets/door.jpg") } ),
            doortext:        context.get_instance( Phong_Shader ).material( Color.of( 0,0,0,1 ), { ambient:1,texture: context.get_instance("./assets/doortext.jpg") } )

                                // TODO:  Fill in as many additional material objects as needed in this key/value table.
                                //        (Requirement 1)
          }

      }
    make_control_panel()
      { // TODO:  Implement requirement #5 using a key_triggered_button that responds to the 'c' key.
      this.live_string( box => box.textContent = this.pixels);
      this.new_line();
      this.live_string( box => box.textContent = this.mousepicking);
      this.new_line();
      }
    display( graphics_state )
      { const t = graphics_state.animation_time / 1000, dt = graphics_state.animation_delta_time / 1000;
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

        model_transform= Mat4.identity();
        model_transform=Mat4.scale([3,4,0.1]).times(model_transform);
        model_transform=Mat4.translation([0,-4,-9.9]).times(model_transform);
        if(this.mousepicking){
          this.shapes.box.draw( graphics_state, model_transform,this.materials.doortext);
        }
        else
          this.shapes.box.draw( graphics_state, model_transform, this.materials.doortext);

        model_transform = Mat4.scale([0.2,0.5,0.2]);
        //model_transform = Mat4.translation([2,-3,2]).times(model_transform);
        //model_transform=Mat4.inverse(graphics_state.camera_transform).times(model_transform);
        //model_transform = Mat4.translation([2,-3,2]).times(model_transform);
        //this.shapes.box.draw( graphics_state, model_transform,this.plastic.override({ color: Color.of(1,0,1,1) }));
        model_transform = Mat4.identity();
        this.shapes.planet_1.draw( graphics_state, model_transform,this.plastic.override({ color: Color.of(1,1,1,1) }));
      }
  }
  // u_normMap,  texture
  //v_texcoord  nVector.xy
