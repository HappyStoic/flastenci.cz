<script>
    import { onMount } from 'svelte';

    let isVisible = true;

    // function handleKeyPress() {
    //     isVisible = false;
    // }

    // <!--onMount(() => {-->
    // <!--    window.addEventListener('keydown', handleKeyPress);-->
    // <!--    return () => {-->
    // <!--        window.removeEventListener('keydown', handleKeyPress);-->
    // <!--    };-->
    // });
</script>

<style>
    .exit-note {
        opacity: 100%;
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        display: flex;
        align-items: center;
        justify-content: center;
        width: 80%;
        max-width: 400px;
        padding: 1rem;
        border: 2px solid #ff0000;
        border-radius: 0.25rem;
        background-color: rgba(255, 255, 255, 0.95);
        color: #0022a6;
        font-size: 1.2rem;
        text-align: center;
        z-index: 100;
        transition: opacity 0.3s ease-in-out;
    }

    .exit-note.hidden {
        opacity: 0;
        pointer-events: none;
    }
</style>

<div class="exit-note alert alert-success shadow-sm {isVisible ? '' : 'hidden'}" role="alert">
    Site under construction 🏗️
</div>
