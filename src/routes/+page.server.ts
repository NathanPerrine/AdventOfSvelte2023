import type { PageServerLoad } from './$types';

interface PersonObj {
  name: string
  tally: number
}

export const load = (async ({ fetch }) => {
  const res = await fetch('https://advent.sveltesociety.dev/data/2023/day-one.json')
  const json = await res.json()
  const people = json.map((person: PersonObj) => {
    return {
      name: person.name,
      tally: person.tally
    }
  })
  if (!res.ok || !people){
    throw new Error("Not found")
  }

  return {
    people
  }

}) satisfies PageServerLoad;