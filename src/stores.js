import { readable } from 'svelte/store';

const rawResources = [
    {img:"assets/zeman.jpg", audio:"assets/kunda.mp3"},
    {img:"assets/babis.jpg", audio: "assets/troskujsemtoposral.mp3"},
    {img:"assets/skromach.jpg", audio: "assets/skromach-ohne.mp3"},
    {img:"assets/rozner.jpg", audio: "assets/rozner-kritizovat.mp3"},
    {img:"assets/kalousek.jpg", audio: "assets/kalousek-kokoti.mp3"},
    {img:"assets/schillerova.jpg", audio: "assets/schillerova-we-will-see.mp3"},
    {img:"assets/ondracek.jpg", audio: "assets/ondracek-revoluce.mp3"},
    {img:"assets/volny.jpg", audio: "assets/volny-flakanec.mp3"},
    {img:"assets/malacova.jpg", audio: "assets/malacova-plytka.mp3"},
    {img:"assets/paroubek.jpg", audio: "assets/paroubek-ufouni.mp3"},
    {img:"assets/pitomio.jpg", audio: "assets/pitomio-plysaci.mp3"},
    {img:"assets/sobotka.jpg", audio: "assets/sobotka-english.mp3"},
    {img:"assets/foldyna.jpg", audio: "assets/foldyna-vlastenec.mp3"},
    {img:"assets/novotny.jpg", audio: "assets/novotny-sparta.mp3"},
    {img:"assets/klaus.jpg"},
    {img:"assets/schwarzenberg.jpg"},
    {img:"assets/vondracek.jpg"},
    {img:"assets/bartos.jpg"},
    // {img:"assets/rath.jpg"},
    // {img:"assets/feri.jpg"},
    // {img:"assets/chovanec.jpg"},
    // {img:"assets/havel.jpg"},
    // {img:"assets/topolanek.jpg"},
    // {img:"assets/vojtech.jpg"},
];

// zaoralek?
// topolanek - rika se o me, ze jsem blbej

export const resources = readable(undefined, async function start(set) {
    let res = [];

    try {
        // download asynchronously all media resources
        const downloadPromises = rawResources.map(async (rawRsc) => {
            const imgPromise = fetch(rawRsc.img).then(response => response.blob()).then(blob => URL.createObjectURL(blob));
            const audioPromise = rawRsc.audio ? fetch(rawRsc.audio).then(response => response.blob()).then(blob => URL.createObjectURL(blob)) : null;

            const [img, audio] = await Promise.all([imgPromise, audioPromise]);

            const rsc = {
                "img": img,
                "audio": audio
            };

            return rsc;
        });

        res = await Promise.all(downloadPromises);
        set(res);
    } catch (err) {
        alert(err);
    }
});