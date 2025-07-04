export class Point {
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
export const searchPointInTable = (tableInfo) =>
    (point) => {
        const cellAndBorderWidth = tableInfo.cellWidth + tableInfo.borderWidth * 2;
        const cellAndBorderHeight = tableInfo.cellHeight + tableInfo.borderWidth * 2;

        const cellPositionX = Math.floor(point.x / cellAndBorderWidth);
        const cellPositionY = Math.floor(point.y / cellAndBorderHeight);

        return new CellPosition(cellPositionX, cellPositionY);
    }

export class CanvasInfo {
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
export const prepareDrawTable = (tableInfo) =>
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
export const prepareTouchCell = (tableInfo) =>
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

