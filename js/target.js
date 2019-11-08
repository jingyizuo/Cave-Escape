var Target = function(webgl) {
    var triangles = {
        poData: [],
        coData: [],
        indexData: [],
        length: 0,
        s: 0
    };
    var lines = {
        poData: [],
        coData: [],
        indexData: [],
        length: 0,
        s: 0
    };
    var tmp = [];
    var s = 0;
    var i, j;
    var angle = 0;
    var length = 0;
    var targets = {
        component: [],
        ids: [],
        traces: [],
        scale: 15,
        add: function(data, fn) {
            var target = {
                trianglesPoData: triangles.poData,
                trianglesPoBuf: webgl.createBuffer(),
                trianglesCoData: triangles.coData,
                trianglesCoBuf: webgl.createBuffer(),
                trianglesIndexData: triangles.indexData,
                trianglesIndexBuf: webgl.createBuffer(),
                trianglesLength: triangles.length,
                linesPoData: lines.poData,
                linesPoBuf: webgl.createBuffer(),
                linesCoData: lines.coData,
                linesCoBuf: webgl.createBuffer(),
                linesIndexData: lines.indexData,
                linesIndexBuf: webgl.createBuffer(),
                linesLength: lines.length,
                x: data.x,
                y: data.y,
                z: data.z,
                sy: Math.sin(data.ry),
                cy: Math.cos(data.ry),
                rx: 0,
                //moveDirX: data.moveDirX || 0,
                //moveDirY: data.moveDirY || 0,
                //moveDirZ: data.moveDirZ || 0,
                dead: false,
                leave: function() {
                    this.tick = data.leave;
                },
                tick: fn || function() {},
                destory: function() {
                    this.dead = true;
                },
                draw: function() {
                    var sy = this.sy;
                    var cy = this.cy;
                    var sx = Math.sin(this.rx);
                    var cx = Math.cos(this.rx);

                    var x = this.x;
                    var y = this.y;
                    var z = this.z;

                    webgl.uniformMatrix4fv(
                        uMMatrix, false, [
                            cy, 0, -sy, 0,
                            sy*sx, cx, cy*sx, 0,
                            sy*cx, -sx, cy*cx, 0,
                            x/15, y/15, z/15, 1
                        ]
                    );
                    /**/

                    webgl.bindBuffer(webgl.ARRAY_BUFFER, this.trianglesPoBuf);
                    webgl.vertexAttribPointer(aPosition, 3, webgl.FLOAT, false, 0, 0);

                    webgl.bindBuffer(webgl.ARRAY_BUFFER, this.trianglesCoBuf);
                    webgl.vertexAttribPointer(aColor, 3, webgl.FLOAT, false, 0, 0);

                    webgl.bindBuffer(webgl.ELEMENT_ARRAY_BUFFER, this.trianglesIndexBuf);

                    webgl.drawElements(webgl.TRIANGLES, this.trianglesLength, webgl.UNSIGNED_SHORT, 0);


                    webgl.bindBuffer(webgl.ARRAY_BUFFER, this.linesPoBuf);
                    webgl.vertexAttribPointer(aPosition, 3, webgl.FLOAT, false, 0, 0);
                    webgl.bindBuffer(webgl.ARRAY_BUFFER, this.linesCoBuf);
                    webgl.vertexAttribPointer(aColor, 3, webgl.FLOAT, false, 0, 0);
                    webgl.bindBuffer(webgl.ELEMENT_ARRAY_BUFFER, this.linesIndexBuf);
                    webgl.drawElements(webgl.LINES, this.linesLength, webgl.UNSIGNED_SHORT, 0);

                    this.tick();
                },
                drawFrame: function() {
                    var s = this.sy;
                    var c = this.cy;

                    var x = this.x;
                    var y = this.y;
                    var z = this.z;

                    var r = this.rgb[0]/10;
                    var g = this.rgb[1]/10;
                    var b = this.rgb[2]/10;

                    webgl.uniformMatrix4fv(
                        uMMatrix, false, [
                            c, 0, -s, 0,
                            0, 1, 0, 0,
                            s, 0, c, 0,
                            x/15, y/15, z/15, 1
                        ]
                    );

                    webgl.bindBuffer(webgl.ARRAY_BUFFER, this.trianglesPoBuf);
                    webgl.vertexAttribPointer(aPosition, 3, webgl.FLOAT, false, 0, 0);

                    webgl.vertexAttrib4f(aFrameColor, r, g, b, 1);

                    webgl.bindBuffer(webgl.ARRAY_BUFFER, this.trianglesCoBuf);
                    webgl.vertexAttribPointer(aColor, 3, webgl.FLOAT, false, 0, 0);

                    webgl.bindBuffer(webgl.ELEMENT_ARRAY_BUFFER, this.trianglesIndexBuf);

                    webgl.drawElements(webgl.TRIANGLES, this.trianglesLength, webgl.UNSIGNED_SHORT, 0);
                }
            };

            this.getId(target);

            webgl.bindBuffer(webgl.ARRAY_BUFFER, target.linesPoBuf);
            webgl.bufferData(webgl.ARRAY_BUFFER, new Float32Array(target.linesPoData), webgl.STATIC_DRAW);
            webgl.bindBuffer(webgl.ARRAY_BUFFER, target.linesCoBuf);
            webgl.bufferData(webgl.ARRAY_BUFFER, new Float32Array(target.linesCoData), webgl.STATIC_DRAW);
            webgl.bindBuffer(webgl.ELEMENT_ARRAY_BUFFER, target.linesIndexBuf);
            webgl.bufferData(webgl.ELEMENT_ARRAY_BUFFER, new Uint16Array(target.linesIndexData), webgl.STATIC_DRAW);

            webgl.bindBuffer(webgl.ARRAY_BUFFER, target.trianglesPoBuf);
            webgl.bufferData(webgl.ARRAY_BUFFER, new Float32Array(target.trianglesPoData), webgl.STATIC_DRAW);
            webgl.bindBuffer(webgl.ARRAY_BUFFER, target.trianglesCoBuf);
            webgl.bufferData(webgl.ARRAY_BUFFER, new Float32Array(target.trianglesCoData), webgl.STATIC_DRAW);
            webgl.bindBuffer(webgl.ELEMENT_ARRAY_BUFFER, target.trianglesIndexBuf);
            webgl.bufferData(webgl.ELEMENT_ARRAY_BUFFER, new Uint16Array(target.trianglesIndexData), webgl.STATIC_DRAW);

            target.index = this.component.length;

            this.component.push(target);

            return target;
        },
        remove: function(index) {
            this.component.splice(index, 1);
        },
        getId: function(target) {
            var r = '' + Math.floor(Math.random() * 100);
            var g = '' + Math.floor(Math.random() * 100);
            var b = '' + Math.floor(Math.random() * 100);

            var id = r + g + b;
            if(this[id]) {
                this.getId(target);
                return ;
            }

            target.rgb = [r/10, g/10, b/10];
            this[id] = target;
            this.ids.push([r, g, b]);
        },
        draw: function() {

            webgl.uniformMatrix4fv(uVMatrix, false, camera.toMatrix());

            this.component.forEach(function(item) {
                if(!item.dead) {
                    item.draw();
                }
            });
        },
        drawFrame: function() {
            webgl.uniformMatrix4fv(uVMatrix, false, camera.toMatrix());

            this.component.forEach(function(item) {
                if(!item.dead) {
                    item.drawFrame();
                }
            });
        },
        check: function(arr) {
            var r = '' + Math.floor(arr[0] / 255 * 100);
            var g = '' + Math.floor(arr[1] / 255 * 100);
            var b = '' + Math.floor(arr[2] / 255 * 100);
            var i;
            var id;
            // console.log(r, g, b);
            for(i = 0; i < this.ids.length; i++) {
                if(Math.abs(this.ids[i][0] - r) <= 1 && Math.abs(this.ids[i][1] - g) <= 1 && Math.abs(this.ids[i][2] - b) <= 1) {
                    console.log('命中!');
                    id = this.ids[i][0] + this.ids[i][1] + this.ids[i][2];
                    //this[id].leave();
                    score.add(1);
                    level.check(true);
                    // this.addTrace();
                    break ;
                }
                else{
                    level.check(false);
                }
            }
        }
        /*addTrace: function() {
            var trace = {
                poData: [],
                poBuf: webgl.createBuffer(),
                coData: [],
                coBuf: webgl.createBuffer(),
                draw: function() {
                    webgl.uniformMatrix4fv(
                        uMMatrix, false, this.model
                    );

                    webgl.uniformMatrix4fv(
                        uVMatrix, false, camera.toMatrix()
                    );

                    webgl.bindBuffer(webgl.ARRAY_BUFFER, this.poBuf);
                    webgl.vertexAttribPointer(aPosition, 3, webgl.FLOAT, false, 0, 0);

                    webgl.bindBuffer(webgl.ARRAY_BUFFER, this.coBuf);
                    webgl.vertexAttribPointer(aColor, 3, webgl.FLOAT, false, 0, 0);

                    webgl.drawArrays(webgl.POINTS, 0, 1);
                }
            };

            var sx = Math.sin(camera.ry);
            var cx = Math.cos(camera.ry);
            var sy = Math.sin(-camera.rx);
            var cy = Math.cos(-camera.rx);

            trace.model = [
                cy/15,    0,      -sy/15,    0,
                sy*sx/15, cx/15,  sx*cy/15,  0,
                sy*cx/15, -sx/15, cx*cy/15,  0,
                0,0,0,1
            ];

            trace.poData.push(0,0,-400);
            trace.coData.push(1,0,0);

            webgl.bindBuffer(webgl.ARRAY_BUFFER, trace.poBuf);
            webgl.bufferData(webgl.ARRAY_BUFFER, new Float32Array(trace.poData), webgl.STATIC_DRAW);

            webgl.bindBuffer(webgl.ARRAY_BUFFER, trace.coBuf);
            webgl.bufferData(webgl.ARRAY_BUFFER, new Float32Array(trace.coData), webgl.STATIC_DRAW);

            this.traces.push(trace);
        }*/
    };

    triangles.poData.push(10,5, 1);
    triangles.poData.push(12,5, 1);
    triangles.poData.push(12,2, 1);
    triangles.poData.push(10,2, 1);
    triangles.coData.push(0, 0, 0);
    triangles.coData.push(0, 0, 0);
    triangles.coData.push(0, 0, 0);
    triangles.coData.push(0, 0, 0);

    triangles.indexData.push(triangles.s, triangles.s+1, triangles.s+2, triangles.s, triangles.s+2, triangles.s+3);
    triangles.s += 4;
    triangles.length += 6;

    return targets;
};
