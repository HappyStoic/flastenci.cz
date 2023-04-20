<script>
  import GameBoard from "./components/GameBoard.svelte";
  import Matrix from "./components/Matrix.svelte"
  import ExitNote from "./components/ExitNote.svelte";

  import { resources } from "./stores.js"

  $: loaded = $resources !== undefined
  $: centralText = loaded ? "press any key to continue" : "loading..."
  let started = false

  function handleKeyPress() {
    if (loaded) {
      started = true
    }
  }
</script>

<svelte:window on:keydown="{handleKeyPress}" on:click="{handleKeyPress}"/>

<main>
  {#if !started}
    <Matrix/>
    <ExitNote text="{centralText}"/>
  {:else}
    <GameBoard/>
  {/if}
</main>

