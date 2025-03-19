import { Application, Point } from "pixi.js";
import { GettingInteractive } from "./GettingInteractive";
import { CollisionDetection } from "./CollisionDetection";

(async () => {
    // Create a new application
    const app = new Application();
    
    // Initialize the application
    await app.init({ 
        background: "#1099bb", 
        resizeTo: window 
    });

    // Append the application canvas to the pixi-container
    document.getElementById("pixi-container")!.appendChild(app.canvas);

    // Create and add our interactive scene
    const scene = new GettingInteractive(app.screen.width, app.screen.height);
    app.stage.addChild(scene);

    // Create collision detection scene
    const collisionScene = new CollisionDetection();
    app.stage.addChild(collisionScene);

    // Create example shapes for collision detection
    const circle = collisionScene.createCircle(400, 300, 40, 0xFF0000);  // Red circle
    const square = collisionScene.createSquare(600, 300, 80, 0x00FF00);  // Green square
    const polygon = collisionScene.createPolygon([
        new Point(200, 200),
        new Point(300, 200),
        new Point(250, 300)
    ], 0x0000FF);  // Blue triangle

    // Add a static circle
    const staticCircle = collisionScene.createCircle(100, 100, 30, 0xFF00FF);  // Magenta circle

    // Movement speeds and directions
    const speeds = {
        circle: { x: 2, y: 2 },
        square: { x: -1.5, y: 1.5 },
        polygon: { x: 1, y: -1 }
    };

    // Add animation to test collisions
    app.ticker.add(() => {
        // Move circle in a circular path
        const time = Date.now() / 1000;
        circle.x = 400 + Math.cos(time) * 150;
        circle.y = 300 + Math.sin(time) * 150;

        // Move square
        square.x += speeds.square.x;
        square.y += speeds.square.y;

        // Move polygon
        polygon.x += speeds.polygon.x;
        polygon.y += speeds.polygon.y;

        // Bounce off screen edges
        // Square bounce
        if (square.x < 0 || square.x > app.screen.width) speeds.square.x *= -1;
        if (square.y < 0 || square.y > app.screen.height) speeds.square.y *= -1;

        // Polygon bounce
        if (polygon.x < 0 || polygon.x > app.screen.width) speeds.polygon.x *= -1;
        if (polygon.y < 0 || polygon.y > app.screen.height) speeds.polygon.y *= -1;

        // Check collisions between all shapes
        // Circle with Square
        if (collisionScene.checkCircleCollision(circle, square)) {
            console.log("Circle collides with square!");
            square.fill({ color: 0xFF0000 }); // Change color when colliding
            speeds.square.x *= -1; // Reverse direction on collision
            speeds.square.y *= -1;
        } else {
            square.fill({ color: 0x00FF00 }); // Reset color
        }

        // Circle with Polygon
        if (collisionScene.checkCirclePolygonCollision(circle, polygon)) {
            console.log("Circle collides with polygon!");
            polygon.fill({ color: 0xFF0000 }); // Change color when colliding
            speeds.polygon.x *= -1; // Reverse direction on collision
            speeds.polygon.y *= -1;
        } else {
            polygon.fill({ color: 0x0000FF }); // Reset color
        }

        // Circle with Static Circle
        if (collisionScene.checkCircleCollision(circle, staticCircle)) {
            console.log("Circle collides with static circle!");
            staticCircle.fill({ color: 0xFF0000 }); // Change color when colliding
        } else {
            staticCircle.fill({ color: 0xFF00FF }); // Reset color
        }

        // Square with Polygon
        if (collisionScene.checkSquareCollision(square, polygon)) {
            console.log("Square collides with polygon!");
            speeds.square.x *= -1;
            speeds.square.y *= -1;
            speeds.polygon.x *= -1;
            speeds.polygon.y *= -1;
        }

        // Square with Static Circle
        if (collisionScene.checkCircleSquareCollision(staticCircle, square)) {
            console.log("Square collides with static circle!");
            speeds.square.x *= -1;
            speeds.square.y *= -1;
        }

        // Polygon with Static Circle
        if (collisionScene.checkCirclePolygonCollision(staticCircle, polygon)) {
            console.log("Polygon collides with static circle!");
            speeds.polygon.x *= -1;
            speeds.polygon.y *= -1;
        }
    });
})(); 