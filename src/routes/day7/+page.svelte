<script lang="ts">
	import Title from '$lib/components/Title.svelte';
	import Icon from '@iconify/svelte';
	import { SvelteComponentTyped, onMount } from 'svelte';

  // Alternate morse code translation types
  // 1) char.charCodeAt(0)-97 - gives the number value (a = 0, b = 1, etc) for a character, you can use that to refernce an array of morse code values to construct the sentence. Downside: outside of general english alphabet it falls apart, needing other arrays and logic to handle alternate characters, even numbers.

  // const morseCodeArray =[
  //   '.-', '-...', '-.-.', '-..', '.', '..-.', '--.', '....',
  //   '..', '.---', '-.-', '.-..', '--', '-.', '---', '.--.',
  //   '--.-', '.-.', '...', '-', '..-', '...-', '.--', '-..-',
  //   '-.--', '--..'
  // ];
  // const morseCodeNumbers = [
  //   '-----', '.----', '..---', '...--', '....-', '.....', '-....', '--...', '---..', '----.'
  // ]

  // 2) Morse code object, where every key is a character and the value is that characters morse code equivalent. Downside: Hard to get the key by value, have to use something like the following function.
  // function getKeyByValue(object, value) {
    // return Object.keys(object).find(key => object[key] === value);
  // }
  // console.log(getKeyByValue(morseCode, '.-'))

  // 3) Array of tuples: [['a', ',-'], etc], easy to add to, but have to loop through the array for every character.


  interface morseCodeInterface { [index: string]: string}
  const morseCode: morseCodeInterface = {
    'a': '.-', 'b': '-...',  'c': '-.-.', 'd': '-..', 'e': '.', 'f': '..-.',  'g': '--.',  'h': '....', 'i': '..', 'j': '.---', 'k': '-.-', 'l': '.-..', 'm': '--', 'n': '-.', 'o': '---', 'p': '.--.', 'q': '--.-', 'r': '.-.', 's': '...', 't': '-', 'u': '..-', 'v': '...-', 'w': '.--', 'x': '-..-', 'y': '-.--', 'z': '--..',
    '1': '.----', '2': '..---', '3': '...--', '4': '....-', '5': '.....', '6': '-....', '7': '--...', '8': '---..', '9': '----.', '0': '-----',
    ' ': ' ', '?': '..--..', '!': '-.-.--', '.': '.-.-.-', ',':'--..--', ';': '-.-.-.', ':': '---...', '+': '.-.-.', '-': '-....-', '/': '-..-.', '=': '-...-'
  }

  let userEngSentence: string
  let morseCodeOutput: string = ''
  let translateType: 'eng' | 'morse' = 'eng'
  let userMorseSentence: string
  let englishOutput: string = ''

  function updateMorseCodeOutput(){
    morseCodeOutput = ''
    for (const char of userEngSentence) {
      if (char != ' '){
        morseCodeOutput += morseCode[char.toLowerCase()] + ' ';
      } else morseCodeOutput += ' ';
    }
  }

  function swapTranslate() {
    if (translateType === 'eng') {
      translateType = 'morse'
    } else if (translateType === 'morse') {
      translateType = 'eng'
    }
  }

  function updateEnglishOutput() {
    englishOutput = ''
    userMorseSentence.split("   ").forEach((morseCodeWord) => {
      morseCodeWord.split(' ').forEach((morseCodeLetter) => {
        if (morseCodeLetter != ''){
          englishOutput += getKeyByValue(morseCode, morseCodeLetter)
        }
      })
      englishOutput += ' '
    })
  }

  function getKeyByValue(object: morseCodeInterface, value: string) {
    return Object.keys(object).find(key => object[key] === value);
  }


  const FREQUENCY = 440;
  const DOT_TIME = 60;
  const LETTER_BREAK = DOT_TIME * 3;
  const WORD_BREAK = DOT_TIME * 10;
  let note_context: AudioContext;
  let note_node: OscillatorNode;
  let gain_node: GainNode;
  let audioContextInitialized = false;
  let stopBeeps = false;

  function initializeAudioContext() {
    note_context = new AudioContext();
    audioContextInitialized = true;
  }

  onMount(() => {
    initializeAudioContext()
  })

  function sleep(ms:number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  function startNote() {
    if (audioContextInitialized) {
      note_node = note_context.createOscillator();
      gain_node = note_context.createGain();
      note_node.frequency.value = parseInt(FREQUENCY.toFixed(2));
      gain_node.gain.value = 0;
      note_node.connect(gain_node);
      gain_node.connect(note_context.destination);
      note_node.start();
    }
    gain_node.gain.setTargetAtTime(0.1, 0, 0.001)
  }
  function stopNote() {
    gain_node.gain.setTargetAtTime(0, 0, 0.001)
  }
  async function playBeep(dotDash: string){
    startNote();
    if (dotDash === 'dot'){
      await sleep(DOT_TIME);
    } else if (dotDash === 'dash'){
      await sleep(DOT_TIME * 3)
    }
    stopNote();
    await sleep(LETTER_BREAK)
  }

  async function play() {
    stopBeeps = false
    for (const char of morseCodeOutput){
      if (!stopBeeps){
        if (char === '.') {
          await playBeep('dot')
        } else if (char === '-'){
          await playBeep('dash')
        } else if (char === ' ') {
          await sleep(WORD_BREAK)
        }
      } else {
        stopBeeps = false
        break;
      }
    }

  }
  function stop() {
    stopBeeps = true
  }
</script>

<section>
	<!-- Title -->
	<Title day={7} />

  <main class="mt-4">
    <div class="w-11/12 sm:w-1/2 p-4 border border-primary rounded-md mx-auto flex flex-col">
      <h2 class="text-xl">Enter your message below:</h2>

      <div class="flex flex-row">
        {#if translateType === 'eng'}
          <input type="text" placeholder="Close the gate" bind:value={userEngSentence} on:input={updateMorseCodeOutput} class="my-2 input input-bordered w-full max-w-xs" />
        {:else if translateType === 'morse'}
          <input type="text" placeholder="-.-. .-.. --- ... . - .... . --. .- - ." bind:value={userMorseSentence} on:input={updateEnglishOutput} class="my-2 input input-bordered w-full max-w-xs" />
        {/if}
        <button class="btn btn-secondary btn-sm self-center mx-2" on:click={swapTranslate}> <Icon icon="iconamoon:swap" width="24px"></Icon> </button>
      </div>


      <div class="divider divider-accent divider-start">Output &darr;</div>
      {#if translateType === 'eng'}
        <p class="text-xl">
          {#if morseCodeOutput == ''}
            Enter a sentence above to translate it into morse code!
          {:else}
            {morseCodeOutput}
          {/if}
        </p>
        {#if audioContextInitialized}
          <div class="flex flex-wrap">
            <button class="btn btn-sm btn-success m-2" on:click={play}>Play <Icon icon="bx:play" width="24px" /> </button>
            <button class="btn btn-sm btn-warning m-2" on:click={stop}>Stop <Icon icon="icomoon-free:stop" width="24px" /> </button>
          </div>
        {:else}
          <div class="skeleton h-8 w-full"></div>
        {/if}
      {:else if translateType === 'morse'}
        {#if englishOutput == ''}
          <p class="text-xl">
            Enter morse code above to translate it into english!
          </p>
          <p>Use three spaces to break words.</p>
          {:else}
          <p class="text-xl">
            {englishOutput}
          </p>
          {/if}
      {/if}
    </div>
  </main>
</section>
