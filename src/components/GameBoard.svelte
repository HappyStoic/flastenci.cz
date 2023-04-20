<script>
  import Card from "./Card.svelte";
  import { resources } from "../stores.js";
  import {onMount} from "svelte";

  let gridSize = 6;
  let cards = []
  let availableResources;

  function color(idx) {
    return idx % 6 < 2 ? 'white' : idx % 6 < 4 ? 'red' : 'blue'
  }

  onMount(() => {
      // each card twice
      availableResources = $resources.flatMap(x => [x, x]);
      cards = Array.from({ length: gridSize * gridSize }, (_, i) => i);
  })

  function popRandomRsc(){
      const idx = Math.floor(Math.random() * availableResources.length);
      return availableResources.splice(idx, 1)[0]  // pop the element
  }
</script>

<div class="container">
  {#each cards as card (card)}
      <Card color="{color(card)}" cardId="{card}" rsc="{popRandomRsc()}" />
  {/each}
</div>

<style>
  .container {
    height: 100vh;
    width: 100vh;
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    grid-template-rows: repeat(6, 1fr);
    gap: 5px;
  }
</style>
