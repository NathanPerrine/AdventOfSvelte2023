import type { PageLoad } from './$types';

export type PersonPresentObj = {
  name: string,
  weight: number,
  id: string,
  status: string
}

export const load = (async ({ fetch }) => {
  const res = await fetch('https://advent.sveltesociety.dev/data/2023/day-three.json')
  const json = await res.json()
  const people: PersonPresentObj[] = json.map((person: PersonPresentObj) => {
    return {
      name: person.name,
      weight: person.weight,
      id: crypto.randomUUID(),
      status: 'unsorted'
    }
  })
  if (!res.ok || !people) {
    throw new Error("Not found.")
  }

  return {
    people
  };
}) satisfies PageLoad;