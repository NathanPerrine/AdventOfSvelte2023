<script lang="ts">
	import type { PageData } from './$types';
	import Title from '$lib/components/Title.svelte';

	export let data: PageData;
	console.log(data);
	let firstNames = data.namesList.firstNames;
	let lastNames = data.namesList.lastNames;

  let realFirstName = ''
  let realLastName = ''
  let elfFirstName = ''
  let elfLastName = ''


  function createElfName() {
    if (realFirstName) {
      // try to find name based on length first
      let possibleFirstNamesLength = firstNames.filter((firstName) => firstName.length == realFirstName.length)
      if (possibleFirstNamesLength.length != 0) {
        // try to find name based on first letter
        let possibleFirstNamesLetter = possibleFirstNamesLength.filter((firstName) => firstName.startsWith(realFirstName[0].toUpperCase()))
        if (possibleFirstNamesLetter.length != 0) {
          elfFirstName = possibleFirstNamesLetter[Math.floor(Math.random() * possibleFirstNamesLetter.length)]
        } else {
          elfFirstName = possibleFirstNamesLength[Math.floor(Math.random() * possibleFirstNamesLength.length)]
        }
      } else {
        elfFirstName = firstNames[Math.floor(Math.random() * firstNames.length)]
      }
    }

    if (realLastName) {
      // try to find name based on length first
      let possibleLastNamesLength = lastNames.filter((lastName) => lastName.length == realFirstName.length)
      if (possibleLastNamesLength.length != 0) {
        // try to find name based on first letter
        let possibleLastNamesLetter = possibleLastNamesLength.filter((lastName) => lastName[0] == realLastName[0].toUpperCase())
        if (possibleLastNamesLetter.length != 0) {
          elfLastName = possibleLastNamesLetter[Math.floor(Math.random() * possibleLastNamesLetter.length)]
        } else {
          elfLastName = possibleLastNamesLength[Math.floor(Math.random() * possibleLastNamesLength.length)]
        }
      } else {
        elfLastName = lastNames[Math.floor(Math.random() * lastNames.length)]
      }
    }

  }
</script>

<section>
	<!-- Title -->
	<Title day={11} />

	<main class="p-4">
    <h3 class="text-xl text-accent text-center">Enter your real name below.</h3>
		<div class="flex flex-wrap gap-2 justify-center">
			<div class="input-wrapper">
				<input autocomplete="off" class="input" type="text" id="firstName" placeholder="First Name" bind:value={realFirstName} />
				<label class="label" for="firstName"> First Name </label>
				<button class="clear" aria-label="Clear input">
					<svg viewBox="0 0 16 16" width="12" height="12">
						<path
							d="M 1 1 L 15 15 M 1 15 L 15 1"
							fill="none"
							stroke-width="2"
							stroke="currentColor"
						/>
					</svg>
				</button>
			</div>

			<div class="input-wrapper">
				<input autocomplete="off" class="input" type="text" id="lastName" placeholder="Last Name" bind:value={realLastName} />
				<label class="label" for="lastname"> Last Name </label>
				<button class="clear" aria-label="Clear input">
					<svg viewBox="0 0 16 16" width="12" height="12">
						<path
							d="M 1 1 L 15 15 M 1 15 L 15 1"
							fill="none"
							stroke-width="2"
							stroke="currentColor"
						/>
					</svg>
				</button>
			</div>
		</div>
    <div class="p-4 flex justify-center">
      <button class="btn btn-sm btn-primary" on:click={createElfName}>Generate</button>
    </div>
    <h3 class="text-xl text-primary text-center">Your honorary elf name is...</h3>
    <p class="text-lg text-secondary text-center">
        {#if elfFirstName}
          {elfFirstName}
        {/if}
        {#if elfLastName}
          {elfLastName}
        {/if}
      </p>

	</main>
</section>

<style lang="scss">
	.input-wrapper {
		position: relative;
		margin-top: 30px;
		max-width: 400px;
	}

	.input {
		font-size: 20px;
		width: 100%;
		padding: 8px 0;
		padding-right: 30px; // To avoid overlapping with the clear button
		border: none;
		border-bottom: 1px solid #ddd;
		border-radius: 0px;
		transition: border-color 250ms;
		background-color: transparent;

		&:focus {
			outline: none;
			border-bottom-color: #777;
		}

		&::placeholder {
			color: transparent;
		}

		// Hide Safari's autofill button
		&::-webkit-contacts-auto-fill-button {
			visibility: hidden;
			pointer-events: none;
			position: absolute;
		}
	}

	.label {
		position: absolute;
		top: 8px;
		left: 0;
		pointer-events: none;
		transform-origin: left center;
		transition: transform 250ms;
	}

	.input:focus + .label,
	.input:not(:placeholder-shown) + .label {
		transform: translateY(-100%) scale(0.75);
	}

	.clear {
		cursor: pointer;
		appearance: none;
		-webkit-appearance: none;
		position: absolute;
		top: 50%;
		right: -9px; // To visually align with inputs right edge
		transform: translateY(-50%);
		background: none;
		border: none;
		border-radius: 50%;
		height: 30px;
		width: 30px;
		color: #777;
		transition: color 250ms;
		display: flex;
		align-items: center;
		justify-content: center;

		&:hover,
		&:focus {
			color: #333;
		}
	}

	.input:placeholder-shown + .label + .clear {
		display: none;
	}
</style>
