// TODO: animage sprite: https://gamedevelopment.tutsplus.com/tutorials/an-introduction-to-spritesheet-animation--gamedev-13099
// TODO: dungeon music: https://www.youtube.com/watch?v=7bx-eThynd8
//                      https://www.youtube.com/watch?v=yO_1ByUPbws

var context;
var rightKey = false;
var leftKey = false;
var upKey = false;
var downKey = false;
var block_x;
var block_y;
var block_h = 32;
var block_w = 32;
var collision;
var obsticles;
var inputDisabled = false;
var dungeonBG_x = -1536;
var dungeonBG_y = -2464;
var canvas = document.querySelector('canvas');
var room_x = 7; // Start room X
var room_y = 3; // Start room Y
var scrollDuration = 2500;
var scrolling = false;

var showRoomCollision = false;
var roomCollisionView = showRoomCollision ? 0.8 : 0.0;

function init() {
  context = canvas.getContext('2d');
  WIDTH = canvas.offsetWidth;
  HEIGHT = canvas.offsetHeight;
  block_x = 240;
  block_y = 240;

  setInterval('draw()', 6);
}

function clearCanvas() {
  context.clearRect(0,0,WIDTH,HEIGHT);
};

obsticles = room[room_x][room_y]; // Start in Room 4,8 ([7][3])

function draw() {
  clearCanvas();

  if (rightKey) {
    block_x += 1;
    collisionDetect();
    if (collision) {
      block_x -= 1;
    }
  }

  else if (leftKey) {
    block_x -= 1;
    collisionDetect();
    if (collision) {
      block_x += 1;
    }
  }

  else if (upKey) {
    block_y -= 1;
    collisionDetect();
    if (collision) {
      block_y += 1;
    }
  }

  else if (downKey) {
    block_y += 1;
    collisionDetect();
    if (collision) {
      block_y -= 1;
    }
  }

  // left wall room scroll
  if (block_x <= 0) {
    leftKey = false;
    inputDisabled = true;
    scrolling = true;

    block_x = WIDTH - block_w - 1;
    canvas.style.backgroundPosition = (dungeonBG_x += canvas.offsetWidth) + 'px ' + dungeonBG_y + 'px';
    canvas.style.transition = 'background-position 2.5s linear';

    room_y -= 1;
    obsticles = room[room_x][room_y];

    setTimeout(function() {
      inputDisabled = false
      scrolling = false;
      console.log('Room: ' + (room_y + 1) + ', ' + (room_x + 1));
    }, scrollDuration)
  }

  // right wall room scroll
  if ((block_x + block_w) >= WIDTH) {
    rightKey = false;
    inputDisabled = true;
    scrolling = true;

    block_x = 1;
    canvas.style.backgroundPosition = (dungeonBG_x -= canvas.offsetWidth) + 'px ' + dungeonBG_y + 'px';
    canvas.style.transition = 'background-position 2.5s linear';

    room_y += 1;
    obsticles = room[room_x][room_y];

    setTimeout(function() {
      inputDisabled = false
      scrolling = false;
      console.log('Room: ' + (room_y + 1) + ', ' + (room_x + 1));
    }, scrollDuration)
  }

  // top wall room scroll
  if (block_y <= 0) {
    upKey = false;
    inputDisabled = true;
    scrolling = true;

    block_y = HEIGHT - block_h - 1;
    canvas.style.backgroundPosition = dungeonBG_x + 'px ' + (dungeonBG_y += canvas.offsetHeight) + 'px';
    canvas.style.transition = 'background-position 2.5s linear';

    room_x -= 1;
    obsticles = room[room_x][room_y];

    setTimeout(function() {
      inputDisabled = false
      scrolling = false;
      console.log('Room: ' + (room_y + 1) + ', ' + (room_x + 1));
    }, scrollDuration)
  }

  // bottom wall room scroll
  if ((block_y + block_h) >= HEIGHT) {
    downKey = false;
    inputDisabled = true;
    scrolling = true;

    block_y = 1;
    canvas.style.backgroundPosition = dungeonBG_x + 'px ' + (dungeonBG_y -= canvas.offsetHeight) + 'px';
    canvas.style.transition = 'background-position 2.5s linear';

    room_x += 1;
    obsticles = room[room_x][room_y];

    setTimeout(function() {
      inputDisabled = false
      scrolling = false;
      console.log('Room: ' + (room_y + 1) + ', ' + (room_x + 1));
    }, scrollDuration);
  }

  // Setup collision
  for (var i = 0; i < obsticles.length; i++) {
    var obstX = obsticles[i][0];
    var obstY = obsticles[i][1];
    var obstW = obsticles[i][2];
    var obstH = obsticles[i][3];

    context.fillStyle = 'rgba(255,0,255,' + roomCollisionView + ')';
    context.fillRect(obstX,obstY,obstW,obstH)
  }

  // Draw Link
  link = new Image();
  link.src = scrolling ? '' : 'images/link-test.gif'; // Hide link if room is scrolling
  context.drawImage(link, block_x, block_y, block_w, block_h); // The magic sauce to move link

  // Reset collision (needed so Link doesn't stick to collision)
  collision = false;

  // TODO: Set-up top of doorways
  context.fillStyle = 'rgba(255, 0, 0, 1)';
  context.fillRect(0, 0, 512, 36);
}

function onKeyDown(e) {
  if (e.keyCode == 39 && inputDisabled === false) {
    rightKey = true;
  }

  else if (e.keyCode == 37 && inputDisabled === false) {
    leftKey = true;
  }

  else if (e.keyCode == 38 && inputDisabled === false) {
    upKey = true;
  }

  else if (e.keyCode == 40 && inputDisabled === false) {
    downKey = true;
  }
}

function onKeyUp(e) {
  if (e.keyCode == 39) {
    rightKey = false;
  }

  else if (e.keyCode == 37) {
    leftKey = false;
  }

  else if (e.keyCode == 38) {
    upKey = false;
  }

  else if (e.keyCode == 40) {
    downKey = false;
  }
}

document.addEventListener('keydown', onKeyDown);
document.addEventListener('keyup', onKeyUp);

function collisionDetect() {
  for (var i = 0; i < obsticles.length; i++) {
    var obstX = obsticles[i][0];
    var obstY = obsticles[i][1];
    var obstW = obsticles[i][2];
    var obstH = obsticles[i][3];

    if (
        block_x + block_w <= obstX || // left?
        block_x >= obstX + obstW || // right?
        block_y + block_h <= obstY || // bottom?
        block_y + 10 >= obstY + obstH // top (+10 to give Link some head room)
      ) {

    } else {
      collision = true;
    }
  }
}

init();