import { widgets } from './core.js';
import { tiny } from '../tiny-graphics/index.js';

const { color } = tiny;

const Canvas_Widget = widgets.Canvas_Widget =
class Canvas_Widget
{                           // **Canvas_Widget** embeds a WebGL demo onto a website in place of the given placeholder document
                            // element.  It creates a WebGL canvas and loads onto it any initial Scene objects in the 
                            // arguments.  Optionally spawns a Text_Widget and Controls_Widget for showing more information
                            // or interactive UI buttons, divided into one panel per each loaded Scene.  You can use up to
                            // 16 Canvas_Widgets; browsers support up to 16 WebGL contexts per page.
  constructor( element, initial_scenes, options = {} )   
    { this.element = element;

      const defaults = { show_canvas: true, make_controls: false, show_explanation: false, 
                         make_editor: false, make_code_nav: false };
      if( initial_scenes && initial_scenes[0] )
        Object.assign( options, initial_scenes[0].widget_options );
      Object.assign( this, defaults, options )
      
      const rules = [ ".canvas-widget { width: 1080px; background: DimGray; margin:auto }",
                      ".canvas-widget canvas { width: 1080px; height: 600px; margin-bottom:-3px }" ];
                      
      if( document.styleSheets.length == 0 ) document.head.appendChild( document.createElement( "style" ) );
      for( const r of rules ) document.styleSheets[document.styleSheets.length - 1].insertRule( r, 0 )

                              // Fill in the document elements:
      if( this.show_explanation )
      { this.embedded_explanation_area = this.element.appendChild( document.createElement( "div" ) );
        this.embedded_explanation_area.className = "text-widget";
      }

      const canvas = this.element.appendChild( document.createElement( "canvas" ) );

      if( this.make_controls )
      { this.embedded_controls_area    = this.element.appendChild( document.createElement( "div" ) );
        this.embedded_controls_area.className = "controls-widget";
      }

      if( this.make_code_nav )
      { this.embedded_code_nav_area    = this.element.appendChild( document.createElement( "div" ) );
        this.embedded_code_nav_area.className = "code-widget";
      }

      if( this.make_editor )
      { this.embedded_editor_area      = this.element.appendChild( document.createElement( "div" ) );
        this.embedded_editor_area.className = "editor-widget";
      }

      if( !this.show_canvas )
        canvas.style.display = "none";

      this.webgl_manager = new tiny.Webgl_Manager( canvas, color( 0,0,0,1 ) );  // Second parameter sets background color.


                           // Add scenes and child widgets
      if( initial_scenes )
        this.webgl_manager.scenes.push( ...initial_scenes );

      const primary_scene = initial_scenes ? initial_scenes[0] : undefined;
      const additional_scenes = initial_scenes ? initial_scenes.slice(1) : [];
      const primary_scene_definiton = primary_scene ? primary_scene.constructor : undefined;
      if( this.show_explanation )
        this.embedded_explanation  = new Text_Widget( this.embedded_explanation_area, this.webgl_manager.scenes, this.webgl_manager );
      if( this.make_controls )
        this.embedded_controls     = new Controls_Widget( this.embedded_controls_area, this.webgl_manager.scenes );
      if( this.make_editor )
        this.embedded_editor       = new Editor_Widget( this.embedded_editor_area, primary_scene_definiton, this );
      if( this.make_code_nav )
        this.embedded_code_nav     = new Code_Widget( this.embedded_code_nav_area, primary_scene_definiton, 
                                     additional_scenes, { associated_editor: this.embedded_editor } );

                                       // Start WebGL initialization.  Note that render() will re-queue itself for continuous calls.
      this.webgl_manager.render();
    }
}
