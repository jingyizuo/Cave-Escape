import { widgets } from './core.js';

const Editor_Widget = widgets.Editor_Widget =
class Editor_Widget
{ constructor( element, initially_selected_class, canvas_widget, options = {} )
    { let rules = [ ".editor-widget { margin:auto; background:white; overflow:auto; font-family:monospace; width:1060px; padding:10px; \
                                      border-radius:12px; box-shadow: 20px 20px 90px 0px powderblue inset, 5px 5px 30px 0px blue inset }",
                    ".editor-widget button { background: #4C9F50; color: white; padding: 6px; border-radius:9px; margin-right:5px; \
                                             box-shadow: 4px 6px 16px 0px rgba(0,0,0,0.3); transition: background .3s, transform .3s }",
                    ".editor-widget input { margin-right:5px }",
                    ".editor-widget textarea { white-space:pre; width:1040px; margin-bottom:30px }",
                    ".editor-widget button:hover, button:focus { transform: scale(1.3); color:gold }"
                  ];

      for( const r of rules ) document.styleSheets[0].insertRule( r, 1 );

      this.associated_canvas = canvas_widget;
      this.options = options;

      const form = this.form = element.appendChild( document.createElement( "form" ) );
                                                          // Don't refresh the page on submit:
      form.addEventListener( 'submit', event => 
        { event.preventDefault(); this.submit_demo() }, false );    

      const explanation = form.appendChild( document.createElement( "p" ) );
      explanation.innerHTML = `<i><b>What can I put here?</b></i>  A JavaScript class, with any valid JavaScript inside.  Your code can use classes from this demo,
                               <br>or from ANY demo on Demopedia --  the dependencies will automatically be pulled in to run your demo!<br>`;
      
      const run_button = this.run_button = form.appendChild( document.createElement( "button" ) );
      run_button.type             = "button";
      run_button.style            = "background:maroon";
      run_button.textContent      = "Run with Changes";

      const submit = this.submit = form.appendChild( document.createElement( "button" ) );
      submit.type                 = "submit";
      submit.textContent          = "Save as New Webpage";

      const author_box = this.author_box = form.appendChild( document.createElement( "input" ) );
      author_box.name             = "author";
      author_box.type             = "text";
      author_box.placeholder      = "Author name";
      
      const password_box = this.password_box = form.appendChild( document.createElement( "input" ) );
      password_box.name           = "password";
      password_box.type           = "text";
      password_box.placeholder    = "Password";
      password_box.style          = "display:none";

      const overwrite_panel = this.overwrite_panel = form.appendChild( document.createElement( "span" ) );
      overwrite_panel.style       = "display:none";
      overwrite_panel.innerHTML   = "<label>Overwrite?<input type='checkbox' name='overwrite' autocomplete='off'></label>";

      const submit_result = this.submit_result = form.appendChild( document.createElement( "div" ) );
      submit_result.style         = "margin: 10px 0";

      const new_demo_code = this.new_demo_code = form.appendChild( document.createElement( "textarea" ) );
      new_demo_code.name    = "new_demo_code";
      new_demo_code.rows    = this.options.rows || 25;
      new_demo_code.cols    = 140;
      if( initially_selected_class )
        this.select_class( initially_selected_class );
    }
  select_class( class_definition )
    { this.new_demo_code.value = class_definition.toString(); }
  fetch_handler( url, body )          // A general utility function for sending / receiving JSON, with error handling.
    { return fetch( url,
      { body: body, method: body === undefined ? 'GET' : 'POST', 
        headers: { 'content-type': 'application/json'  } 
      }).then( response =>
      { if ( response.ok )  return Promise.resolve( response.json() )
        else                return Promise.reject ( response.status )
      })
    }
  submit_demo()
    { const form_fields = Array.from( this.form.elements ).reduce( ( accum, elem ) => 
        { if( elem.value && !( ['checkbox', 'radio'].includes( elem.type ) && !elem.checked ) )
            accum[ elem.name ] = elem.value; 
          return accum;
        }, {} );
        
      this.submit_result.innerHTML = "";
      return this.fetch_handler( "/submit-demo?Unapproved", JSON.stringify( form_fields ) )
        .then ( response => { if( response.show_password  ) this.password_box.style.display = "inline";
                              if( response.show_overwrite ) this.overwrite_panel.style.display = "inline";
                              this.submit_result.innerHTML += response.message + "<br>"; } )
        .catch(    error => { this.submit_result.innerHTML += "Error " + error + " when trying to upload.<br>" } )
    }
}
