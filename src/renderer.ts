// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process because
// `nodeIntegration` is turned off. Use `preload.js` to
// selectively enable features needed in the rendering
// process.
let showImageFolder = document.getElementById("showImageFolder");
let startButtonDiv = document.getElementById("startButtonDiv");

document.getElementById("dirs").addEventListener("click", () => {
  window.postMessage({
    type: "select-dirs",
  });
});

window.api.receive("imagesToDisplay", (data: any) => {

  let startButton = document.createElement("button");
  let imgList = document.createElement("ul");

  let isImgSeleted = new Array(); 

  startButton.setAttribute("type", "button");
  startButton.textContent = "Start";
  startButton.setAttribute("id", "startButton");
  startButton.addEventListener("click", () => {

    let imgToSend = new Array();
    for (const check of isImgSeleted) {
        if (check.checked) { 
            imgToSend.push(document.getElementById("img" + check.id.slice(-1)).getAttribute("src"));
        }
    }    
    if(imgToSend.length > 0){
        startImageScrolling(imgToSend, 5000);
    }  else{
        alert("You need to select at least one image.")
    }
  });
  let x = 0;

  for (const img of data) {
    let listElement = document.createElement("li");
    let image = document.createElement("img");
    let checkbox = document.createElement("input");
    let label = document.createElement("label");

    let id = "cb" + x;

    checkbox.setAttribute("type", "checkbox");
    checkbox.setAttribute("id", id);
    isImgSeleted.push(checkbox);

    label.setAttribute("for", id);
    image.setAttribute("src", img);
    image.setAttribute("id", "img" + x);

    label.appendChild(image);
    listElement.appendChild(checkbox);
    listElement.appendChild(label);
    imgList.appendChild(listElement);
    x++;
  }
  
  for (const child of showImageFolder.children) {
    showImageFolder.removeChild(child);
  }
  showImageFolder.appendChild(imgList);

  if (imgList.childElementCount && !startButtonDiv.childElementCount) {
    startButtonDiv.appendChild(startButton);
  } else if (!imgList.childElementCount && startButtonDiv.childElementCount ) {
    startButtonDiv.removeChild(startButtonDiv.lastChild);
  }
});

function startImageScrolling(imgList: string[], durationTimer: number) {
    showImageFolder.innerHTML = "";
    startButtonDiv.innerHTML = "";
    let imagePlace = document.createElement('img');
    let x = 0;
    showImageFolder.appendChild(imagePlace);
    imagePlace.setAttribute("src", imgList[x]);
    let imgTimer = setInterval(() => {
        x++;
        imagePlace.setAttribute("src", imgList[x]);
        if(x >= imgList.length - 1){
            setTimeout(() => {showImageFolder.innerHTML = "";}, durationTimer)
            clearInterval(imgTimer);
        }
    }, durationTimer)
}