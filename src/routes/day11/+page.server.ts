import type { PageServerLoad } from './$types';

interface NamesList {
  firstNames: string[];
  lastNames: string[];
}

export const load = (async ({ fetch }) => {
  const res = await fetch ('https://advent.sveltesociety.dev/data/2023/day-eleven.json')
  const namesList: NamesList = await res.json()


    return { namesList };
}) satisfies PageServerLoad;