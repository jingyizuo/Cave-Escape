import { widgets } from './core.js';
import { tiny } from '../tiny-graphics/index.js';

const Code_Widget = widgets.Code_Widget =
class Code_Widget
{                                         // **Code_Widget** draws a code navigator panel with inline links to the entire program source code.
  constructor( element, main_scene, additional_scenes, options = {} )
    { const rules = [ ".code-widget .code-panel { margin:auto; background:white; overflow:auto; font-family:monospace; width:1060px; padding:10px; padding-bottom:40px; max-height: 500px; \
                                                      border-radius:12px; box-shadow: 20px 20px 90px 0px powderblue inset, 5px 5px 30px 0px blue inset }",
                    ".code-widget .code-display { min-width:1200px; padding:10px; white-space:pre-wrap; background:transparent }",
                    ".code-widget table { display:block; margin:auto; overflow-x:auto; width:1080px; border-radius:25px; border-collapse:collapse; border: 2px solid black }",
                    ".code-widget table.class-list td { border-width:thin; background: #EEEEEE; padding:12px; font-family:monospace; border: 1px solid black }"
                     ];

      if( document.styleSheets.length == 0 ) document.head.appendChild( document.createElement( "style" ) );
      for( const r of rules ) document.styleSheets[document.styleSheets.length - 1].insertRule( r, 0 )

      this.associated_editor_widget = options.associated_editor;

      if( !main_scene )
        return;

      import( '../../src/main-scene.js' )
        .then( module => { 
        
          this.build_reader(      element, main_scene, additional_scenes, module.defs );
          if( !options.hide_navigator )
            this.build_navigator( element, main_scene, additional_scenes, module.defs );
        } )
    }
  build_reader( element, main_scene, additional_scenes, definitions )
    {                                           // (Internal helper function)      
      this.definitions = definitions;
      const code_panel = element.appendChild( document.createElement( "div" ) );
      code_panel.className = "code-panel";
//       const text        = code_panel.appendChild( document.createElement( "p" ) );
//       text.textContent  = "Code for the above scene:";
      this.code_display = code_panel.appendChild( document.createElement( "div" ) );
      this.code_display.className = "code-display";
                                                                            // Default textbox contents:
      this.display_code( main_scene );
    }
  build_navigator( element, main_scene, additional_scenes, definitions )
    {                                           // (Internal helper function)
      const class_list = element.appendChild( document.createElement( "table" ) );
      class_list.className = "class-list";   
      const top_cell = class_list.insertRow( -1 ).insertCell( -1 );
      top_cell.colSpan = 2;
      top_cell.appendChild( document.createTextNode("Click below to navigate through all classes that are defined.") );
      const content = top_cell.appendChild( document.createElement( "p" ) );
      content.style = "text-align:center; margin:0; font-weight:bold";
      content.innerHTML = "src/main-scene.js<br>Main Scene: ";
      const main_scene_link = content.appendChild( document.createElement( "a" ) );
      main_scene_link.href = "javascript:void(0);"
      main_scene_link.addEventListener( 'click', () => this.display_code( main_scene ) );
      main_scene_link.textContent = main_scene.name;

      const second_cell = class_list.insertRow( -1 ).insertCell( -1 );
      second_cell.colSpan = 2;
      second_cell.style = "text-align:center; font-weight:bold";
      const index_src_link = second_cell.appendChild( document.createElement( "a" ) );
      index_src_link.href = "javascript:void(0);"
      index_src_link.addEventListener( 'click', () => this.display_code() );
      index_src_link.textContent = "This page's complete HTML source";

      const third_row = class_list.insertRow( -1 );
      third_row.style = "text-align:center";
      third_row.innerHTML = "<td><b>tiny-graphics.js</b><br>(Always the same)</td> \
                             <td><b>All other class definitions from dependencies:</td>";

      const fourth_row = class_list.insertRow( -1 );
                                                                            // Generate the navigator table of links:
      for( let list of [ tiny, definitions ] )
      { const cell = fourth_row.appendChild( document.createElement( "td" ) );
                                              // List all class names except the main one, which we'll display separately:
        const class_names = Object.keys( list ).filter( x => x != main_scene.name );
        cell.style = "white-space:normal"
        for( let name of class_names )
        { const class_link = cell.appendChild( document.createElement( "a" ) );
          class_link.style["margin-right"] = "80px"
          class_link.href = "javascript:void(0);"
          class_link.addEventListener( 'click', () => this.display_code( tiny[name] || definitions[name] ) );
          class_link.textContent = name;
          cell.appendChild( document.createTextNode(" ") );
        }
      }
    }
  display_code( class_to_display )
    {                                           // display_code():  Populate the code textbox.
                                                // Pass undefined to choose index.html source.
      if( this.associated_editor_widget ) 
        this.associated_editor_widget.select_class( class_to_display );
      if( class_to_display ) this.format_code( class_to_display.toString() );
      else fetch( document.location.href )
                .then(   response => response.text() )
                .then( pageSource => this.format_code( pageSource ) );
    }
  format_code( code_string )
    {                                           // (Internal helper function)
      this.code_display.innerHTML = "";
      const color_map = { string: "chocolate", comment: "green", regex: "blue", number: "magenta", 
                            name: "black", punctuator: "red", whitespace: "black" };

      for( let t of new Code_Manager( code_string ).tokens )
        if( t.type == "name" && [ ...Object.keys( tiny ), ...Object.keys( this.definitions ) ].includes( t.value ) )
          { const link = this.code_display.appendChild( document.createElement( 'a' ) );
            link.href = "javascript:void(0);"
            link.addEventListener( 'click', () => this.display_code( tiny[t.value] || this.definitions[t.value] ) );
            link.textContent = t.value;
          }
        else
          { const span = this.code_display.appendChild( document.createElement( 'span' ) );
            span.style.color = color_map[t.type];
            span.textContent = t.value;
          }
    }
}
