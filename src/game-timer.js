/** Wall-clock escape limit from when the game page loads. */
const LIMIT_MS = 2 * 60 * 1000;

let rafId = null;
let startTime = null;
let stopped = false;

function formatRemaining( ms ) {
  const sec = Math.max( 0, Math.ceil( ms / 1000 ) );
  const m = Math.floor( sec / 60 );
  const s = sec % 60;
  return `${ m }:${ String( s ).padStart( 2, "0" ) }`;
}

export function stopEscapeTimer() {
  stopped = true;
  if ( rafId !== null ) {
    cancelAnimationFrame( rafId );
    rafId = null;
  }
}

export function installEscapeTimer() {
  const el = document.getElementById( "escape-timer" );
  if ( !el || startTime !== null ) return;

  stopped = false;
  startTime = performance.now();

  function tick() {
    if ( stopped ) return;
    const elapsed = performance.now() - startTime;
    const left = LIMIT_MS - elapsed;

    if ( left <= 0 ) {
      el.textContent = "0:00";
      el.classList.add( "escape-timer--crit" );
      stopEscapeTimer();
      try {
        document.exitPointerLock();
      } catch ( _ ) { /* ignore */ }
      window.location.href = "lose.html";
      return;
    }

    el.textContent = formatRemaining( left );
    const sec = Math.ceil( left / 1000 );
    el.classList.toggle( "escape-timer--warn", sec <= 30 && sec > 10 );
    el.classList.toggle( "escape-timer--crit", sec <= 10 );
    rafId = requestAnimationFrame( tick );
  }

  rafId = requestAnimationFrame( tick );
}
