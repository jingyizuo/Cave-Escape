import {tiny, defs} from './common.js';
                                                  // Pull these names into this module's scope for convenience:
const { vec3, vec4, vec, color, Mat4, Light, Shape, Material, Shader, Texture, Scene } = tiny;

const Shape_From_File = defs.Shape_From_File =
    class Shape_From_File extends Shape {                                   // **Shape_From_File** is a versatile standalone Shape that imports
        // all its arrays' data from an .obj 3D model file.
        constructor(filename, normalize = false) {
            super("position", "normal", "texture_coord");
            // Begin downloading the mesh. Once that completes, return
            // control to our parse_into_mesh function.
            this.load_file(filename, normalize);
        }


        load_file(filename, normalize) {                             // Request the external file and wait for it to load.
            // Failure mode:  Loads an empty shape.
            return fetch(filename)
                .then(response => {
                    if (response.ok) return Promise.resolve(response.text())
                    else return Promise.reject(response.status)
                })
                .then(obj_file_contents => this.parse_into_mesh(obj_file_contents, normalize))
                .catch(error => {
                    this.copy_onto_graphics_card(this.gl);
                })
        }

        parse_into_mesh(data, normalize) {                           // Adapted from the "webgl-obj-loader.js" library found online:
            let verts = [], vertNormals = [], textures = [], unpacked = {};

            unpacked.verts = [];
            unpacked.norms = [];
            unpacked.textures = [];
            unpacked.hashindices = {};
            unpacked.indices = [];
            unpacked.index = 0;

            const VERTEX_RE = /^v\s/;
            const NORMAL_RE = /^vn\s/;
            const TEXTURE_RE = /^vt\s/;
            const FACE_RE = /^f\s/;
            const WHITESPACE_RE = /\s+/;

            const lines = data.split('\n');

            for (let line of lines) {
                line = line.trim();
                if (!line || line.startsWith("#")) {
                    continue;
                }
                const elements = line.split(WHITESPACE_RE);
                elements.shift();

                if (VERTEX_RE.test(line)) {
                    // if this is a vertex
                    verts.push(...elements);
                } else if (NORMAL_RE.test(line)) {
                    // if this is a vertex normal
                    vertNormals.push(...elements);
                } else if (TEXTURE_RE.test(line)) {
                    let coords = elements;
                    // by default, the loader will only look at the U and V
                    // coordinates of the vt declaration. So, this truncates the
                    // elements to only those 2 values.
                    if (elements.length > 2) {
                        coords = elements.slice(0, 2);
                    }
                    textures.push(...coords);
                } else if (FACE_RE.test(line)) {
                    const triangles = triangulate(elements);
                    for (const triangle of triangles) {
                        for (let j = 0, eleLen = triangle.length; j < eleLen; j++) {
                            if (elements[j] in unpacked.hashindices)
                                unpacked.indices.push(unpacked.hashindices[elements[j]]);
                            else {
                                const vertex = triangle[j].split("/");
                                const normalIndex = vertex.length - 1;

                                // Vertex position
                                unpacked.verts.push(+verts[(+vertex[0] - 1) * 3 + 0]);
                                unpacked.verts.push(+verts[(+vertex[0] - 1) * 3 + 1]);
                                unpacked.verts.push(+verts[(+vertex[0] - 1) * 3 + 2]);
                                // Vertex textures
                                if (textures.length) {
                                    unpacked.textures.push(+textures[(+vertex[1] - 1) * 2 + 0]);
                                    unpacked.textures.push(+textures[(+vertex[1] - 1) * 2 + 1]);
                                }
                                // Vertex normals
                                unpacked.norms.push(+vertNormals[(+vertex[normalIndex] - 1) * 3 + 0]);
                                unpacked.norms.push(+vertNormals[(+vertex[normalIndex] - 1) * 3 + 1]);
                                unpacked.norms.push(+vertNormals[(+vertex[normalIndex] - 1) * 3 + 2]);
                                // add the newly created Vertex to the list of indices
                                unpacked.hashindices[elements[j]] = unpacked.index;
                                unpacked.indices.push(unpacked.index);
                                // increment the counter
                                unpacked.index += 1;
                            }
                        }
                    }
                }
            }
            {
                const {verts, norms, textures} = unpacked;
                for (let j = 0; j < verts.length / 3; j++) {
                    this.arrays.position.push(vec3(verts[3 * j], verts[3 * j + 1], verts[3 * j + 2]));
                    this.arrays.normal.push(vec3(norms[3 * j], norms[3 * j + 1], norms[3 * j + 2]));
                    this.arrays.texture_coord.push(vec(textures[2 * j], textures[2 * j + 1]));
                }
                this.indices = unpacked.indices;
            }
            if (normalize)
                this.normalize_positions(false);
            this.ready = true;
        }

        draw(context, program_state, model_transform, material) {               // draw(): Same as always for shapes, but cancel all
            // attempts to draw the shape before it loads:
            if (this.ready)
                super.draw(context, program_state, model_transform, material);
        }
    };

