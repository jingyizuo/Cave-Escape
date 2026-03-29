/** Mutable cross-UI / scene state (gun, key pickup flow). */
export const state = {
  first_fire: false,
  last_fire: false,
  gun_hold: false,
  key: false,
};

export function randomInt( max ) {
  return Math.floor( Math.random() * Math.floor( max ) );
}
