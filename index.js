class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

class CellPosition {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

class Rectangle {
    constructor(startPoint, width, height) {
        this.startPoint = startPoint;
        this.width = width;
        this.height = height;
    }
}

const cellPositionToRange = (tableInfo) =>
    (cellPosition) => {
        const cellAndBorderWidth = tableInfo.cellWidth + tableInfo.borderWidth * 2;
        const cellAndBorderHeight = tableInfo.cellHeight + tableInfo.borderWidth * 2;

        const startX = cellPosition.x * cellAndBorderWidth;
        const startY = cellPosition.y * cellAndBorderHeight;

        return new Rectangle(
            new Point(startX, startY),
            tableInfo.cellWidth,
            tableInfo.cellHeight
        );
    };

const searchPointInTable = (tableInfo) =>
    (point) => {
        const cellAndBorderWidth = tableInfo.cellWidth + tableInfo.borderWidth * 2;
        const cellAndBorderHeight = tableInfo.cellHeight + tableInfo.borderWidth * 2;

        const cellPositionX = Math.floor(point.x / cellAndBorderWidth);
        const cellPositionY = Math.floor(point.y / cellAndBorderHeight);

        return new CellPosition(cellPositionX, cellPositionY);
    }

class CanvasInfo {
    constructor(canvasWidth, canvasHeight) {
        this.width = canvasWidth;
        this.height = canvasHeight;
    }
}

const prepareDrawBackground = (tableInfo) =>
    (canvasInfo) =>
        (context) =>
            () => {
                context.fillStyle = tableInfo.untouchedCellColor;
                context.fillRect(0, 0, canvasInfo.width, canvasInfo.height);
            }

const prepareDrawTable = (tableInfo) =>
    (canvasInfo) =>
        (context) =>
            () => {
                prepareDrawBackground(canvasInfo)(context)();

                const cellAndBorderWidth = tableInfo.cellWidth + tableInfo.borderWidth * 2;
                const cellAndBorderHeight = tableInfo.cellHeight + tableInfo.borderWidth * 2;
                const horizontalCellCount = Math.floor(canvasInfo.width / cellAndBorderWidth) + 1;
                const verticalCellCount = Math.floor(canvasInfo.height / cellAndBorderHeight) + 1;

                for (let i = 0; i < horizontalCellCount; i++) {
                    for (let j = 0; j < verticalCellCount; j++) {
                        const cellPosition = new CellPosition(i, j);
                        const cellRange = cellPositionToRange(tableInfo)(cellPosition);

                        context.strokeStyle = tableInfo.borderColor;
                        context.lineWidth = tableInfo.borderWidth;
                        context.strokeRect(
                            cellRange.startPoint.x,
                            cellRange.startPoint.y,
                            cellRange.width,
                            cellRange.height
                        );
                    }
                }
            }

const prepareTouchCell = (tableInfo) =>
    (cellPosition) =>
        (context) =>
            () => {
                const cellRange = cellPositionToRange(tableInfo)(cellPosition);
                context.fillStyle = tableInfo.touchedCellColor;
                context.fillRect(
                    cellRange.startPoint.x + 1,
                    cellRange.startPoint.y + 1,
                    cellRange.width - 1,
                    cellRange.height - 1
                );
            }

const tableInfo = Object.freeze({
    borderWidth: 1,
    borderColor: "#000000",
    cellHeight: 20,
    cellWidth: 20,
    untouchedCellColor: "#FFFFFF",
    touchedCellColor: "#FF0000",
});

const getCanvasCoordinates = (touch) =>
    (canvas) => {
        const rect = canvas.getBoundingClientRect(); // canvas在视口中的位置和大小
        const scaleX = canvas.width / rect.width;    // 宽度缩放因子
        const scaleY = canvas.height / rect.height;  // 高度缩放因子

        return {
            x: (touch.clientX - rect.left) * scaleX,
            y: (touch.clientY - rect.top) * scaleY
        };
    };


const contentCanvas = document.getElementById("content");
const context = contentCanvas.getContext("2d");
const canvasInfo = new CanvasInfo(
    contentCanvas.clientWidth,
    contentCanvas.clientHeight
);

const handleTouchMove = (event) => {
    event.preventDefault();

    const touch = event.touches[0];
    const coordinates = getCanvasCoordinates(touch)(contentCanvas);
    const point = new Point(coordinates.x, coordinates.y);
    const cellPosition = searchPointInTable(tableInfo)(point);

    prepareTouchCell(tableInfo)(cellPosition)(context)();
}
contentCanvas.addEventListener("touchmove", handleTouchMove);

let touchendCount = -1;
const showTouchFailCount = () => {
    window.alert(`喜报：断触了 ${touchendCount} 次`);
}
let timeoutNumber;
contentCanvas.addEventListener("touchstart", () => {
    clearTimeout(timeoutNumber)
})
contentCanvas.addEventListener("touchend", () => {
    touchendCount++;
    timeoutNumber = setTimeout(showTouchFailCount, 1000);
})

prepareDrawTable(tableInfo)(canvasInfo)(context)();
