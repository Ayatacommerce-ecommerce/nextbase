/*
 * Determine if the device is a mobile based on the screen size
 * screen resolution range for moblie devices is from  360*640 to 414*896
 */
var isMobile = window.innerWidth < 540;

// get image url for the section with frame index
const getImageUrl = (section, index) => {
    // console.log('incoming ', section)
    if (section == 4 || section == 10 || section == 11 || section == 13 || section == 15) return `https://ayatacommerce-ecommerce.github.io/nextbase/assets/images/${isMobile ? 'Mobile/' : ''}Sequence_01/sh_010${isMobile ? '_m' : ''}.00001.png`;
    if (section > 4) section = section - 1
    if (section >= 11) section = section - 1
    if (section >= 10) section = section - 1
    if (section >= 11) section = section - 1
    if (section >= 12) section = section - 1


    // console.log('outgoing section', section)
    return `https://sadectip.sirv.com/images/${isMobile ? 'Mobile/' : ''}Sequence_${section.toString().padStart(2, "0")}/sh_${section
        .toString().padStart(2, "0")}0${isMobile ? '_m' : ''}.${index.toString().padStart(5, "0")}.png`;
    // return `https://ayatacommerce-ecommerce.github.io/nextbase/assets/images/${isMobile ? 'Mobile/':''}Sequence_${section.toString().padStart(2, "0")}/sh_${section
    // .toString().padStart(2, "0")}0${isMobile ? '_m':''}.${index.toString().padStart(5, "0")}.png`;
}

// Preload the images 
for (let s = 1; s <= 2; s++) {
    for (let i = 1; i <= 30; i++) {
        const img = new Image();
        img.src = getImageUrl(s, i);
    }
}

/*
 * Initialize some useful methods from fullpage plugin
 */
var $ = fp_utils.$,
    addClass = fp_utils.addClass,
    removeClass = fp_utils.removeClass;

/*
 * declare some dom variables
 */
const canvas = $("#anican")[0];
const context = canvas.getContext("2d");
const img = new Image();

/*
 * Update the canvas
 */
window.addEventListener("resize", () => updateCanvas());
const updateCanvas = () => {
    const width = window.innerWidth;

    canvas.width = width;
    canvas.height = isMobile ? width : width * (9 / 16);
    context.drawImage(img, 0, 0, canvas.width, canvas.height);
    if (isMobile) {
        canvas.style.marginTop = "";
    } else {
        const availablePadding = window.innerHeight - canvas.height
        canvas.style.marginTop = (availablePadding / 2) + "px";
        canvas.style.marginBottom = (availablePadding / 2) + "px";
    }
}
updateCanvas()
img.onload = function () {
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.drawImage(img, 0, 0, canvas.width, canvas.height);
};
var scrollingSpeed = 1500;

/*
 * Add Entry animation
 */
function animateInterSection(originIndex, destinationIndex, direction) {
    // Generate the imagesList
    var imagesList = [];
    if (direction === "up") {
        // if the direction is upwards images from 15-1 will be taken from origin and 30-16 from destination
        for (var i = 15; i > 0; i--) {
            imagesList.push(getImageUrl(originIndex, i));
        }
        for (var i = 30; i > 15; i--) {
            imagesList.push(getImageUrl(destinationIndex, i));
        }
    } else if (direction === "down") {
        // if the direction is downwards images from 16-30 will be taken from origin and 1-15 from destination
        for (var i = 16; i < 31; i++) {
            imagesList.push(getImageUrl(originIndex, i));
        }
        for (var i = 1; i < 16; i++) {
            imagesList.push(getImageUrl(destinationIndex, i));
        }
    }

    var index = 0;
    var interval = setInterval(function () {
        if (index < 30) {
            img.src = imagesList[index];
        } else if (index > 30) {
            clearInterval(interval);
        }
        index++;
    }, scrollingSpeed / 30);
}
/*
 * Initialize the fullPage plugin
 */
