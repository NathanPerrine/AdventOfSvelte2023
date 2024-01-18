import { browser } from "$app/environment";
import { writable } from "svelte/store";

const defaultValue = 'sunset';
const initialValue = browser ? window.localStorage.getItem('theme') ?? defaultValue : defaultValue;

export const theme = writable<string>(initialValue);

theme.subscribe((value) => {
  if (browser) {
    window.localStorage.setItem('theme', value);
    document.querySelector('html')?.setAttribute('data-theme', value)
  }
});

export { theme as default };
