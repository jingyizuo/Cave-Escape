(function() {
    // 第一关
    var first = {
        total: 2,
        init: function() {
            targets.add({
                x: 150,
                y: 0,
                z: -500,
                ry: 0,
                leave: function() {
                    this.rx += 0.3;
                    this.z -= 1.5;
                    if(this.z <= -450) {
                        this.destory();
                    }
                }
            });
        },
        over: function() {
            second.init();
            targets.remove(obstacles[0].index);
            targets.remove(obstacles[1].index);
        }
    };
    var level = {
        prompt: document.getElementById('prompt'),
        isStart: false,
        curr: 0,
        levels: [first],
        start: function() {
            audio.start();
            time.start();
        },
        over: function(sign) {
            if(sign) {
                console.log('游戏胜利');
            } else {
                console.log('游戏失败');
            }

            setTimeout(function() {
                audio.end();
                time.end();
            }, 1000);
        },
        init: function() {
            this.levels[this.curr].init();
        },
        next: function() {
            var self = this;
            this.curr++;

            if(this.curr < this.levels.length) {
                this.init();
                this.prompt.innerHTML = '第' + (this.curr+1) + '关';
                this.prompt.className = 'prompt animate';
                setTimeout(function() {
                    audio.done();
                }, 1000);

                setTimeout(function() {
                    self.prompt.className = 'prompt';
                }, 3000);
            } else {
                this.over(true);
            }

        },
        check: function() {
            --this.levels[this.curr].total;
            if(this.levels[this.curr].total === 0) {
                this.next();
            }
        },
        showBoard: function() {

        }
    };

    window.level = level;
})();
