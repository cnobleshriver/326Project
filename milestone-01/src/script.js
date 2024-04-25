const homepage_imgs = [
    'https://s3-alpha.figma.com/hub/file/2734964093/9f5edc36-eb4d-414a-8447-10514f2bc224-cover.png',
    'https://images.pexels.com/photos/267350/pexels-photo-267350.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500'
];
let index = 0;
let img = document.getElementById('homepage-img');
let btn = document.getElementById('img-btn');

btn.addEventListener('click', nextImg);

function nextImg() {
    index++;
    img.src = homepage_imgs[(index) % homepage_imgs.length];
}