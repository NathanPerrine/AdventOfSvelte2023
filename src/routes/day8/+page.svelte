<script lang="ts">
	import Title from '$lib/components/Title.svelte';
	import christmastree from './christmastree.png';
	import { onMount } from 'svelte';

	onMount(() => {
		generateDeck();
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

				if (matchedCards == uniqueCards) {
					console.log('winner!');
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
		}
	}

	function reset() {
		selectedCard1 = null;
		selectedCard2 = null;
		matchedCards = 0;
		generateDeck();
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
			<button class="btn btn-warning btn-sm" on:click={reset}>Reset</button>
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
