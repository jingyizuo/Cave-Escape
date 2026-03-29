import { tiny, defs } from './bootstrap.js';

const { Shape, vec3, vec } = tiny;

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

