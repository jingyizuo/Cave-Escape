import { tiny, defs } from '../../lib/common.js';
import { state as game, randomInt } from './game-input.js';
import { tempAlert } from '../game-ui.js';
import { FIRE_LOOP_EMBED_URL, PickId } from './constants.js';
import { buildCaveShapes, scaleCaveTextureCoords } from './build-cave-shapes.js';

const { vec4, color, Mat4, Light, Texture, Scene, Material } = tiny;
const { Shape_From_File } = defs;

export class CaveSceneBase extends Scene {
  constructor() {
    super();
    this.hover = this.swarm = false;
    this.gl = null;
    this.off = null;
    this.mousepicking = null;
    this.framebuffer = null;
    this.box = true;
    this.light = false;
    this.light_num = [ 0, 0, 0, 0 ];
    this.gun = false;
    this.shoot = false;
    this.is_key = false;
    this.sound = false;
    this.light_pos = [ vec4( 0, 0, 0, 1 ), vec4( 0, 0, 0, 1 ), vec4( 0, 0, 0, 1 ), vec4( 0, 0, 0, 1 ) ];
    this.pixels = vec4( 1, 0, 0, 0 );

    this.shapes = buildCaveShapes( defs, Shape_From_File );
    scaleCaveTextureCoords( this.shapes );

    this.scratchpad = document.getElementById( "surface" );
    this.scratchpad_context = this.scratchpad.getContext( "2d" );
    this.scratchpad.width = 256;
    this.scratchpad.height = 256;
    this.texture = new Texture( "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7" );

    const bump = new defs.Fake_Bump_Map();
    const phong = new defs.Phong_Shader();
    const off_shader = new defs.Offscreen_Shader( 2 );
    this.materials = {
      plastic: new Material( phong, { ambient: 0.3, diffusivity: 1, specularity: 0.5, color: color( 0.9, 0.5, 0.9, 1 ) } ),
      metal: new Material( phong, { ambient: 0.2, diffusivity: 1, specularity: 1, color: color( 0.9, 0.5, 0.9, 1 ) } ),
      a: new Material( bump, { ambient: 1 } ),
      c: new Material( bump, { ambient: 1, texture: this.texture } ),
    };

    this.bumps = new Material( new defs.Fake_Bump_Map(), {
      color: color( 0.5, 0.5, 0.5, 1 ),
      ambient: 0.1, diffusivity: 0.7, specularity: 0.7,
      texture: new Texture( "assets/textures/cave.png" ),
    } );
    this.wood = new Material( bump, {
      color: color( 0.5, 0.5, 0.5, 1 ),
      ambient: 0.1, diffusivity: 0.7, specularity: 0.7,
      texture: new Texture( "assets/textures/keybox.png" ),
    } );
    this._bumpsTemplate = this.bumps;
    this._woodTemplate = this.wood;
    this._ambientTorchKey = -1;
    this._gameEnded = false;
    this._fireTexTick = 0;
    this._fireAudioEl = document.getElementById( "fire_audio" );
    this.offscreen = new Material( off_shader, { ambient: 1, color: color( 0, 1, 1, 1 ) } );

    const answer_set_str = [ "011", "101", "110" ];
    const answer_set = [ [ 0, 1, 1 ], [ 1, 0, 1 ], [ 1, 1, 0 ] ];
    const key_num = randomInt( 3 );
    this.answer_str = answer_set_str[ key_num ];
    this.answer = answer_set[ key_num ];
    this.answer_photo = new Material( new defs.Textured_Phong(), {
      color: color( 0.5, 0.5, 0.5, 1 ),
      ambient: 0.1, diffusivity: 0.7, specularity: 0.7,
      texture: new Texture( "assets/textures/answers/answer" + this.answer_str + ".png" ),
    } );

    document.addEventListener( "mouseup", () => {
      const r = this.pixels[ 0 ];
      const g = this.pixels[ 1 ];
      const b = this.pixels[ 2 ];
      if ( r === 0 && g === 0 ) {
        switch ( b ) {
          case PickId.TORCH_1:
            this.mousepicking = "torch1";
            this.light = true;
            if ( !this.gun ) this.light_num[ 0 ] = ( this.light_num[ 0 ] + 1 ) % 2;
            break;
          case PickId.TORCH_2:
            this.mousepicking = "torch2";
            this.light = true;
            if ( !this.gun ) this.light_num[ 1 ] = ( this.light_num[ 1 ] + 1 ) % 2;
            break;
          case PickId.TORCH_3:
            this.mousepicking = "torch3";
            this.light = true;
            if ( !this.gun ) this.light_num[ 2 ] = ( this.light_num[ 2 ] + 1 ) % 2;
            break;
          case PickId.TORCH_4:
            this.mousepicking = "torch4";
            this.light = true;
            if ( !this.gun ) this.light_num[ 3 ] = ( this.light_num[ 3 ] + 1 ) % 2;
            break;
          case PickId.DOOR_LEFT:
            this.mousepicking = "door_left";
            break;
          case PickId.DOOR_RIGHT:
            this.mousepicking = "door_right";
            break;
          case PickId.KEYBOX:
            this.mousepicking = "keybox";
            if ( this.gun ) {
              game.last_fire = true;
              game.key = true;
              this.shoot = true;
              this.gun = false;
              this.box = false;
            }
            break;
          case PickId.KEY:
            this.mousepicking = "key";
            this.is_key = true;
            break;
          case PickId.GUN:
            this.mousepicking = "gun";
            this.gun = true;
            game.first_fire = true;
            break;
          case PickId.STATUE:
            this.mousepicking = "statue";
            break;
          default:
            this.mousepicking = null;
        }
        if ( b === PickId.KEYBOX && this.gun === false && game.last_fire !== true )
          tempAlert( " This BOX is LOCKED... ", 1000 );
        if ( ( b === PickId.DOOR_LEFT || b === PickId.DOOR_RIGHT ) && this.is_key === false )
          tempAlert( "This DOOR is LOCKED...", 1000 );
        if ( b >= PickId.TORCH_1 && b <= PickId.TORCH_4 && this.gun === false )
          tempAlert( "TORCH", 800 );
        if ( b === PickId.GUN )
          tempAlert( "GUN", 800 );
        if ( b === PickId.KEY )
          tempAlert( "KEY", 800 );
        if ( b === PickId.STATUE && this.gun === false )
          tempAlert( "STATUE...Nothing Special", 800 );
      } else {
        this.mousepicking = null;
      }

      const fireOn = this.light_num[ 0 ] + this.light_num[ 1 ] + this.light_num[ 2 ] + this.light_num[ 3 ] !== 0;
      const fa = this._fireAudioEl;
      if ( fireOn && this.sound === false && fa ) {
        fa.src = FIRE_LOOP_EMBED_URL;
        this.sound = true;
      } else if ( fireOn && this.sound === true ) {
        /* keep playing */
      } else if ( fa ) {
        fa.src = "";
        this.sound = false;
      }
    } );
  }

