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

function setTool(selected) {
  tool = selected;
}

function drawShape(x, y) {
  ctx.beginPath();
  let size = document.getElementById("size").value;
  let color1 = document.getElementById("stroke").value;
  ctx.lineWidth = size;
  ctx.strokeStyle = color1;
  switch (tool) {
    case "rectangle":
      ctx.rect(startX, startY, x - startX, y - startY);
      ctx.stroke();
      break;
    case "circle":
      let radius = Math.sqrt((x - startX) ** 2 + (y - startY) ** 2);
      ctx.stroke();
      ctx.arc(startX, startY, radius, 0, Math.PI * 2);
      break;
    case "triangle":
      ctx.moveTo(startX, startY);
      ctx.lineTo(x, y);
      ctx.lineTo(startX - (x - startX), y);
      ctx.closePath();
      ctx.stroke();
      break;
  }
}