
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
            wall:            context.get_instance(  Texture_Rotate ).material( Color.of( 0,0,0,1 ), { ambient:0.2,diffusivity: 0,specular: 0,texture: context.get_instance("./assets/wall.jpg") } ),
            floor:            context.get_instance(  Texture_Rotate ).material( Color.of( 0,0,0,1 ), { ambient:0.2,texture: context.get_instance("./assets/wall.jpg") } ),
            door:            context.get_instance(  Texture_Rotate ).material( Color.of( 0,0,0,1 ), { ambient:0.4,texture: context.get_instance("./assets/door.jpg") } ),
            //doortext:        context.get_instance( Texture_Rotate ).material( Color.of( 0,0,0,1 ), { ambient:1,texture: context.get_instance("./assets/doortext.jpg") } )

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
        this.shapes.box.draw( graphics_state, model_transform,this.materials.wall);;
        //this.render(graphics_state, model_transform);
        model_transform = Mat4.identity();
        model_transform=Mat4.scale([0.1,8,10]).times(model_transform);
        model_transform=Mat4.translation([-10,0,0]).times(model_transform);
        this.shapes.box.draw( graphics_state, model_transform,this.materials.wall);

        //this.render(graphics_state, model_transform);

        model_transform = Mat4.identity();
        model_transform=Mat4.scale([0.1,8,10]).times(model_transform);
        model_transform=Mat4.translation([10,0,0]).times(model_transform);
        this.shapes.box.draw( graphics_state, model_transform,this.materials.wall);
        //this.render(graphics_state, model_transform);
        model_transform = Mat4.identity();
        model_transform=Mat4.scale([10,8,0.1]).times(model_transform);
        model_transform=Mat4.translation([0,0,10]).times(model_transform);
      this.shapes.box.draw( graphics_state, model_transform,this.materials.wall);

        model_transform = Mat4.identity();
        model_transform=Mat4.scale([10,0.1,10]).times(model_transform);
        model_transform=Mat4.translation([0,-8,0]).times(model_transform);
        this.shapes.box.draw( graphics_state, model_transform,this.materials.floor);

        model_transform= Mat4.identity();
        model_transform=Mat4.scale([3,4,0.1]).times(model_transform);
        model_transform=Mat4.translation([0,-4,-9.9]).times(model_transform);
        if(this.mousepicking){
          this.shapes.box.draw( graphics_state, model_transform,this.materials.door);
        }
        else
          this.shapes.box.draw( graphics_state, model_transform, this.materials.door);

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
class Texture_Rotate extends Phong_Shader
{

  fragment_glsl_code()           // ********* FRAGMENT SHADER *********
    {


      // TODO:  Modify the shader below (right now it's just the same fragment shader as Phong_Shader) for requirement #7.
      return `
        uniform sampler2D diff;
        uniform sampler2D texture;
        #extension GL_OES_standard_derivatives : enable
        void main()
        { if( GOURAUD || COLOR_NORMALS )    // Do smooth "Phong" shading unless options like "Gouraud mode" are wanted instead.
          { gl_FragColor = VERTEX_COLOR;    // Otherwise, we already have final colors to smear (interpolate) across vertices.
            return;
          }                                 // If we get this far, calculate Smooth "Phong" Shading as opposed to Gouraud Shading.
                                            // Phong shading is not to be confused with the Phong Reflection Model.
        //  mat4 mMatrix = mat4(cos(mod(1.571*animation_time,120.)),sin(mod(1.571*animation_time,120.)),0.,0.,-sin(mod(1.571*animation_time,120.)),cos(mod(1.571*animation_time,120.)),0.,0.,0.,0.,1.,0.,0.,0.,0.,1.);
          vec2 mVector = f_tex_coord;
          vec4 nVector = vec4(mVector,0.,0.);

          vec2 dSTdx = dFdx( f_tex_coord );
          vec2 dSTdy = dFdy( f_tex_coord  );
          float Hll = texture2D( texture,nVector.xy).x;
          float dBx = texture2D( texture,nVector.xy + dSTdx ).x - Hll;
          float dBy = texture2D( texture, nVector.xy+ dSTdy ).x - Hll;
          vec2 dHdxy_fwd=vec2( dBx, dBy );
          vec3 surf_norm=N;

          vec3 vSigmaX = vec3( dFdx( -surf_pos.x ), dFdx( -surf_pos.y ), dFdx( -surf_pos.z ) );
          vec3 vSigmaY = vec3( dFdy( -surf_pos.x ), dFdy( -surf_pos.y ), dFdy( -surf_pos.z ) );
          vec3 vN = surf_norm;
          vec3 R1 = cross( vSigmaY, vN );
          vec3 R2 = cross( vN, vSigmaX );
          float fDet = dot( vSigmaX, R1 );
          fDet *= ( float( gl_FrontFacing ) * 2.0 - 1.0 );
          vec3 vGrad = sign( fDet ) * ( dHdxy_fwd.x * R1 + dHdxy_fwd.y * R2 );

          vec3 normal1=normalize( abs( fDet ) * surf_norm - vGrad );
          vec4 tex_color = texture2D( diff, nVector.xy );                         // Sample the texture image in the correct place.
                                                                                     // Compute an initial (ambient) color:

          if( USE_TEXTURE ) {
             gl_FragColor = vec4( ( tex_color.xyz + shapeColor.xyz ) * ambient, shapeColor.w * tex_color.w );
            gl_FragColor.xyz += phong_model_lights( normal1+vec3(0.5,0.5,0.5));

          }
          else gl_FragColor = vec4( shapeColor.xyz * ambient, shapeColor.w );
          gl_FragColor.xyz += phong_model_lights( normal1+vec3(0.5,0.5,0.5));                     // Compute the final color with contributions from lights.
          //  gl_FragColor = vec4(( tex_color.xyz + shapeColor.xyz ) * ambient+ diffusivity+specularity, diffuseColor.a);
        }`;
    }
}