function* triangulate(elements) {
    if (elements.length <= 3) {
        yield elements;
    } else if (elements.length === 4) {
        yield [elements[0], elements[1], elements[2]];
        yield [elements[2], elements[3], elements[0]];
    } else {
        for (let i = 1; i < elements.length - 1; i++) {
            yield [elements[0], elements[i], elements[i + 1]];
        }
    }
}

export class Obj_File_Demo extends Scene
  {                           // **Obj_File_Demo** show how to load a single 3D model from an OBJ file.
                              // Detailed model files can be used in place of simpler primitive-based
                              // shapes to add complexity to a scene.  Simpler primitives in your scene
                              // can just be thought of as placeholders until you find a model file
                              // that fits well.  This demo shows the teapot model twice, with one
                              // teapot showing off the Fake_Bump_Map effect while the other has a
                              // regular texture and Phong lighting.
    constructor()
      { super();
                                      // Load the model file:
        this.shapes = { "key": new Shape_From_File( "assets/key.obj" ) };

                                      // Don't create any DOM elements to control this scene:
        this.widget_options = { make_controls: false };
                                                          // Non bump mapped:
        this.stars = new Material( new defs.Textured_Phong( 1 ),  { color: color( .5,.5,.5,1 ),
          ambient: .3, diffusivity: .5, specularity: .5, texture: new Texture( "assets/stars.png" ) });
                                                           // Bump mapped:
        this.bumps = new Material( new defs.Fake_Bump_Map( 1 ), { color: color( .5,.5,.5,1 ),
          ambient: .3, diffusivity: .5, specularity: .5, texture: new Texture( "assets/stars.png" ) });
      }
    display( context, program_state )
      { const t = program_state.animation_time;

        program_state.set_camera( Mat4.translation( 0,0,-5 ) );    // Locate the camera here (inverted matrix).
        program_state.projection_transform = Mat4.perspective( Math.PI/4, context.width/context.height, 1, 500 );
                                                // A spinning light to show off the bump map:
        program_state.lights = [ new Light(
                                 Mat4.rotation( t/300,   1,0,0 ).times( vec4( 3,2,10,1 ) ),
                                             color( 1,.7,.7,1 ), 100000 ) ];

        for( let i of [ -1, 1 ] )
        {                                       // Spin the 3D model shapes as well.
          const model_transform = Mat4.rotation( t/2000,   0,2,1 )
                          .times( Mat4.translation( 2*i, 0, 0 ) )
                          .times( Mat4.rotation( t/1500,   -1,2,0 ) )
                          .times( Mat4.rotation( -Math.PI/2,   1,0,0 ) );
          this.shapes.key.draw( context, program_state, model_transform, i == 1 ? this.stars : this.bumps );
        }
      }
  show_explanation( document_element )
    { document_element.innerHTML += "<p>This demo loads an external 3D model file of a teapot.  It uses a condensed version of the \"webgl-obj-loader.js\" "
                                 +  "open source library, though this version is not guaranteed to be complete and may not handle some .OBJ files.  It is contained in the class \"Shape_From_File\". "
                                 +  "</p><p>One of these teapots is lit with bump mapping.  Can you tell which one?</p>";
    }
  }