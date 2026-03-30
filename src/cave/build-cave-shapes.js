import { assetUrl } from "../asset-paths.js";

/**
 * Loads OBJ geometry from assets/models/ (filename only, relative to that folder).
 */
export function buildCaveShapes( defs, Shape_From_File ) {
  const a = ( path ) => new Shape_From_File( assetUrl( `assets/models/${ path }` ) );
  return {
    cave1: a( "cave/cave1.obj" ),
    cave2: a( "cave/cave2.obj" ),
    cave3: a( "cave/cave3.obj" ),
    cave4: a( "cave/cave4.obj" ),
    cave5: a( "cave/cave5.obj" ),
    torch: a( "wall_torch.obj" ),
    door_left: a( "door_left.obj" ),
    door_right: a( "door_right.obj" ),
    door_plane: a( "doorplane.obj" ),
    gun: a( "Pistol_obj.obj" ),
    plane: new defs.Square(),
    gun_black: a( "gunblack.obj" ),
    gun_silver: a( "gunsliver.obj" ),
    box_bottom: a( "box_open.obj" ),
    box_unopened: a( "box_unopen.obj" ),
    key: a( "key.obj" ),
    statue: a( "statue.obj" ),
  };
}

const TEX_SCALE_SHAPES = [
  "cave1", "cave2", "cave3", "cave4", "cave5",
  "torch", "door_left", "door_right", "door_plane",
];

export function scaleCaveTextureCoords( shapes ) {
  for ( const name of TEX_SCALE_SHAPES )
    shapes[ name ].arrays.texture_coord.forEach( ( p ) => p.scale_by( 10 ) );
}
