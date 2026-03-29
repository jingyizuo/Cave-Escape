import { state } from './cave/game-input.js';

export function tempAlert( msg, duration ) {
  const el = document.createElement( 'div' );
  el.setAttribute( 'style', 'position:absolute;top:80%;left:50%;background-color:rgba(0,0,0,0.7);color:gray;transform: translate(-50%,-50%);font-size: 35px;' );
  el.innerHTML = msg;
  document.body.appendChild( el );
  setTimeout( () => { el.remove(); }, duration );
}

/** Wires `playSound` for inline onclick on #main-canvas. */
export function installGameUi() {
  window.playSound = function playSound() {
    if ( state.gun_hold === true ) {
      if ( state.last_fire === true ) {
        state.gun_hold = false;
        state.last_fire = false;
      }
      if ( state.first_fire === true ) {
        state.gun_hold = true;
        state.first_fire = false;
      }
      const audio = new Audio( 'assets/audio/gun.mp3' );
      audio.play();
    } else {
      if ( state.last_fire === true ) {
        state.gun_hold = false;
        state.last_fire = false;
      }
      if ( state.first_fire === true ) {
        state.first_fire = false;
        state.gun_hold = true;
      }
    }
    if ( state.key === true ) {
      state.first_fire = false;
      state.last_fire = false;
      state.gun_hold = false;
    }
  };
}
