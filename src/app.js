import './framework-globals.js';
import './fire-particles.js';
import { installGameUi } from './game-ui.js';
import { Main_Scene, Additional_Scenes, Canvas_Widget } from './main-scene.js';

installGameUi();

const element_to_replace = document.querySelector( '#main-canvas' );
const scenes = [ Main_Scene, ...Additional_Scenes ].map( ( SceneClass ) => new SceneClass() );
new Canvas_Widget( element_to_replace, scenes );
