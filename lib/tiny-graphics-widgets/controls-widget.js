import { widgets } from './core.js';

const Controls_Widget = widgets.Controls_Widget =
class Controls_Widget
{                                               // **Controls_Widget** adds an array of panels to the document, one per loaded
                                                // Scene object, each providing interactive elements such as buttons with key 
                                                // bindings, live readouts of Scene data members, etc.
  constructor( element, scenes )
    { const rules = [ ".controls-widget * { font-family: monospace }",
                      ".controls-widget div { background: white }",
                      ".controls-widget table { border-collapse: collapse; display:block; overflow-x: auto; }",
                      ".controls-widget table.control-box { width: 1080px; border:0; margin:0; max-height:380px; transition:.5s; overflow-y:scroll; background:DimGray }",
                      ".controls-widget table.control-box:hover { max-height:500px }",
                      ".controls-widget table.control-box td { overflow:hidden; border:0; background:DimGray; border-radius:30px }",
                      ".controls-widget table.control-box td .control-div { background: #EEEEEE; height:338px; padding: 5px 5px 5px 30px; box-shadow: 25px 0px 60px -15px inset }",
                      ".controls-widget table.control-box td * { background:transparent }",
                      ".controls-widget table.control-box .control-div td { border-radius:unset }",
                      ".controls-widget table.control-box .control-title { padding:7px 40px; color:white; background:DarkSlateGray; box-shadow: 25px 0px 70px -15px inset black }",
                      ".controls-widget *.live_string { display:inline-block; background:unset }",
                      ".dropdown { display:inline-block }",
                      ".dropdown-content { display:inline-block; transition:.2s; transform: scaleY(0); overflow:hidden; position: absolute; \
                                            z-index: 1; background:#E8F6FF; padding: 16px; margin-left:30px; min-width: 100px; \
                                            box-shadow: 5px 10px 16px 0px rgba(0,0,0,0.2) inset; border-radius:10px }",
                      ".dropdown-content a { color: black; padding: 4px 4px; display: block }",
                      ".dropdown a:hover { background: #f1f1f1 }",
                      ".controls-widget button { background: #4C9F50; color: white; padding: 6px; border-radius:9px; \
                                                box-shadow: 4px 6px 16px 0px rgba(0,0,0,0.3); transition: background .3s, transform .3s }",
                      ".controls-widget button:hover, button:focus { transform: scale(1.3); color:gold }",
                      ".link { text-decoration:underline; cursor: pointer }",
                      ".show { transform: scaleY(1); height:200px; overflow:auto }",
                      ".hide { transform: scaleY(0); height:0px; overflow:hidden  }" ];
                      
      const style = document.head.appendChild( document.createElement( "style" ) );
      for( const r of rules ) document.styleSheets[document.styleSheets.length - 1].insertRule( r, 0 )

      const table = element.appendChild( document.createElement( "table" ) );
      table.className = "control-box";
      this.row = table.insertRow( 0 );

      this.panels = [];
      this.scenes = scenes;

      this.render();
    }
  make_panels( time )
    { this.timestamp = time;
      this.row.innerHTML = "";
                                                        // Traverse all scenes and their children, recursively:
      const open_list = [ ...this.scenes ];
      while( open_list.length )                       
      { open_list.push( ...open_list[0].children );
        const scene = open_list.shift();

        const control_box = this.row.insertCell();
        this.panels.push( control_box );
                                                                                        // Draw top label bar:
        control_box.appendChild( Object.assign( document.createElement("div"), { 
                                      textContent: scene.constructor.name, className: "control-title" } ) )

        const control_panel = control_box.appendChild( document.createElement( "div" ) );
        control_panel.className = "control-div";
        scene.control_panel = control_panel;
        scene.timestamp = time;
                                                        // Draw each registered animation:
        //scene.make_control_panel();                     
      }
    }
  render( time = 0 )
    {                       // Check to see if we need to re-create the panels due to any scene being new.                      
                            // Traverse all scenes and their children, recursively:
      const open_list = [ ...this.scenes ];
      while( open_list.length )                       
      { open_list.push( ...open_list[0].children );
        const scene = open_list.shift();
        if( !scene.timestamp || scene.timestamp > this.timestamp )        
        { this.make_panels( time );
          break;
        }

        // TODO: Check for updates to each scene's desired_controls_position, including if the 
        // scene just appeared in the tree, in which case call make_control_panel().
      }

      for( let panel of this.panels )
        for( let live_string of panel.querySelectorAll(".live_string") ) live_string.onload( live_string );
                                          // TODO: Cap this so that it can't be called faster than a human can read?
      this.event = window.requestAnimFrame( this.render.bind( this ) );
    }
}
