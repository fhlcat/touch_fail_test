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
        const cellAndBorderWidth = tableInfo.cellWidth + tableInfo.borderWidth;
        const cellAndBorderHeight = tableInfo.cellHeight + tableInfo.borderWidth;

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

const prepareClearCanvas = (canvasInfo) =>
    (context) =>
        () => {
            context.clearRect(0, 0, canvasInfo.width, canvasInfo.height);
        }

const tableInfo = Object.freeze({
    borderWidth: 1,
    borderColor: "#000000",
    cellHeight: 20,
    cellWidth: 20,
    untouchedCellColor: "#FFFFFF",
    touchedCellColor: "#FF0000",
});

const canvasInit = () => {
    const contentCanvas = document.getElementById("content");
    const context = contentCanvas.getContext("2d");
    const canvasInfo = new CanvasInfo(
        contentCanvas.clientWidth,
        contentCanvas.clientHeight
    );

    context.imageSmoothingEnabled = false
    prepareDrawTable(tableInfo)(canvasInfo)(context)();

    return prepareClearCanvas(canvasInfo)(context);
}

let canvasReset = canvasInit()
window.addEventListener("resize", () => {
    canvasReset()
    canvasReset = canvasInit()
})