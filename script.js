const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const slider = document.getElementById("volumeSlider");
const output = document.getElementById("sliderValue");

slider.oninput = function() {
  output.textContent = this.value;
}

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let drawing = false;
let tool = "brush";
let startX, startY;

let historystack=[];
function savestate() {
  historystack.push(canvas.toDataURL());
}

window.onload = () => {
  const saved = localStorage.getItem("canvasData");
  if (saved) {
    const img = new Image();
    img.src = saved;
    img.onload = () => ctx.drawImage(img, 0, 0);
  }

  const theme = localStorage.getItem("theme");
  if (theme === "dark") {
    document.body.classList.add("dark");
  }
};

canvas.addEventListener("mousedown", (e) => {
  drawing = true;
  startX = e.offsetX;
  startY = e.offsetY;
});

canvas.addEventListener("mouseup", (e) => {
  drawing = false;
  if (tool !== "brush" && tool !== "erase") drawShape(e.offsetX, e.offsetY);
  ctx.stroke();
  ctx.beginPath();
  savestate();
  saveCanvas();
});

canvas.addEventListener("mousemove", (e) => {
  if (!drawing || (tool !== "brush" && tool != "erase")) return;
  let size = document.getElementById("volumeSlider").value;
  let color1 = document.getElementById("stroke").value;
  if(tool==="brush"){
  ctx.lineWidth = size;
  ctx.lineCap = "round";
  ctx.strokeStyle = color1;
  ctx.lineTo(e.offsetX, e.offsetY);
  ctx.stroke();
  ctx.moveTo(e.offsetX, e.offsetY);
  }
  else if(tool==="erase") {
    ctx.clearRect(e.offsetX-size/2, e.offsetY-size/2, 2*size, 2*size);
  }
});

function getTouchPos(touchEvent) {
  const rect = canvas.getBoundingClientRect();
  return {
    x: touchEvent.touches[0].clientX - rect.left,
    y: touchEvent.touches[0].clientY - rect.top
  };
}

canvas.addEventListener("touchstart", (e) => {
  e.preventDefault();
  drawing = true;
  const pos = getTouchPos(e);
  startX = pos.x;
  startY = pos.y;
});

canvas.addEventListener("touchmove", (e) => {
  e.preventDefault();
  if (!drawing || (tool !== "brush" && tool !== "erase") ) return;
  if(tool==="brush"){
  const pos = getTouchPos(e);
  let size = document.getElementById("volumeSlider").value;
  let color1 = document.getElementById("stroke").value;
  ctx.lineWidth = size;
  ctx.lineCap = "round";
  ctx.strokeStyle = color1;
  ctx.lineTo(pos.x, pos.y);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(pos.x, pos.y);
  }
  else if(tool==="erase"){
    ctx.clearRect(pos.X-size/2, pos.Y-size/2, 2*size, 2*size);
  }
});

canvas.addEventListener("touchend", (e) => {
  drawing = false;
  if (tool !== "brush" && tool !== "erase") {
    const pos = getTouchPos(e.changedTouches[0] ? { touches: [e.changedTouches[0]] } : e);
    drawShape(pos.x, pos.y);
  }
  ctx.beginPath();
  savestate();
  saveCanvas();
});

function setTool(selected) {
  tool = selected;
}

function drawShape(x, y) {
  ctx.beginPath();
  let size = document.getElementById("volumeSlider").value;
  let color1 = document.getElementById("stroke").value;
  ctx.lineWidth = size;
  ctx.strokeStyle = color1;
  if(tool==="rectangle"){
      ctx.rect(startX, startY, x - startX, y - startY);
  }
  else if(tool==="circle"){
      let radius = Math.sqrt((x - startX) ** 2 + (y - startY) ** 2);
      ctx.arc(startX, startY, radius, 0, Math.PI * 2);
  }
  else if(tool==="triangle"){
      ctx.moveTo(startX, startY);
      ctx.lineTo(x, y);
      ctx.lineTo(startX - (x - startX), y);
      ctx.closePath();
  }
      ctx.stroke();
      savestate();
      saveCanvas();
}

function saveCanvas() {
  localStorage.setItem("canvasData", canvas.toDataURL());
}

function clearCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  localStorage.removeItem("canvasData");
}

function toggleDarkMode() {
  document.body.classList.toggle("dark");
  if (document.body.classList.contains("dark")) {
    localStorage.setItem("theme", "dark");
  }
  else {
    localStorage.setItem("theme", "light");
  }
}

let userImg = null;

function placeImage() {
  const x = parseInt(document.getElementById("xCoord").value);
  const y = parseInt(document.getElementById("yCoord").value);
  const size = document.getElementById("imageSize").value;

  if (!userImg) {
    userImg = new Image();
    userImg.crossOrigin = "anonymous";
    userImg.src = "https://picsum.photos/200?random=" + Math.random();
    userImg.onload = () => {
      ctx.drawImage(userImg, x, y, size, size);
      savestate();
      saveCanvas();
    };
  } else {
    ctx.drawImage(userImg, x, y, size, size);
    savestate();
    saveCanvas();
  }
}

function undo() {
  if(historystack.length>0){
    historystack.pop();
    let Data = historystack[historystack.length - 1];
    if (Data) {
      let img = new Image();
      img.src = Data;
      img.onload = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
      };
    }
    else clearCanvas();
  }
}

function toggleButton(button, selectedTool) {
  const button1 = document.querySelectorAll("button");
  button1.forEach(btn => {
    btn.dataset.clicked = "false";
    btn.classList.remove("active");
  });
  button.dataset.clicked = "true";
  button.classList.add("active");
  setTool(selectedTool);
}
