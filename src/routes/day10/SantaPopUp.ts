
export function santaPopup(time: number = 10, message: string = "Message goes here") {
  let countDown = setInterval(() => {
    if (time > 0) {
      time--
    } else {
      clearInterval(countDown)
      createOverlayDiv()
    }
  }, 1000)

  function createOverlayDiv() {
    if (typeof window !== 'undefined') {
      const overlayDiv = document.createElement("div");
      overlayDiv.id = "overlay"
      overlayDiv.style.position = "fixed";
      // overlayDiv.style.display = "none";
      overlayDiv.style.width = "100%";
      overlayDiv.style.height = "100%";
      overlayDiv.style.top = "0";
      overlayDiv.style.left = "0";
      overlayDiv.style.right = "0";
      overlayDiv.style.bottom = "0";
      // overlayDiv.style.background-color = "0";
      overlayDiv.style["backgroundColor"] = "rgba(0,0,0,0.5)";
      overlayDiv.style["zIndex"] = "2";
      overlayDiv.style["cursor"] = "pointer"
      overlayDiv.onclick = function () {
        let overlay = document.getElementById("overlay")
        if (overlay) {
          overlay.style["display"] = "none"
        }
      }

      // overlay message box
      const overlayMessageBox = document.createElement("div");
      overlayMessageBox.id = "overlayMessageBox";
      overlayMessageBox.style["width"]= "250px";
      overlayMessageBox.style["height"]= "250px";

      overlayMessageBox.style["position"]= "fixed";
      overlayMessageBox.style["top"]= "50%";
      overlayMessageBox.style["left"]= "50%";
      overlayMessageBox.style["transform"]= "translate(-50%, -50%)";
      overlayMessageBox.style["padding"] = "8px";

      overlayMessageBox.style["backgroundColor"] = "#235E6F";
      overlayMessageBox.style["borderLeft"] = "2px solid #F5624D";
      overlayMessageBox.style["borderTop"] = "2px solid #CC231E";
      overlayMessageBox.style["borderRight"] = "2px solid #34A65F";
      overlayMessageBox.style["borderBottom"] = "2px solid #0F8A5F";
      overlayMessageBox.style["borderRadius"] = "25px";


      // overlay message
      const overlayMessage = document.createElement("p");
      overlayMessage.id = "overlayMessage";
      overlayMessage.innerHTML = message;
      overlayMessage.style["color"] = "black";
      overlayMessageBox.appendChild(overlayMessage)








      overlayDiv.appendChild(overlayMessageBox)
      document.body.appendChild(overlayDiv)
    }
  }
}
