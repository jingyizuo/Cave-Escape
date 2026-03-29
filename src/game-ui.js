import { assetUrl } from "./asset-paths.js";
import { state } from './cave/game-input.js';

export function tempAlert( msg, duration ) {
  const el = document.createElement( 'div' );
  el.setAttribute( 'style', 'position:absolute;top:80%;left:50%;background-color:rgba(0,0,0,0.7);color:gray;transform: translate(-50%,-50%);font-size: 35px;' );
  el.innerHTML = msg;
  document.body.appendChild( el );
  setTimeout( () => { el.remove(); }, duration );
}

function installHintHotkey() {
  window.addEventListener( "keydown", ( e ) => {
    if ( e.repeat ) return;
    const k = e.key;
    if ( k !== "h" && k !== "H" ) return;
    const t = e.target;
    if ( t && ( t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable ) ) return;
    e.preventDefault();
    tempAlert(
      "Light torches to match the carving. When correct, a gun appears. Click to shoot the chest, take the key, then open a door.",
      4200,
    );
  } );
}

/** Wires `playSound` for inline onclick on #main-canvas. */
export function installGameUi() {
  installHintHotkey();
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
      const audio = new Audio( assetUrl( "assets/audio/gun.mp3" ) );
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
