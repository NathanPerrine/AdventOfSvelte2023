
export function santaPopup() {
  let count = 1
  $: count
  let countDown = setInterval(() => {
    if (count > 0){
      count--
    } else {
      clearInterval(countDown)
      if (typeof window !== 'undefined'){
        // alert("Message from Santa.")
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
        overlayDiv.onclick = function() {
          let overlay = document.getElementById("overlay")
          if (overlay) {
            overlay.style["display"] = "none"
          }
        }

        document.body.appendChild(overlayDiv)
      }
    }

  }, 1000)
}
