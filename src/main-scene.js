import { tiny, defs } from '../lib/common.js';

const { Canvas_Widget, Code_Widget, Text_Widget } = tiny;

import { CaveScene } from './cave/cave-scene.js';

Object.assign( defs, { Transforms_Sandbox: CaveScene } );

const Main_Scene = CaveScene;
const Additional_Scenes = [];

export { Main_Scene, Additional_Scenes, Canvas_Widget, Code_Widget, Text_Widget, defs };
