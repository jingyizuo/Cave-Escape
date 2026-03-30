/**
 * 2D fire particle canvas on #surface; sampled into the WebGL flame texture.
 * Must run after CaveSceneBase resizes #surface (256×256), otherwise the
 * canvas reset wipes the 2D context state from an earlier init.
 */
let fireLoopStarted = false;

export function initFireParticles() {
  const space = document.getElementById( "surface" );
  if ( !space || fireLoopStarted ) return;

  const surface = space.getContext( "2d", { willReadFrequently: true } );
  if ( !surface ) return;

  fireLoopStarted = true;
  surface.scale( 4, 3 );

  const particles = [];
  const particle_count = 80;
  for ( let i = 0; i < particle_count; i++ )
    particles.push( new Particle() );

  space.style.width = "500px";
  space.style.height = "1000px";

  const requestAnimFrame = window.requestAnimationFrame
    || ( ( cb ) => window.setTimeout( cb, 1 ) );

  function Particle() {
    this.speed = { x: -1.5 + Math.random() * 2, y: -3 + Math.random() * 3 };
    this.location = { x: 30, y: 80 };
    this.radius = 0.5 + Math.random();
    this.life = 1 + Math.random() * 9;
    this.death = this.life;
    this.r = 255;
    this.g = Math.random() * 155;
    this.b = 0;
  }

  function particleFrame() {
    surface.globalCompositeOperation = "source-in";
    surface.fillStyle = "rgba(0, 0, 0, 0)";
    surface.fillRect( 0, 0, 50, 100 );
    surface.globalCompositeOperation = "lighter";
    for ( let i = 0; i < particles.length; i++ ) {
      const p = particles[ i ];
      surface.beginPath();
      p.opacity = Math.random() / 2;
      const gradient = surface.createRadialGradient(
        p.location.x, p.location.y, 0,
        p.location.x, p.location.y, p.radius );
      const rgba = `rgba(${p.r}, ${p.g}, ${p.b}, ${p.opacity})`;
      gradient.addColorStop( 0, rgba );
      gradient.addColorStop( 0.5, rgba );
      gradient.addColorStop( 1, `rgba(${p.r}, ${p.g}, ${p.b}, 0)` );
      surface.fillStyle = gradient;
      surface.arc( p.location.x, p.location.y, p.radius, 0, Math.PI * 2 );
      surface.fill();
      p.death--;
      p.radius++;
      p.location.x += p.speed.x / 1.2;
      p.location.y += p.speed.y;
      if ( p.death < 0 || p.radius < 0 )
        particles[ i ] = new Particle();
    }
    requestAnimFrame( particleFrame );
  }

  particleFrame();
}
