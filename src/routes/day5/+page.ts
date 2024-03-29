import type { PageLoad } from './$types';

type TaskType = 'CREATED_TOY' | 'WRAPPED_PRESENT'

interface Task {
	elf: string
	task: TaskType
	minutesTaken: number
    date: string;
}

export const load = (async ({ fetch }) => {
  const res = await fetch('https://advent.sveltesociety.dev/data/2023/day-five.json');
  const data = (await res.json()) as Task[]
    return { tasks: data };
}) satisfies PageLoad;