new fullpage("#fullpage", {
    touchWrapper: document,
    // sectionsColor: [ 'red', 'blue', 'green', 'cyan', 'magenta','yellow','pink','red', 'blue', 'green', 'cyan', 'magenta','red', 'blue', 'green', 'cyan', 'magenta',],
    scrollingSpeed: scrollingSpeed,
    offsetSections: true,
    // easings:["steps(2, jump-none)","steps(2, jump-none)","ease","linear"],
    // easingcss3: "steps(2, jump-none)",

    // first section auto page load animation
    afterLoad: (activeSection, element, direction) => {
        // used only for the first section
        if (direction == null && activeSection.isFirst) {
            // imagesList is not needed
            var imagesList = [];
            for (var i = 1; i < 16; i++) {
                imagesList.push(getImageUrl(1, i));
            }
            var index = 0;
            var interval = setInterval(function () {
                if (index < 15) {
                    img.src = imagesList[index];
                } else if (index > 15) {
                    clearInterval(interval);
                }
                index++;
            }, scrollingSpeed / 30);

            console.log('Moving Footer')
            const footerContainer = $('#footerContainer')[0];
            console.log('footerContainer',footerContainer)
            console.log('footerContainer length',footerContainer.children.length)
            if (footerContainer.children.length === 0){
                const footer = $('.footer')[0];
                console.log('get original footer',footer)
                footerContainer.appendChild(footer)
                console.log('the moved footer section',footerContainer)
            }
        }

    },
    //  images from 1 to last exclude after load start here
    onLeave: (origin, destination, direction) => {
        //animateInterSection(0, 1, direction);
        // Preload the images of next section
        if (direction === "down") {
            for (let i = 1; i <= 30; i++) {
                const img = new Image();
                img.src = getImageUrl(destination.index + 2, i);
            }
        }

        animateInterSection(origin.index + 1, destination.index + 1, direction);
        // Animate the content
        const leftHalfOrigin = $("#leftHalf", origin.item)[0];
        const rightHalfOrigin = $("#rightHalf", origin.item)[0];
        // const bottomOrigin = $("#bottom-div", origin.item)[0];
        // const bottomOneOrigin = $("#bottomToTop1", origin.item)[0];
        // const bottomTwoOrigin = $("#bottomToTop2", origin.item)[0];
        const leftHalfDestination = $("#leftHalf", destination.item)[0];
        const rightHalfDestination = $("#rightHalf", destination.item)[0];
        // const bottomDestination = $("#bottom-div", destination.item)[0];
        // const bottomOneDestination = $("#bottomToTop1", destination.item)[0];
        // const bottomTwoDestination = $("#bottomToTop2", destination.item)[0];

        var duration = scrollingSpeed / 1000 / 2;

        var tr = gsap.timeline();
        tr.fromTo(leftHalfOrigin, { opacity: 1 }, { x: "-20vw", opacity: 0, duration: duration });
        tr.fromTo(leftHalfDestination, { x: "-20vw", opacity: 0 }, { x: "0", opacity: 1, duration: duration });

        var tl = gsap.timeline();
        tl.fromTo(rightHalfOrigin, { opacity: 1 }, { x: "20vw", opacity: 0, duration: duration });
        tl.fromTo(rightHalfDestination, { x: "20vw", opacity: 0 }, { x: "0", opacity: 1, duration: duration });

        // var tb = gsap.timeline();
        // tb.fromTo(bottomOrigin, { opacity: 1 }, { y: "-100", opacity: 0, duration: duration });
        // tb.fromTo(bottomDestination, { y: "500", opacity: 0 }, { y: "0", opacity: 1, duration: duration });

        // var bt = gsap.timeline();
        // bt.fromTo(bottomOneOrigin, { opacity: 1 }, { y: "-100", opacity: 1, duration: duration });
        // bt.fromTo(bottomOneDestination, { y: "0", opacity: 1 }, { y: "0", opacity: 1, duration: duration });

        // var btTwo = gsap.timeline();
        // btTwo.fromTo(bottomTwoOrigin, { opacity: 0.5 }, { y: "0", opacity: 1, duration: duration });
        // btTwo.fromTo(bottomTwoDestination, { y: "30", opacity: 1 }, { y: "0", opacity: 1, duration: duration });
    },
});