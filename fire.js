$(document).ready(function() {

    // Set canvas drawing surface
    var space = document.getElementById("surface");
    var surface = space.getContext("2d");
  //  surface.scale(1, 1);
    // Set Particles
    var particles = [];
    var particle_count = 60;
    for (var i = 0; i < particle_count; i++) {
        particles.push(new particle());
    }
    var time = 0;
    // Set wrapper and canvas items size
    var canvasWidth = 320;
    var canvasHeight = 480;
    $("#surface").css({
        width: 300,
        height: 500
    });

    // shim layer with setTimeout fallback from Paul Irish
    window.requestAnimFrame = (function() {
        return window.requestAnimationFrame ||
            function(callback) {
                window.setTimeout(callback,1);
            };
    })();

    function particle() {
        this.speed = {
            x: -1 + Math.random() * 2,
            y: -5 + Math.random() * 5
        };
        this.location = {
          x: 150,
          y: 80,
        };
        this.radius = .5 + Math.random() * 1;
        this.life = 1 + Math.random() * 8;
        this.death = this.life;
        this.r = 255;
        this.g = Math.random() * 155;
        this.b = 0;
    }

    function ParticleAnimation() {
        surface.globalCompositeOperation = "source-in";
        surface.fillStyle = "rgba(0, 0, 0, 0)";
        surface.fillRect(0,0,50,100);
        surface.globalCompositeOperation = "lighter";
        for (var i = 0; i < particles.length; i++) {
            var p = particles[i];
            surface.beginPath();
            p.opacity =Math.random()/2;
            var gradient = surface.createRadialGradient(p.location.x, p.location.y, 0, p.location.x, p.location.y, p.radius);
            gradient.addColorStop(0, "rgba(" + p.r + ", " + p.g + ", " + p.b + ", " + p.opacity + ")");
            gradient.addColorStop(0.5, "rgba(" + p.r + ", " + p.g + ", " + p.b + ", " + p.opacity + ")");
            gradient.addColorStop(1, "rgba(" + p.r + ", " + p.g + ", " + p.b + ", 0)");
            surface.fillStyle = gradient;
            surface.arc(p.location.x, p.location.y, p.radius, Math.PI * 2, false);
            surface.fill();
            p.death--;
            p.radius++;
            p.location.x += (p.speed.x/1.2);
            p.location.y += (p.speed.y);
            //regenerate particles
            if (p.death < 0 || p.radius < 0) {
                //a brand new particle replacing the dead one
                particles[i] = new particle();
            }
        }
        requestAnimFrame(ParticleAnimation);
    }
    ParticleAnimation();
});
