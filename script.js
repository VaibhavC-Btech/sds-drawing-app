const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const canvasOffsetX = canvas.offsetLeft;
const canvasOffsetY = canvas.offsetTop;

canvas.width = window.innerWidth - canvasOffsetX;
canvas.height = window.innerHeight - canvasOffsetY;

let drawing = false;
let tool = "brush";
let startX, startY;

canvas.addEventListener("mousedown", (e) => {
  drawing = true;
  startX = e.offsetX;
  startY = e.offsetY;
});

canvas.addEventListener("mouseup", (e) => {
  drawing = false;
  if (tool !== "brush") drawShape(e.offsetX, e.offsetY);
  ctx.stroke();
  ctx.beginPath();
  savestate();
  saveCanvas();
});

canvas.addEventListener("mousemove", (e) => {
  if (!drawing || tool !== "brush") return;
  let size = document.getElementById("size").value;
  let color1 = document.getElementById("stroke").value;
  ctx.lineWidth = size;
  ctx.lineCap = "round";
  ctx.strokeStyle = color1;
  ctx.lineTo(e.offsetX, e.offsetY);
  ctx.stroke();
  ctx.moveTo(e.offsetX, e.offsetY);
});