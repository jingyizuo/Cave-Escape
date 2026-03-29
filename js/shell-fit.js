/**
 * Fills the viewport with a full-screen shell element (start / end pages).
 * Set selector on <html data-shell-fit=".your-root-class">.
 */
(function () {
  const sel = document.documentElement.getAttribute( "data-shell-fit" );
  if ( !sel ) return;

  function fit() {
    const el = document.querySelector( sel );
    if ( !el ) return;
    el.style.height = window.innerHeight + "px";
    el.style.width = window.innerWidth + "px";
  }

  window.addEventListener( "resize", fit );
  if ( document.readyState === "loading" )
    document.addEventListener( "DOMContentLoaded", fit );
  else
    fit();
})();
