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
        
    };
    var level = {
        prompt: document.getElementById('prompt'),
        isStart: false,
        curr: 0,
        flag: 0,
        levels: [first],
        start: function() {
            audio.start();
            time.start();
        },
        over: function(sign) {
            
            audio.end();
            time.end();
            if(sign) {
                alert('跳到胜利场景');

            } else {
                alert('跳到失败场景');

            }
            /*setTimeout(function() {
                audio.end();
                time.end();
            }, 1000);*/
        },
        init: function() {
            this.levels[this.curr].init();
        },
        /*next: function() {
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

        },*/
        check: function(sign) {
            if(sign){
                this.over(true);
            }
            else{
                --this.levels[this.curr].time;
                if(this.levels[this.curr].time === 0) {
                    this.over(false);
                }
            }
            

        },
        showBoard: function() {

        }
    };

    window.level = level;
})();
