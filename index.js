import {CanvasInfo, Point, prepareDrawTable, prepareTouchCell, searchPointInTable} from "./utils.js";
import {tableInfo} from "./tableInfo.js";

const contentCanvas = document.getElementById("content")
contentCanvas.width = window.innerWidth;
contentCanvas.height = window.innerHeight;
const context = contentCanvas.getContext("2d");
const canvasInfo = new CanvasInfo(
    contentCanvas.clientWidth,
    contentCanvas.clientHeight
);

contentCanvas.addEventListener("touchmove", (event) => {
    event.preventDefault();

    const touch = event.touches[0];
    const point = new Point(touch.clientX, touch.clientY);
    const cellPosition = searchPointInTable(tableInfo)(point);

    prepareTouchCell(tableInfo)(cellPosition)(context)();
});

let touchendCount = -1;
const showTouchFailCount = () => {
    window.alert(`喜报：断触了 ${touchendCount} 次`);
    window.location.reload()
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
