// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process because
// `nodeIntegration` is turned off. Use `preload.js` to
// selectively enable features needed in the rendering
// process.
let showImageFolder = document.getElementById("showImageFolder");
let startButtonDiv = document.getElementById("startButtonDiv");
let timeSelectionDiv = document.getElementById("timeSelectionDiv");
let timeSeletionElement = document.getElementsByName(
  "timeSelected"
) as NodeListOf<HTMLInputElement>;

document.getElementById("dirs").addEventListener("click", () => {
  window.postMessage({
    type: "select-dirs",
  });
});

window.api.receive("imagesToDisplay", (data: any) => {
  let startButton = document.createElement("button");
  let imgList = document.createElement("ul");
  //let selectTimer = document.createElement("select");
  let timePossible = [30000, 60000, 120000, 300000];
  let timerSelected: string;
  let isImgSeleted = new Array();

  for (const [key, time] of timePossible.entries()) {
    let timeOption = document.createElement("input");
    let timeLabel = document.createElement("label");
    timeOption.setAttribute("type", "radio");
    timeOption.setAttribute("id", "time:" + time);
    timeOption.setAttribute("name", "timeSelected");
    timeOption.setAttribute("value", time.toString());
    if (key === 0) {
      timeOption.checked = true;
    }
    timeLabel.setAttribute("for", "time:" + time);
    timeLabel.textContent = (time / 1000).toString();
    timeSelectionDiv.appendChild(timeOption);
    timeSelectionDiv.appendChild(timeLabel);
  }

  startButton.setAttribute("type", "button");
  startButton.textContent = "Start";
  startButton.setAttribute("id", "startButton");
  startButton.addEventListener("click", () => {
    let imgToSend = new Array();
    for (const time of timeSeletionElement) {
      if (time.checked) {
        timerSelected = time.value;
        console.log(timerSelected);
      }
    }
    for (const check of isImgSeleted) {
      if (check.checked) {
        imgToSend.push(
          document
            .getElementById("img" + check.id.slice(-1))
            .getAttribute("src")
        );
      }
    }
    if (imgToSend.length > 0) {
      startImageScrolling(imgToSend, parseInt(timerSelected));
    } else {
      alert("You need to select at least one image.");
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
  } else if (!imgList.childElementCount && startButtonDiv.childElementCount) {
    startButtonDiv.removeChild(startButtonDiv.lastChild);
  }
});

function startImageScrolling(imgList: string[], durationTimer: number) {
  document.getElementById("selectFolderDiv").style.display = "none";
  showImageFolder.innerHTML = "";
  startButtonDiv.innerHTML = "";
  let imagePlace = document.createElement("img");
  let x = 0;
  let timer = durationTimer/1000;
  let timerDiv = document.createElement("div");
  showImageFolder.appendChild(timerDiv);
  showImageFolder.appendChild(imagePlace);
  imagePlace.setAttribute("src", imgList[x]);
  let imgTimer = setInterval(() => {

    timerDiv.innerHTML = (timer - 1).toString();
    timer--;
    console.log(imgList.length - 1);
    imagePlace.setAttribute("src", imgList[x]);

    if (timer < 0) {
      x++;
      timer = durationTimer/1000;
      if (x > imgList.length - 1) {
        imagePlace.remove();
        timerDiv.remove();
        document.getElementById("selectFolderDiv").style.display = "block";
        clearInterval(imgTimer);
      }
    }
  }, 1000);
}
