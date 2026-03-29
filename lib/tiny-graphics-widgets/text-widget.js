import { widgets } from './core.js';

const Text_Widget = widgets.Text_Widget =
class Text_Widget
{                                                // **Text_Widget** generates HTML documentation and fills a panel with it.  This
                                                 // documentation is extracted from whichever Scene object gets loaded first.
  constructor( element, scenes, webgl_manager ) 
    { const rules = [ ".text-widget { background: white; width:1060px;\
                        padding:0 10px; overflow:auto; transition:1s; overflow-y:scroll; box-shadow: 10px 10px 90px 0 inset LightGray}",
                      ".text-widget div { transition:none } "
                    ];
      if( document.styleSheets.length == 0 ) document.head.appendChild( document.createElement( "style" ) );
      for( const r of rules ) document.styleSheets[document.styleSheets.length - 1].insertRule( r, 0 )

      Object.assign( this, { element, scenes, webgl_manager } );
      this.render();
    }
  render( time = 0 )
    { if( this.scenes[0] )
        this.scenes[0].show_explanation( this.element, this.webgl_manager )
      else
        this.event = window.requestAnimFrame( this.render.bind( this ) )
    }
}