  make_control_panel() {}

  show_explanation() {}

  display( context, program_state, off, pixels ) {
    this.pixels = pixels;
    if ( !context.scratchpad.controls ) {
      this.children.push( context.scratchpad.controls = new defs.Movement_Controls() );
      program_state.set_camera( Mat4.translation( -42, 3, -85 ) );
    }

    program_state.projection_transform = Mat4.perspective( Math.PI / 4, context.width / context.height, 1, 10000 );

    const t = this.t = program_state.animation_time / 1000;
    this.num = this.light_num[ 0 ] + this.light_num[ 1 ] + this.light_num[ 2 ] + this.light_num[ 3 ];
    if ( this.num !== 0 ) {
      const flicker = 0.5 + 0.5 * Math.sin( t * 17.3 );
      program_state.lights = [ new Light(
        program_state.camera_transform.times( vec4( -0.1, 1 + 0.1 * flicker, 1, 0 ) ),
        color( 1, 0.2 + 0.1 * Math.sin( t * 23.1 ), 0, 1 ),
        3 * this.num,
      ) ];
    } else {
      program_state.lights = [ new Light(
        program_state.camera_transform.times( vec4( 0, -1, 1, 0 ) ),
        color( 1, 1, 1, 1 ),
        0.3,
      ) ];
    }
  }
}
