<script>
  import Card from "./Card.svelte";
  import { resources } from "../stores.js";
  import { onMount } from "svelte";

  let gridSize = 6;
  let cards = []
  let availableResources;
  let firstShown = null;
  let hideAwaitingCards = null

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

  function cardShown(e){
      let card = e.detail
      // console.log(e)

      if (firstShown == null) {
          if (hideAwaitingCards) {
              hideAwaitingCards()
              hideAwaitingCards = null
          }

          firstShown = card
          return
      }

      if (firstShown.rsc == card.rsc) {
          card.cardFinishedCallback()
          firstShown.cardFinishedCallback()
          firstShown.playIfPossibleCallback()
          firstShown = null

      } else {
          let id1 = setTimeout(card.hideCallback, 5000)
          let id2 = setTimeout(firstShown.hideCallback, 5000)
          let callback1 = card.hideCallback
          let callback2 = firstShown.hideCallback
          hideAwaitingCards = () => {
              clearTimeout(id1)
              clearTimeout(id2)
              callback1()
              callback2()
          }
          firstShown = null
      }
  }
</script>

<div class="outer-container">
    <div class="container">
      {#each cards as card (card)}
          <Card on:shown={cardShown} color="{color(card)}" cardId="{card}" rsc="{popRandomRsc()}" />
      {/each}
    </div>
</div>

<style>
  .outer-container {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100vh;
      width: 100vw;
  }

  .container {
    height: 100vh;
    width: 100vh;
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    grid-template-rows: repeat(6, 1fr);
    gap: 5px;
  }

  @media (orientation: portrait) {
      .container {
          height: 100vw;
          width: 100vw;
      }
  }
</style>
