export const ordArray = [
  {
    id: 1,
    name: 'rad_audio',
    alias: 'rad_audio',
    audio:
      'https://ordinals.com/content/78b3b56af07cb926b0f8ac22322cf02714db23984b875bc5be15c726cd1ed27ci0',
    image:
      'https://ordinals.com/content/3cb179d5be8a527d71b96315bf8c06c1256cd90845c6566ff31de671027d6989i0',
    coin: 'https://ordinals.com/content/0e113d456b01a5d008c7f0da74eef02ea9a7315d74a6ba6299425d47036909bdi0',
    quantity: 84
  },
  {
    id: 2,
    name: 'Rare Scrilla',
    alias: 'Rare_Scrilla',
    audio:
      'https://ordinals.com/content/29eee78e1de8a6c10aa85aa79e2ab47ab0481964f7856ab39425811656d4a757i0',
    image:
      'https://ordinals.com/content/923e1b0253a09c01e46c0c3e7f51404970ab30544e555c3fcccddfa5d78d5ee7i0',
    coin: 'https://ordinals.com/content/bf7561a8d27133a3e1144ac49ae1c24ac263f4271d5cf07f151740b3f3c3c54ci0',
    quantity: 84
  },
  {
    id: 3,
    name: 'Rare Scrilla',
    alias: 'Rare_Scrilla',
    audio:
      'https://ordinals.com/content/0dd65cb9dfa10d672c16e3741d73eead9085a710ff5f8796ef626799c85f944bi0',
    image:
      'https://ordinals.com/content/2b0be26d10f643c5fd719f59b8094ab6c94cd7660ddf6d6fadc6e0c8c0db5918i0',
    coin: 'https://ordinals.com/content/9d05e297b0e32bd4c955914c03c406eb98635fd805a7c01340f89660aea69ad4i0',
    quantity: 84
  },
  {
    id: 4,
    name: 'Rare Scrilla',
    alias: 'Rare_Scrilla',
    audio:
      'https://ordinals.com/content/ee21b5240619eab16b498afbcefb673285d5e39f3a597b4a6a54a34dec274a3ai0',
    image:
      'https://ordinals.com/content/3c058d094e10ccad06ffa0e97b8e147b315ee8d5c0dfe0376d61cfe520fa6fd5i0',
    coin: 'https://ordinals.com/content/503b48a1b7c209c88467fb76773ee3d6215a2a32d3771a9479d76034d315c9eei0',
    quantity: 84
  },
  {
    id: 5,
    name: 'Rare Scrilla',
    alias: 'Rare_Scrilla',
    audio:
      'https://ordinals.com/content/53f06b0bf1aa83d51b9d08e85fa952efd5792d79e81ee2d08003c550c3773121i0',
    image:
      'https://ordinals.com/content/3c4062f5e3433b997a92020f849fad8a82c7c2369a5c810a2f92ecdd61421e33i0',
    coin: 'https://ordinals.com/content/5fab883761387f948b62fcd7e2c58fae14fc22338783d641d489154fa3de4d9fi0',
    quantity: 84
  },
  {
    id: 6,
    name: 'GFK',
    alias: 'GFK',
    audio:
      'https://ordinals.com/content/069f79685c04af6357058eeeb65c4835ed13d00b5bf5a69c4cff5e513d9b0fffi0',
    image:
      'https://ordinals.com/content/99d1ce468eccac8a43eb07fc99f83d920bbd4846255d477fc9746b28f877ee4ci0',
    coin: 'https://ordinals.com/content/9aea7d959fbd9bba7747294a0f8f8be1ec291380b9460e6a48c181f8e587fd91i0',
    quantity: 84
  }

];

