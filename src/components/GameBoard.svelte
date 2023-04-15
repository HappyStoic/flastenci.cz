<!-- src/components/GameBoard.svelte -->
<script>
  import Card from "./Card.svelte";
  let gridSize = 6;
  let cards = Array.from({ length: gridSize * gridSize }, (_, i) => i);
</script>

<div class="container">
  {#each cards as card (card)}
    <Card cardId="{card}" />
  {/each}
</div>

<style>
  /*:global(body) {*/
  /*  margin: 0;*/
  /*  padding: 0;*/
  /*  height: 100vh;*/
  /*  display: flex;*/
  /*  justify-content: center;*/
  /*  align-items: center;*/
  /*}*/

  /*.game-board {*/
  /*  display: grid;*/
  /*  grid-template-columns: repeat(8, 1fr);*/
  /*  gap: 1vmin;*/
  /*  !*width: 100vw;*!*/
  /*  height: 100vw;*/
  /*  !*width: calc(100vmin - 2vmin);*!*/
  /*  !*height: calc(100vmin - 2vmin);*!*/
  /*  box-sizing: border-box;*/
  /*}*/

  .container{
    height: 100vh;
    width: 100vh;

    display: grid;
    grid-template-columns: repeat(6, 1fr);
    grid-template-rows: repeat(6, 1fr);


    gap: 5px;

  }
</style>
