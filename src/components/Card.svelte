<script context="module">
  export let playedOnce = false
</script>

<script>
  import {onMount} from "svelte";
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();
  export let cardId;
  export let color
  export let rsc;

  let flipped = false;
  let audio

  onMount(()=>{
    if (rsc.audio) {
      audio = new Audio(rsc.audio);
    }
  })

  function dispatchShown(){
    dispatch('shown', {
      "rsc": rsc,
      "hideCallback": ()=>{ flipped = false }
    });
  }

  function flipCard() {
    if (flipped) {
      return // flipped back only via callback from gameboard
    }
    flipped = true
    console.log(`Flipped card ${cardId}: ${flipped}`);

    if (flipped) {
      dispatchShown()

      if (audio && !playedOnce) {
        playedOnce = true
        console.log("play sound")
        audio.play();
      }
    }
  }

</script>

<div class="card" class:flipped={flipped} on:click={flipCard}>
  <div class="card-face card-face-front {color}" >
  </div>
  <div class="card-face card-face-back">
    <img src="{rsc.img}" alt="Card image" />
  </div>
</div>

<style>
  .card {
    background: black;
    width: 100%;
    height: 100%;
    perspective: 1000px;
    cursor: pointer;
  }

  .card-face {
    width: 100%;
    height: 100%;
    backface-visibility: hidden;
    position: absolute;
    transition: transform 0.5s;
  }

  .card-face-front {
    display: flex;
  }

  .white {
    background-color: white;
  }

  .red {
    background-color: red;
  }

  .blue {
    background-color: blue;
  }

  .card-face-back {
    background-color: #fff;
    transform: rotateY(180deg);
  }

  .card img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .flipped .card-face-front {
    transform: rotateY(180deg);
  }

  .flipped .card-face-back {
    transform: rotateY(0);
  }
</style>
