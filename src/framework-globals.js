/**
 * Movement_Controls (`lib/common/movement.js`) calls global getAngle() for first-person mouse look.
 */
function getAngle( A, B ) {
  if ( B[ 0 ] === 0 && A[ 0 ] === 0 ) return 0;
  const a = A[ 0 ] * B[ 0 ] + A[ 1 ] * B[ 1 ];
  const b = Math.sqrt( A[ 0 ] * A[ 0 ] + A[ 1 ] * A[ 1 ] );
  const c = Math.sqrt( B[ 0 ] * B[ 0 ] + B[ 1 ] * B[ 1 ] );
  return ( B[ 0 ] / Math.abs( B[ 0 ] ) ) * Math.acos( a / b / c );
}

window.getAngle = getAngle;
