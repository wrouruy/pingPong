const cvs = document.getElementById('canvas');
const ctx = cvs.getContext('2d');
[cvs.width, cvs.height] = [window.innerWidth, window.innerHeight];

// import Image
const ballImg = new Image()
ballImg.src = './img/ball.png';


document.addEventListener('keydown', function(e){
    if(platform.isDied) this.location.reload()
    if(e.key === 'ArrowUp' || e.keyCode == 87) platform.moveUp = true;
    if(e.key === 'ArrowDown' || e.keyCode == 83) platform.moveDown = true;
})
document.addEventListener('keyup', function(e){
    if(e.key === 'ArrowUp' || e.keyCode == 87) platform.moveUp = false;
    if(e.key === 'ArrowDown' || e.keyCode == 83) platform.moveDown = false;
})

// add game element
const platform = {
    x: (-cvs.width / 2) + 10,
    y: -125,
    width: 30,
    height: 250,
    score: 0,
    isDied: false,
    moveUp: false,
    moveDown: false
}

const ball = {
    x: -cvs.width / 2,
    y: 0,
    diameter: 40,
    angle: -50 * (Math.PI / 180),
    ricochetX: 1,
    ricochetY: 1
}
ball.x = ball.x + Math.cos(ball.angle) + platform.width;
ball.y = ball.y + Math.sin(ball.angle) * 50;


function draw(){
    [cvs.width, cvs.height] = [window.innerWidth, window.innerHeight];
    ctx.translate(cvs.width / 2, cvs.height / 2);
    ctx.clearRect(-cvs.width / 2, -cvs.height / 2, cvs.width / 2, cvs.height / 2)

    if(platform.y > -cvs.height / 2 && platform.y < cvs.height / 2){
        if(platform.moveUp) platform.y -= 15;
    }
    if(platform.y < cvs.height / 2 && platform.y + platform.height < cvs.height / 2){
        if(platform.moveDown) platform.y += 15; 
    }

    platform.x = -cvs.width / 2 + 10;

    // move ball
    ball.x += (Math.cos(ball.angle) * 15) * ball.ricochetX;
    ball.y += (Math.sin(ball.angle) * 15) * ball.ricochetY;

    // collision ball with window
    if(ball.x + ball.diameter > cvs.width / 2) { ball.ricochetX *= -1; new Audio('./audio/rebound.wav').play() }
    if(ball.y < -cvs.height / 2 || ball.y + ball.diameter > cvs.height / 2) { ball.ricochetY *= -1; new Audio('./audio/rebound.wav').play() }

    // died ball
    if(ball.x < -cvs.width / 2){
        platform.isDied = true;
        ctx.font = `${cvs.height / 10}px Silkscreen`;
        ctx.fillText('Game Over!', 0 - ctx.measureText("Game Over!").width/2, 0)
    }

    // collision ball with platform
    if (
        ball.y + ball.diameter >= platform.y &&
        ball.y <= platform.y + platform.height &&
        ball.x + ball.diameter >= platform.x &&
        ball.x <= platform.x + platform.width
    ) {
        platform.score++;
        ball.ricochetX *= -1;
        new Audio('./audio/rebound.wav').play()
    }
    
    ctx.font = `${cvs.height / 20}px Silkscreen`;
    ctx.fillText(`${platform.score} : 0`, 0 - ctx.measureText(platform.score).width, -cvs.height / 2 + 70)
    ctx.fillRect(platform.x, platform.y, platform.width, platform.height); // draw platform
    ctx.drawImage(ballImg, ball.x, ball.y, ball.diameter, ball.diameter); // draw ball

    requestAnimationFrame(draw);
}
document.onload = draw();