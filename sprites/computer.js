"use strict";


var computer = function ( id, props) {

    var computerObject = {
        "canvas": document.getElementById(id),
        period:  props.period !== undefined ? props.period : 10,
        x: props.x !== undefined ? props.x : 0,
        y: props.y !== undefined ? props.y : 0,
        width: props.width !== undefined ? props.width : 200,
        height: props.height !== undefined ? props.height : 200,
        colorPicked: false,
        backgroundColor: "rgb(0, 0, 0)",
        textColor: "rgb(0, 0, 0)",

        draw: function (step) {
            var ctx = this.canvas.getContext( "2d" );

            ctx.save();

            // This will get weirder as time progresses
            var w = this.width,
                h = this.height;

            // Center our origin
            ctx.translate(this.x, this.y);

            ctx.fillStyle  = "rgb(100, 100, 100)";

            var standWidth = .3,
                standHeight = .1,
                baseWidth = .5,
                baseHeight = .05,
                screenHeight = 1 - standHeight -  baseHeight,
                bezel = .05;

            ctx.fillRect(0, 0, w, h * screenHeight);
            ctx.fillRect(w * (1 - standWidth) / 2, h * screenHeight, w * standWidth, h * standHeight);
            ctx.fillRect(w * (1 - baseWidth) / 2, h * (1 - baseHeight), w * baseWidth, h * baseHeight);

            ctx.font = "20px Arial";
            ctx.textAlign = "center";

            // Only go if not the 0th step
            if (step && !this.colorPicked){
                console.log(step);
                if( Math.floor(step / this.period) % 2){
                    console.log("set");
                    var textPicker = Math.floor(Math.random() * 3);

                    if( textPicker == 0){
                        this.textColor = "rgb(255, 0, 0)";
                        this.backgroundColor = "rgb(0, 255, 255)";
                    } else if( textPicker == 1){
                        this.textColor = "rgb(0, 255, 0)";
                        this.backgroundColor = "rgb(255, 0, 255)";
                    } else {
                        this.textColor = "rgb(0, 0, 255)";
                        this.backgroundColor = "rgb(255, 255, 0)";
                    }

                    this.colorPicked = true;
                } else {                    
                    this.colorPicked = false;
                    this.textColor = "rgb(0, 0, 0)";
                    this.backgroundColor = "rgb(0, 0, 0)";
                }
            }

            ctx.fillStyle = this.backgroundColor;

            ctx.fillRect(w * bezel, w * bezel, w * (1 - 2 * bezel), h * (screenHeight - bezel - bezel));

            ctx.fillStyle = this.textColor;

            ctx.fillText("DANK MEMES", w / 2, h * screenHeight / 2);


            ctx.restore();
        }
    };

    computerObject.draw(0);
    return computerObject;
};