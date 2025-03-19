import { Container, Graphics, Point } from "pixi.js";

export class CollisionDetection extends Container {
    private shapes: Graphics[] = [];

    constructor() {
        super();
    }

    // Tạo hình tròn
    createCircle(x: number, y: number, radius: number, color: number = 0xFF0000): Graphics {
        const circle = new Graphics();
        circle.fill({ color });
        circle.circle(0, 0, radius);
        circle.x = x;
        circle.y = y;
        this.addChild(circle);
        this.shapes.push(circle);
        return circle;
    }

    // Tạo hình vuông
    createSquare(x: number, y: number, size: number, color: number = 0x00FF00): Graphics {
        const square = new Graphics();
        square.fill({ color });
        square.rect(-size/2, -size/2, size, size);
        square.x = x;
        square.y = y;
        this.addChild(square);
        this.shapes.push(square);
        return square;
    }

    // Tạo hình đa giác
    createPolygon(points: Point[], color: number = 0x0000FF): Graphics {
        const polygon = new Graphics();
        polygon.fill({ color });
        polygon.moveTo(points[0].x, points[0].y);
        for (let i = 1; i < points.length; i++) {
            polygon.lineTo(points[i].x, points[i].y);
        }
        polygon.closePath();
        this.addChild(polygon);
        this.shapes.push(polygon);
        return polygon;
    }

    // Kiểm tra va chạm giữa hai hình tròn
    checkCircleCollision(circle1: Graphics, circle2: Graphics): boolean {
        const dx = circle1.x - circle2.x;
        const dy = circle1.y - circle2.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const radius1 = circle1.width / 2;
        const radius2 = circle2.width / 2;
        return distance < (radius1 + radius2);
    }

    // Kiểm tra va chạm giữa hai hình vuông
    checkSquareCollision(square1: Graphics, square2: Graphics): boolean {
        const size1 = square1.width;
        const size2 = square2.width;
        
        return square1.x < square2.x + size2 &&
               square1.x + size1 > square2.x &&
               square1.y < square2.y + size2 &&
               square1.y + size1 > square2.y;
    }

    // Kiểm tra va chạm giữa hình tròn và hình vuông
    checkCircleSquareCollision(circle: Graphics, square: Graphics): boolean {
        const squareSize = square.width;
        const circleRadius = circle.width / 2;
        
        // Tìm điểm gần nhất trên hình vuông đến tâm hình tròn
        const closestX = Math.max(square.x - squareSize/2, Math.min(circle.x, square.x + squareSize/2));
        const closestY = Math.max(square.y - squareSize/2, Math.min(circle.y, square.y + squareSize/2));
        
        // Tính khoảng cách từ điểm gần nhất đến tâm hình tròn
        const distanceX = circle.x - closestX;
        const distanceY = circle.y - closestY;
        const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);
        
        return distance < circleRadius;
    }

    // Kiểm tra va chạm giữa hình tròn và đa giác
    checkCirclePolygonCollision(circle: Graphics, polygon: Graphics): boolean {
        const circleRadius = circle.width / 2;
        const bounds = polygon.getBounds();
        
        // Kiểm tra va chạm với bounding box trước
        if (!this.checkCircleSquareCollision(circle, polygon)) {
            return false;
        }
        
        // Lấy các điểm của đa giác từ bounds
        const points = [
            new Point(bounds.left, bounds.top),
            new Point(bounds.right, bounds.top),
            new Point(bounds.right, bounds.bottom),
            new Point(bounds.left, bounds.bottom)
        ];
        
        // Kiểm tra va chạm với từng cạnh của đa giác
        for (let i = 0; i < points.length; i++) {
            const start = points[i];
            const end = points[(i + 1) % points.length];
            
            const distance = this.distanceToLine(circle.x, circle.y, start.x, start.y, end.x, end.y);
            if (distance < circleRadius) return true;
        }
        
        return false;
    }

    // Tính khoảng cách từ điểm đến đoạn thẳng
    private distanceToLine(px: number, py: number, x1: number, y1: number, x2: number, y2: number): number {
        const A = px - x1;
        const B = py - y1;
        const C = x2 - x1;
        const D = y2 - y1;

        const dot = A * C + B * D;
        const lenSq = C * C + D * D;
        let param = -1;

        if (lenSq !== 0) {
            param = dot / lenSq;
        }

        let xx, yy;

        if (param < 0) {
            xx = x1;
            yy = y1;
        } else if (param > 1) {
            xx = x2;
            yy = y2;
        } else {
            xx = x1 + param * C;
            yy = y1 + param * D;
        }

        const dx = px - xx;
        const dy = py - yy;
        return Math.sqrt(dx * dx + dy * dy);
    }

    // Lấy danh sách các hình
    getShapes(): Graphics[] {
        return this.shapes;
    }
}
