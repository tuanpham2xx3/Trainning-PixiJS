import * as PIXI from 'pixi.js';
import { Application, Assets, Sprite } from "pixi.js";
import { BitmapText } from 'pixi.js';
import { Tween, Group, Easing } from "@tweenjs/tween.js";

(async () => {
  
  // Create a new application
  const app = new Application();
  // Initialize the application
  await app.init({ 
    background: "#1099bb", 
    resizeTo: window, });

    // Append the application canvas to the document body
  document.getElementById("pixi-container")!.appendChild(app.canvas);

  var conty = new PIXI.Container();
  conty.x = 0;
  conty.y = 0;
  app.stage.addChild(conty);

  const texture = await Assets.load("/assets/bunny.png");

  var clampy = new Sprite(texture);
  clampy.x = 100;
  clampy.y = 100;
  conty.addChild(clampy);
  clampy.anchor.set(0.5);

  // Move the sprite to the center of the screen
  clampy.position.set(app.screen.width / 2, app.screen.height / 2);

  // Add the bunny to the stage
  app.stage.addChild(clampy);
  // Listen for animate update
  app.ticker.add((time) => {
    clampy.rotation += 0.1 * time.deltaTime;
  });

  //CONTAINER
  var bigConty = new PIXI.Container();
  bigConty.scale.set(2);
  bigConty.position.x = 100;
  bigConty.y = 200; // viet tat voi y ma khong can position
  app.stage.addChild(bigConty);

  var littleConty = new PIXI.Container();
  littleConty.position = new PIXI.Point(300,200);
  bigConty.addChild(littleConty);

  // Graphics
  const graphics = new PIXI.Graphics();
  graphics
  .circle(100, 100, 50)                      // Tọa độ tâm (100,100) và bán kính 50
  .fill('blue')                              // Tô màu xanh dương
  .stroke({width: 2, color: 'white'});       // Viền trắng với độ dày 2px
  app.stage.addChild(graphics);

  //TEXT
  const text = new PIXI.Text({
    text: 'HELLO PIXI SIU',
    style: {
      fontFamily: 'Arial',
      fontSize: 24,
      fill: 0xff1010,
      align: 'center',
    }
  });
  app.stage.addChild(text);
  text.x = 200;
  text.y = 200;

  //BITMAP

  PIXI.BitmapFontManager.install({
    name: "comic-32",
    style: {
        fill: "#ffffff",
        fontFamily: "Comic Sans MS",
        fontSize: 32
    },
    chars: PIXI.BitmapFontManager.ASCII // Sử dụng BitmapFontManager.ASCII
});
// Cách đúng để tạo BitmapText trong PixiJS v8
  const bitmapText = new BitmapText({
    text: "Tôi thích lập trình với PixiJS",
    style: {
        fontFamily: "comic-32", // Thay vì fontName
        fontSize: 32
    }
  });
// Thêm vào stage
  app.stage.addChild(bitmapText);
  bitmapText.x = 400;
  bitmapText.y = 600;
  bitmapText.text = "EDITED BITMAP SUCCESSFULL";

  // Tạo filter
  var myBlurFilter = new PIXI.BlurFilter();

// Thêm vào mảng `.filters` của bất kỳ DisplayObject nào
  clampy.filters = [myBlurFilter];

  const clampyFrames = [
    "clampy_sequence_01.png",
    "clampy_sequence_02.png",
    "clampy_sequence_03.png",
    "clampy_sequence_04.png"
  ];
  
  // Chuyển đổi mảng chuỗi thành mảng Texture
  const textures = clampyFrames.map(path => PIXI.Texture.from(path));
  
  // Tạo AnimatedSprite
  const animatedClampy = new PIXI.AnimatedSprite(textures);
  
  // Thêm vào stage
  app.stage.addChild(animatedClampy);
  
  // Bắt đầu phát animation
  animatedClampy.play();

  // Sử dụng Ticker.shared có sẵn
  PIXI.Ticker.shared.add((deltaTime) => {
  // deltaTime: số frame đã trôi qua ở 60fps
  // Ví dụ: deltaTime = 1 nghĩa là đang chạy ở 60fps
  //        deltaTime = 2 nghĩa là đang chạy ở 30fps
  
  // // Di chuyển sprite theo vận tốc
  //   sprite.x += velocity * deltaTime;
  
  // // Kiểm tra nếu sprite đi ra ngoài màn hình
  // if (sprite.x > screenWidth) {
  //     sprite.x = 0;
  // }
});
  // Đối tượng cần animation
const sprite = new PIXI.Sprite(PIXI.Texture.WHITE);
sprite.position.set(0, 100);
app.stage.addChild(sprite);

// Tạo tween
const tween = new Tween(sprite.position)
    .to({ x: 300 }, 2000) // Di chuyển đến x=300 trong 2 giây
    .easing(Easing.Elastic.Out) // Sử dụng hiệu ứng elastic
    .repeat(5) // Lặp lại 5 lần
    .yoyo(true) // Đảo ngược mỗi lần lặp
    .start();

// Cập nhật tweens trong game loop
// app.ticker.add(() => {
//     Group.call
// });


})();
