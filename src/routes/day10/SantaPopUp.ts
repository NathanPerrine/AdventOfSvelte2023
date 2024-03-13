
export function santaPopup() {
  let count = 1
  $: count
  let countDown = setInterval(() => {
    if (count > 0){
      count--
    } else {
      clearInterval(countDown)
      if (typeof window !== 'undefined'){
        alert("Message from Santa.")
      }
    }

  }, 1000)
}
