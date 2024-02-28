<script lang="ts">
  import type { PageData } from './$types';
  import { flip } from 'svelte/animate';
  import { crossfade } from 'svelte/transition';
  import { cubicInOut } from 'svelte/easing';
  import Icon from '@iconify/svelte';
  export let data: PageData;

  const [send, receive] = crossfade({ duration: 500, easing: cubicInOut})

  type TaskType = 'CREATED_TOY' | 'WRAPPED_PRESENT'

  interface Task {
    elf: string
    task: TaskType
    minutesTaken: number
    date: string;
  }

  type ElfData = {
    toyTasks: Task[],
    toyAverage: number,
    wrapTasks: Task[],
    wrapAverage: number,
  }
  let elfList: Elf[] = []

  class Elf {
    name: string;
    toyTasks: Task[]
    wrapTasks: Task[]

    constructor(name: string) {
      this.name = name;
      this.toyTasks = []
      this.wrapTasks = []
    }

    getToyAverage(): string {
      const toyAverage = (this.toyTasks.reduce((acc, val) => acc+val.minutesTaken, 0) / this.toyTasks.length).toFixed(2)
      return toyAverage
    }
    getWrapAverage(): string {
      const toyAverage = (this.wrapTasks.reduce((acc, val) => acc+val.minutesTaken, 0) / this.wrapTasks.length).toFixed(2)
      return toyAverage
    }
  }

  data.tasks.forEach((task) => {
    let elfName = task.elf
    let elf = elfList.find(elf => elf.name === elfName)

    if (elf){
      if (task.task === 'CREATED_TOY'){
        elf.toyTasks.push(task)
      } else if (task.task === 'WRAPPED_PRESENT'){
        elf.wrapTasks.push(task)
      }
    } else {
      let newElf = new Elf(elfName)
      if (task.task === 'CREATED_TOY'){
        newElf.toyTasks.push(task)
      } else if (task.task === 'WRAPPED_PRESENT'){
        newElf.wrapTasks.push(task)
      }

      elfList.push(newElf)
    }
  })

  let searchString = ''
  let filteredElfs: Elf[] = elfList
  function searchElfs() {
    return filteredElfs = elfList.filter(elf => {
      let elfName = elf.name.toLowerCase()
      return elfName.includes(searchString.toLowerCase())
    })
  }
  let currentSort = ''
  function sortElfsByToys() {
    if (currentSort === 'toys') {
      filteredElfs = filteredElfs.reverse()
    } else {
      currentSort = 'toys'
      filteredElfs = filteredElfs.sort((a, b) => {
        if (a.getToyAverage() > b.getToyAverage()) {
          return 1;
        }
        if (a.getToyAverage() < b.getToyAverage()) {
          return -1;
        }
        return 0;
      })
    }
  }
  function sortElfsByWrap() {
    if (currentSort === 'wrap') {
      filteredElfs = filteredElfs.reverse()
    } else {
      currentSort = 'wrap'
      filteredElfs = filteredElfs.sort((a, b) => {
        if (a.getWrapAverage() > b.getWrapAverage()) {
          return 1;
        }
        if (a.getWrapAverage() < b.getWrapAverage()) {
          return -1;
        }
        return 0;
      })
    }
  }

</script>

<section class="w-11/12 mt-8 mx-auto flex flex-wrap justify-around">
  <div class="w-full flex flex-wrap justify-around mb-4">
    <input bind:value={searchString} on:input={searchElfs} type="text" placeholder="Search elfs by name" class="input input-bordered w-full max-w-xs mb-2 sm:my-0" />
    <button class="btn btn-secondary w-36" class:!btn-primary={currentSort === 'toys'} on:click={ sortElfsByToys }>Sort: <br/> Toys Task Time</button>
    <div class="flex items-center">
      <Icon icon="pixelarticons:sort" width="24" />
    </div>
    <button class="btn btn-secondary w-36" class:!btn-primary={currentSort === 'wrap'} on:click={ sortElfsByWrap }>Sort: <br/> Wrap Task Time</button>
  </div>
  {#each filteredElfs as elf (elf.name)}
  <div class="card w-56 bg-base-200 border border-secondary m-2"
    in:receive="{{ key: elf.name }}"
    out:send="{{ key: elf.name }}"
    animate:flip={{ duration: 1000 }}
  >
    <div class="card-body py-4">
      <h2 class="card-title">Elf: {elf.name}</h2>
      <div class="flex">
        <div>
          <p>Toy Task Average:</p>
          {elf.getToyAverage()}

        </div>
        <div>
          <p>Wrap Task average</p>
          {elf.getWrapAverage()}
        </div>
      </div>
    </div>
  </div>
  {/each}
</section>