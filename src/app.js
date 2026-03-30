import './framework-globals.js';
import { installGameUi } from './game-ui.js';
import { installEscapeTimer } from './game-timer.js';
import { Main_Scene, Additional_Scenes, Canvas_Widget } from './main-scene.js';
import { initFireParticles } from './fire-particles.js';

installGameUi();
installEscapeTimer();

const element_to_replace = document.querySelector( '#main-canvas' );
const scenes = [ Main_Scene, ...Additional_Scenes ].map( ( SceneClass ) => new SceneClass() );
new Canvas_Widget( element_to_replace, scenes );

// After CaveScene resizes #surface, start 2D fire (earlier init would lose scale/state).
initFireParticles();
