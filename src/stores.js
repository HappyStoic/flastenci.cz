import { readable } from 'svelte/store';

const rawResources = [
    {img:"assets/babis.jpg"},
    {img:"assets/skromach.jpg"},
    {img:"assets/feri.jpg"},
    {img:"assets/havel.jpg"},
    {img:"assets/kalousek.jpg"},
    {img:"assets/klaus.jpg"},
    {img:"assets/rath.jpg"},
    {img:"assets/schillerova.jpg"},
    {img:"assets/schwarzenberg.jpg"},
    {img:"assets/sobotka.jpg"},
    // {img:"assets/topolanek.jpg"},
    {img:"assets/vojtech.jpg"},
    {img:"assets/volny.jpg"},
    {img:"assets/chovanec.jpg"},
    {img:"assets/ondracek.jpg"},
    {img:"assets/vondracek.jpg"},
    {img:"assets/bartos.jpg"},
    {img:"assets/pitomio.jpg"},
    {img:"assets/zeman.jpg", audio:"assets/kunda.mp3"},
];


export const resources = readable(undefined, async function start(set) {
    let res = []
    try {
        for (const rawRsc of rawResources) {
            let response = await fetch(rawRsc.img);
            let blob = await response.blob();
            let rsc = {
                "img": URL.createObjectURL(blob)
            }
            if (rawRsc.audio) {
                response = await fetch(rawRsc.audio);
                blob = await response.blob();
                rsc.audio = URL.createObjectURL(blob)
            }
            res.push(rsc)
        }
        set(res)
    } catch (err) {
        alert(err)
    }

});