export const vinylLabels = [
  {
    id: 1,
    name: 'headphones',
    image: 'https://ordinals.com/content/b86c4701d220a90d3cd510b8f06143654ca0d18ee644f61c37ae910c44308f71i0',
    audio: 'https://ordinals.com/content/78b3b56af07cb926b0f8ac22322cf02714db23984b875bc5be15c726cd1ed27ci0', 
    quantity: 420
  },
  {
      id: 2,
      name: 'shoulders',
      image: 'https://ordinals.com/content/28cf5f2b35daf24d73cddcaca085bbdba29fb04ec1a3019597170c971abc9364i0',
      audio: 'https://ordinals.com/content/78b3b56af07cb926b0f8ac22322cf02714db23984b875bc5be15c726cd1ed27ci0', 
      quantity: 420
  },
  {
      id: 3,
      name: 'spartan',
      image: 'https://ordinals.com/content/28cf5f2b35daf24d73cddcaca085bbdba29fb04ec1a3019597170c971abc9364i1',
      audio: 'https://ordinals.com/content/78b3b56af07cb926b0f8ac22322cf02714db23984b875bc5be15c726cd1ed27ci0', 
      quantity: 420
  }   ,
  {
      id: 4,
      name: 'woman',
      image: 'https://ordinals.com/content/28cf5f2b35daf24d73cddcaca085bbdba29fb04ec1a3019597170c971abc9364i2',
      audio: 'https://ordinals.com/content/78b3b56af07cb926b0f8ac22322cf02714db23984b875bc5be15c726cd1ed27ci0', 
      quantity: 420
  }   
]


var url = window.location.pathname;
var urlarray = url.split("/");
var ins_id = urlarray[urlarray.length - 1];
//var ins_id = "9aea7d959fbd9bba7747294a0f8f8be1ec291380b9460e6a48c181f8e587fd91i0";
let id = ins_id.endsWith('i0') ? ins_id.slice(0, -2) : ins_id;

const chunkSize = Math.floor(id.length / 8);
const chunks = [];
for (let i = 0; i < 8; i++) {
  chunks.push(id.slice(i * chunkSize, (i + 1) * chunkSize));
}

const colors = chunks.map(chunk => '#' + chunk.slice(0, 6) + "6f");
let goldMarble= 'https://ordinals.com/content/1a722dcfabb452f9fb3eadf5fa30b4f2cb25d7adbc75ff2226af12181b65197ci1'
let bloodmarbleimage = 'https://ordinals.com/content/1a722dcfabb452f9fb3eadf5fa30b4f2cb25d7adbc75ff2226af12181b65197ci0'
let marbleImage = goldMarble ;


let vinylLabelImage = 'https://ordinals.com/content/99d1ce468eccac8a43eb07fc99f83d920bbd4846255d477fc9746b28f877ee4ci0' ; 
let vinylLabelAudio = 'https://ordinals.com/content/069f79685c04af6357058eeeb65c4835ed13d00b5bf5a69c4cff5e513d9b0fffi0'  ;

let ordArrayAudio = 'https://ordinals.com/content/069f79685c04af6357058eeeb65c4835ed13d00b5bf5a69c4cff5e513d9b0fffi0';
let ordArrayImage = 'https://ordinals.com/content/99d1ce468eccac8a43eb07fc99f83d920bbd4846255d477fc9746b28f877ee4ci0' ;
let coinUrl = 'https://ordinals.com/content/9aea7d959fbd9bba7747294a0f8f8be1ec291380b9460e6a48c181f8e587fd91i0' ;

let samplerrBackground = ordArrayImage ;



export function setMarbleImage(newImage) {
  marbleImage = newImage;
}

export function setVinylLabelImage(newImage) {
  vinylLabelImage = newImage;
}

export function setVinylLabelAudio(newAudio) {
  vinylLabelAudio = newAudio;
}

export function setIomApp(newApp) {
  iomApp = newApp;
}

export function setCoinUrl(newCoin) {
  coinUrl = newCoin;
}

export function setordArrayImage(newImage) {
  ordArrayImage = newImage;
}

export function setordArrayAudio(newAudio) {
  ordArrayAudio = newAudio;
}
export function setSamplerrBackground(newBackground) {
  samplerrBackground = newBackground;
}

export {  colors, coinUrl, marbleImage, ordArrayImage, ordArrayAudio, vinylLabelImage, vinylLabelAudio, samplerrBackground };   