<script>
  export let cardId;
</script>

<button class="my btn btn-secondary" on:click={() => console.log(`Card clicked: ${cardId}`)}>
<!--  <span>{cardId}</span>-->
  x
<!--  <div class="my">x</div>-->
</button>

<style>
  .card {
    width: 100%;
    height: 100%;
    /*padding-bottom: 100%; !* Maintain aspect ratio *!*/
    /*position: relative;*/
    /*border: 1px solid #ccc;*/
    background-color: black;
    /*color: black;*/
    /*overflow: hidden; !* Hide content that goes outside the card *!*/
  }

  .card span {
    /*position: absolute;*/
    /*top: 0;*/
    /*left: 0;*/
    /*width: 100%;*/
    /*height: 100%;*/
    align-self: stretch;
    /*display: flex;*/
    /*align-items: center;*/
    /*justify-content: center;*/
  }

  my {
    align-self: stretch;
  }
</style>
