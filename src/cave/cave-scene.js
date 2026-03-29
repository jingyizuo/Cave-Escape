import { tiny } from '../../lib/common.js';
import { state as game } from './game-input.js';
import { CaveSceneBase } from './cave-scene-base.js';

const { color, Mat4 } = tiny;

export class CaveScene extends CaveSceneBase {
  display( context, program_state, off, pixels ) {
    super.display( context, program_state, off, pixels );

    let model_transform = Mat4.identity();
    const torchKey = Math.min( this.num, 4 );
    if ( this._ambientTorchKey !== torchKey ) {
      const amb = [ 0.02, 0.05, 0.07, 0.09, 0.10 ][ torchKey ];
      this.bumps = this._bumpsTemplate.override( { ambient: amb } );
      this.wood = this._woodTemplate.override( { ambient: amb } );
      this._ambientTorchKey = torchKey;
    }

    model_transform = Mat4.translation( 34, -2.7, 11 ).times( Mat4.scale( 0.3, 0.3, 0.3 ) ).times( Mat4.rotation( 0, 0, 0, 1 ) );
    if ( this.light_num[ 3 ] === this.answer[ 0 ] && this.light_num[ 2 ] === this.answer[ 1 ] && this.light_num[ 1 ] === this.answer[ 2 ] ) {
      if ( !this.gun && this.shoot === false ) {
        if ( off ) {
          this.shapes.gun_black.draw( context, program_state, model_transform, this.offscreen.override( color( 0, 0, 9 / 255, 1 ) ) );
          this.shapes.gun_silver.draw( context, program_state, model_transform, this.offscreen.override( color( 0, 0, 9 / 255, 1 ) ) );
        } else {
          this.shapes.gun_black.draw( context, program_state, model_transform, this.materials.plastic.override( color( 0.1, 0.1, 0.1, 1 ) ) );
          this.shapes.gun_silver.draw( context, program_state, model_transform, this.materials.metal.override( color( 0.75, 0.75, 0.75, 1 ) ) );
        }
      } else if ( !this.shoot ) {
        model_transform = program_state.camera_transform.times( Mat4.translation( 1, -2, -3 ) ).times( Mat4.scale( 0.2, 0.2, -0.2 ) );
        this.shapes.gun_black.draw( context, program_state, model_transform, this.materials.plastic.override( color( 0.1, 0.1, 0.1, 1 ) ) );
        this.shapes.gun_silver.draw( context, program_state, model_transform, this.materials.metal.override( color( 0.75, 0.75, 0.75, 1 ) ) );
      }
    }

    model_transform = Mat4.translation( 50, -14, 78 ).times( Mat4.scale( 3, 3, 3 ) );
    if ( this.box ) {
      if ( off )
        this.shapes.box_unopened.draw( context, program_state, model_transform, this.offscreen.override( color( 0, 0, 7 / 255, 1 ) ) );
      else
        this.shapes.box_unopened.draw( context, program_state, model_transform, this.wood.override( color( 0.75, 0.5, 0.3, 1 ) ) );
    } else {
      model_transform = model_transform.times( Mat4.rotation( Math.PI / 2, 0, 1, 0 ) );
      this.shapes.box_bottom.draw( context, program_state, model_transform, this.wood.override( color( 0.75, 0.5, 0.3, 1 ) ) );
      model_transform = model_transform.times( Mat4.translation( 0.4, -1, 0.4 ) ).times( Mat4.rotation( Math.PI / 2, 1, 0, 0 ) ).times( Mat4.scale( 1.5, 1.5, 1.5 ) );
      if ( !this.is_key ) {
        if ( off )
          this.shapes.key.draw( context, program_state, model_transform, this.offscreen.override( color( 0, 0, 8 / 255, 1 ) ) );
        else
          this.shapes.key.draw( context, program_state, model_transform, this.materials.metal.override( color( 0.5, 0.5, 0.1, 1 ) ) );
      }
    }

    if ( this.is_key ) {
      model_transform = program_state.camera_transform.times( Mat4.translation( 6, -3, -25 ) ).times( Mat4.scale( 10, 10, 10 ) ).times( Mat4.rotation( Math.PI / 2, 0, 1, 0 ) );
      this.shapes.key.draw( context, program_state, model_transform, this.materials.metal.override( color( 0.5, 0.5, 0.1, 1 ) ) );
    }

    model_transform = Mat4.identity();
    model_transform = Mat4.rotation( 0.2, 0, 0, 1 ).times( model_transform );
    model_transform = Mat4.scale( 10, 11, 10 ).times( model_transform );
    model_transform = Mat4.translation( 17, -7, 60 ).times( model_transform );
    if ( off )
      this.shapes.torch.draw( context, program_state, model_transform, this.offscreen.override( color( 0, 0, 2 / 255, 1 ) ) );
    else
      this.shapes.torch.draw( context, program_state, model_transform, this.bumps );

    model_transform = Mat4.identity();
    model_transform = Mat4.rotation( 0.2, 0, 0, 1 ).times( model_transform );
    model_transform = Mat4.scale( 10, 11, 10 ).times( model_transform );
    model_transform = Mat4.translation( 14, -7, 90 ).times( model_transform );
    if ( off )
      this.shapes.torch.draw( context, program_state, model_transform, this.offscreen.override( color( 0, 0, 3 / 255, 1 ) ) );
    else
      this.shapes.torch.draw( context, program_state, model_transform, this.bumps );

    model_transform = Mat4.identity();
    model_transform = Mat4.rotation( 0.2, 0, 0, 1 ).times( model_transform );
    model_transform = Mat4.scale( 10, 11, 10 ).times( model_transform );
    model_transform = Mat4.translation( 14.5, -7, 120 ).times( model_transform );
    if ( off )
      this.shapes.torch.draw( context, program_state, model_transform, this.offscreen.override( color( 0, 0, 4 / 255, 1 ) ) );
    else
      this.shapes.torch.draw( context, program_state, model_transform, this.bumps );

    model_transform = Mat4.identity();
    model_transform = Mat4.scale( 20, 20, 20 ).times( model_transform );
    model_transform = Mat4.translation( 40, 0, 70 ).times( model_transform );
    this.shapes.cave1.draw( context, program_state, model_transform, this.bumps );
    this.shapes.cave2.draw( context, program_state, model_transform, this.bumps );
    this.shapes.cave3.draw( context, program_state, model_transform, this.bumps );
    this.shapes.cave4.draw( context, program_state, model_transform, this.bumps );
    this.shapes.cave5.draw( context, program_state, model_transform, this.bumps );

    if ( this.mousepicking === "door_left" && this.is_key === true ) {
      model_transform = Mat4.identity();
      model_transform = Mat4.scale( 17, 20, 20 ).times( model_transform );
      model_transform = Mat4.rotation( 0.3 + 5 * Math.PI / 6, 0, 1, 0 ).times( model_transform );
      model_transform = Mat4.translation( 70, 10.5, 5 ).times( model_transform );
      if ( off )
        this.shapes.door_left.draw( context, program_state, model_transform, this.offscreen.override( color( 0, 0, 6 / 255, 1 ) ) );
      else
        this.shapes.door_left.draw( context, program_state, model_transform, this.bumps );
      if ( !this._gameEnded ) {
        this._gameEnded = true;
        document.exitPointerLock();
        window.location.href = "end.html";
      }
    } else {
      model_transform = Mat4.identity();
      model_transform = Mat4.rotation( 5 * Math.PI / 6, 0, 1, 0 ).times( model_transform );
      model_transform = Mat4.scale( 18, 20, 20 ).times( model_transform );
      model_transform = Mat4.translation( 50, 10.5, -9.5 ).times( model_transform );
      if ( off )
        this.shapes.door_left.draw( context, program_state, model_transform, this.offscreen.override( color( 0, 0, 5 / 255, 1 ) ) );
      else
        this.shapes.door_left.draw( context, program_state, model_transform, this.bumps );
    }

    if ( this.mousepicking === "door_right" && this.is_key === true ) {
      model_transform = Mat4.identity();
      model_transform = Mat4.rotation( -0.3 + 5 * Math.PI / 6, 0, 1, 0 ).times( model_transform );
      model_transform = Mat4.scale( 17, 20, 20 ).times( model_transform );
      model_transform = Mat4.translation( 48, 10.5, -33.5 ).times( model_transform );
      if ( off )
        this.shapes.door_right.draw( context, program_state, model_transform, this.offscreen.override( color( 0, 0, 6 / 255, 1 ) ) );
      else
        this.shapes.door_right.draw( context, program_state, model_transform, this.bumps );
      if ( !this._gameEnded ) {
        this._gameEnded = true;
        document.exitPointerLock();
        window.location.href = "end.html";
      }
    } else {
      model_transform = Mat4.identity();
      model_transform = Mat4.rotation( 5 * Math.PI / 6, 0, 1, 0 ).times( model_transform );
      model_transform = Mat4.scale( 18, 20, 20 ).times( model_transform );
      model_transform = Mat4.translation( 50, 10.5, -9.5 ).times( model_transform );
      if ( off )
        this.shapes.door_right.draw( context, program_state, model_transform, this.offscreen.override( color( 0, 0, 6 / 255, 1 ) ) );
      else
        this.shapes.door_right.draw( context, program_state, model_transform, this.bumps );
    }

    model_transform = Mat4.identity();
    model_transform = Mat4.rotation( 5 * Math.PI / 6, 0, 1, 0 ).times( model_transform );
    model_transform = Mat4.scale( 18, 20, 20 ).times( model_transform );
    model_transform = Mat4.translation( 165, 11, -96 ).times( model_transform );
    this.shapes.door_plane.draw( context, program_state, model_transform, this.bumps );

    model_transform = Mat4.identity();
    model_transform = Mat4.rotation( Math.PI / 2, 0, 1, 0 ).times( model_transform );
    model_transform = Mat4.scale( 50, 60, 50 ).times( model_transform );
    model_transform = Mat4.translation( 32, -19, 10 ).times( model_transform );
    if ( off )
      this.shapes.statue.draw( context, program_state, model_transform, this.offscreen.override( color( 0, 0, 10 / 255, 1 ) ) );
    else
      this.shapes.statue.draw( context, program_state, model_transform, this.bumps );

    if ( !off && ( ++this._fireTexTick % 2 === 0 ) )
      this.texture.image.src = this.scratchpad.toDataURL( "image/png" );
    if ( this.skipped_first_frame && !off && ( this._fireTexTick % 2 === 0 ) )
      this.texture.copy_onto_graphics_card( context.context, false );
    this.skipped_first_frame = true;

    const ta = this.t;
    this.cube_2 = Mat4.translation( 59.5, 9, 2.2 ).times( Mat4.rotation( 0.1 - 0.1 * Math.sin( ta * 11.7 ), 0, 0, 1 ) ).times( Mat4.rotation( Math.PI / 2 + 0.3 * Math.sin( ta * 9.2 ), 0, 1, 0 ) ).times( Mat4.scale( 5, 6, 1 ) );
    if ( this.light_num[ 1 ] === 1 )
      this.shapes.plane.draw( context, program_state, this.cube_2, this.materials.c );

    this.cube_2 = Mat4.translation( 56.5, 9, 32 ).times( Mat4.rotation( 0.1 - 0.1 * Math.sin( ta * 12.1 + 1 ), 0, 0, 1 ) ).times( Mat4.rotation( Math.PI / 2 + 0.3 * Math.sin( ta * 8.7 + 2 ), 0, 1, 0 ) ).times( Mat4.scale( 5, 6, 1 ) );
    if ( this.light_num[ 2 ] === 1 )
      this.shapes.plane.draw( context, program_state, this.cube_2, this.materials.c );

    this.cube_2 = Mat4.translation( 57.5, 9, 61.5 ).times( Mat4.rotation( 0.1 - 0.1 * Math.sin( ta * 10.9 + 3 ), 0, 0, 1 ) ).times( Mat4.rotation( Math.PI / 2 + 0.3 * Math.sin( ta * 9.5 + 4 ), 0, 1, 0 ) ).times( Mat4.scale( 5, 6, 1 ) );
    if ( this.light_num[ 3 ] === 1 )
      this.shapes.plane.draw( context, program_state, this.cube_2, this.materials.c );

    if ( !off ) {
      if ( !game.key ) {
        model_transform = Mat4.translation( 50, -14, 75.2 ).times( Mat4.scale( 3, 3, 1 ) ).times( Mat4.rotation( 0, 0, 1, 0 ) );
        this.shapes.plane.draw( context, program_state, model_transform, this.answer_photo );
      }
    }
  }
}
