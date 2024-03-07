<script lang="ts">
	import Title from '$lib/components/Title.svelte';
	import christmastree from './christmastree.png';
	import { onMount } from 'svelte';

	onMount(() => {
		generateDeck();
    generatePlayers();
	});

	type Card = {
		id: string;
		value: number;
		faceDown: boolean;
		img: string;
		matched: boolean;
	};

	let cards: Card[] = [];
	$: cards;
	let uniqueCards: number = 24;
	let numberCardOptions = [4, 8, 12, 16, 20, 24];

	function generateDeck() {
		cards = [];
		for (let step = 1; step <= uniqueCards; step++) {
			let newCard: Card = {
				id: window.crypto.randomUUID(),
				value: step,
				faceDown: true,
				img: `https://advent.sveltesociety.dev/data/2023/day-eight/${step}.png`,
				matched: false
			};
			let newCard2: Card = {
				id: window.crypto.randomUUID(),
				value: step,
				faceDown: true,
				img: `https://advent.sveltesociety.dev/data/2023/day-eight/${step}.png`,
				matched: false
			};
			cards.push(newCard);
			cards.push(newCard2);
		}

		shuffleCards(cards);
		cards = cards;
	}

	function shuffleCards(array: Card[]) {
		// Fisher-Yates sorting algorithm
		for (let i = array.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[array[i], array[j]] = [array[j], array[i]];
		}
		return array;
	}

	let selectedCard1: Card | null = null;
	$: selectedCard1;
	let selectedCard2: Card | null = null;
	$: selectedCard2;

	let matchedCards: number = 0;
	let matchTimeout: boolean = false;

	function cardClick(id: string) {
		let cardIndex = cards.findIndex((card) => card.id === id);
		if (typeof cardIndex === 'number') {
			cards[cardIndex].faceDown = !cards[cardIndex].faceDown;
		}
		if (!selectedCard1) {
			selectedCard1 = cards[cardIndex];
		} else {
			selectedCard2 = cards[cardIndex];
		}
		if (selectedCard1 && selectedCard2) {
			// check for match
			if (selectedCard1.value === selectedCard2.value) {
				selectedCard1.matched = true;
				selectedCard2.matched = true;
				matchedCards++;

        // Add cards + score to current player
        players[currentPlayer-1].score += selectedCard1.value
        players[currentPlayer-1].cards.push(selectedCard1)
        players[currentPlayer-1].cards.push(selectedCard2)

				if (matchedCards == uniqueCards) {
					console.log('winner!');
          winner = players.reduce((currentWinner, player) => currentWinner.score > player.score ? currentWinner : player)
				}
				resetSelectedCards();
			} else {
				matchTimeout = true;
				setTimeout(() => {
					if (selectedCard1 && selectedCard2) {
						selectedCard1.faceDown = true;
						selectedCard2.faceDown = true;
					}

					resetSelectedCards();
					matchTimeout = false;
				}, 2000);
			}

			function resetSelectedCards() {
				selectedCard1 = null;
				selectedCard2 = null;
				cards = cards;
			}

      if (currentPlayer < playerCount) {
        currentPlayer++
      } else currentPlayer = 1
		}
	}

	function reset() {
		selectedCard1 = null;
		selectedCard2 = null;
		matchedCards = 0;
    currentPlayer = 1;
    winner = null;
		generateDeck();
    generatePlayers();
	}
  type Player = {
    id: number,
    score: number,
    cards: Card[]
  }
  let playerCount = 2
  let players: Player[] = []
  let currentPlayer: 1 | 2 = 1
  let winner: Player | null = null

  function generatePlayers() {
    players = []
    for (let step = 0; step < playerCount; step++){
      let newPlayer: Player = {
        id: step+1,
        score: 0,
        cards: []
      }
      players.push(newPlayer)
      players = players
    }
  }

</script>

<section>
	<!-- Title -->
	<Title day={8} />

	<main class="mt-4">
		<!-- options -->
		<div class="flex justify-around">
			<div class="flex flex-col sm:flex-row">
				<p class="self-center mx-2"># of unique cards:</p>
				<select bind:value={uniqueCards} on:change={reset} class="select select-bordered max-w-xs">
					<option disabled selected>Number of unique cards</option>
					{#each numberCardOptions as option}
						<option value={option}>{option}</option>
					{/each}
				</select>
			</div>
			<button class="btn btn-warning btn-sm self-center" on:click={reset}>Reset</button>
		</div>

    <!-- Players -->
    <div class="flex flex-wrap justify-around w-11/12 mx-auto">
      <!-- Player 1 -->
      {#each players as player, i (player.id) }
        <div>
          <h2 class="text-xl font-bold">Player {i+1}</h2>
          <div class="flex flex-wrap">
            <div id="cardstack" class="w-36 h-52 border border-accent m-1">
              <div class="stack">
                {#each player.cards as card}
                  <img src={card.img} alt={card.value.toString()}/>
                {/each}
              </div>
            </div>
            <div id="scorecard">
              <div>
                <h2 class="text-lg font-bold">Score:</h2>
              </div>
              <div>
                <h2 class="text-2xl font-bold">{player.score}</h2>
              </div>
            </div>
          </div>
        </div>
      {/each}
    </div>

    <!-- Current Turn -->
    <div class="flex flex-wrap justify-center">
      <h2 class="text-lg font-bold">Current Turn: Player {currentPlayer}</h2>
    </div>
    <!-- Winner -->
    <div class="flex flex-wrap justify-center">
      {#if winner}
        <h1 class="text-2xl font-bold">Congrats Player {winner.id}</h1>
      {/if}
    </div>

		<!-- main game -->
		<div class="grid justify-center">
			<div class="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8">
				{#each cards as card (card.id)}
					<button
						disabled={card.matched || !card.faceDown || matchTimeout}
						class={'card m-2 rounded-lg ' +
							(card.matched ? 'flipped' : card.faceDown ? '' : 'flipped')}
						on:click={() => cardClick(card.id)}
					>
						<div class="card-front">
							<img src={christmastree} alt={'Card background'} class="rounded-md" />
						</div>
						<div class="card-back">
							<img src={card.img} alt={card.value.toString()} />
						</div>
					</button>
				{/each}
			</div>
		</div>
	</main>
</section>

<style>
	.card {
		width: 130px;
		height: 200px;
		perspective: 1000px;
		transition: transform 1s;
		transform-style: preserve-3d;
	}

	.flipped {
		transform: rotateY(180deg);
	}

	.card-front,
	.card-back {
		position: absolute;
		width: 100%;
		height: 100%;
		-webkit-backface-visibility: hidden;
		backface-visibility: hidden;
		/* fix for firefox showing hidden face */
		transform: rotateX(0deg);
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.card-back {
		transform: rotateY(180deg);
	}
</style>
