<script>
    import { onMount, onDestroy } from 'svelte';

    let canvas;
    let ctx;
    let flags = [];
    let numFlags;

    const flagWidth = 70;
    const flagHeight = 50;
    const rotationSpeed = 0.025;
    const fallSpeed = 2;

    function createFlag() {
        return {
            x: Math.random() * canvas.width,
            y: -Math.random() * canvas.height,
            rotation: Math.random() * Math.PI * 2,
        };
    }

    function update() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        flags.forEach((flag) => {
            flag.y += fallSpeed;
            flag.rotation += rotationSpeed;

            if (flag.y > canvas.height) {
                flag.y = -flagHeight;
                flag.x = Math.random() * canvas.width;
            }

            ctx.save();
            ctx.translate(flag.x + flagWidth / 2, flag.y + flagHeight / 2);
            ctx.rotate(flag.rotation);
            ctx.drawImage(flag.image, -flagWidth / 2, -flagHeight / 2, flagWidth, flagHeight);
            ctx.restore();
        });

        requestAnimationFrame(update);
    }

    onMount(() => {
        numFlags = Math.round((window.innerWidth * window.innerHeight)/23000)
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        ctx = canvas.getContext('2d');

        for (let i = 0; i < numFlags; i++) {
            const flagImage = new Image();
            flagImage.src = '/assets/cz-flag.svg';
            flagImage.onload = () => {
                flags.push({ ...createFlag(), image: flagImage });
            };
        }

        requestAnimationFrame(update);

        return () => {
            onDestroy();
        };
    });

    function onResize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
</script>

<style>
    canvas {
        z-index: 101;
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
    }
</style>

<canvas on:resize={onResize} bind:this={canvas}></canvas>
