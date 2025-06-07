// story slider
var storySlider = function () {
    var options = {
        speed: 500,
        autoplay: true,
        autoplaySpeed: 10000,
        pauseOnFocus: false,
        pauseOnHover: false,
        touchThreshold: 5000,
        swipeToSlide: true,
        arrows: false,
        dots: true,
        adaptiveHeight: false,
        fade: true,
    };

    // slick options
    var storyPreviewOptions = {
        ...options,
        ...{
        appendDots: "#story__slider-dots",
        asNavFor: "#story__slider-caption",
        },
    };

    var storyCaptionOptions = {
        ...options,
        ...{
            dots: false,
            adaptiveHeight: false,
            asNavFor: "#story__slider-preview",
            adaptiveHeight: false,
            arrows: true,
            prevArrow: '.story--button.prev',
            nextArrow: '.story--button.next'
        },
    };

    // init slick
    $("#story__slider-preview").slick(storyPreviewOptions);

    $("#story__slider-caption").slick(storyCaptionOptions);
};

// Gallery Single Slider
window.GALLERY_SINGLE_SLIDER = true;

// toggle show wedding gift bank
var toggleGift = function(){
    $(".hadiah-content").slideToggle();
};

// Photo Options Nav
var photo_nav_options = {
    slidesToShow: 1,
    slidesToScroll: 1,
    fade: true,
    arrows: false,
    adaptiveHeight: false,
    variableWidth: false,
    infinite: true,
    useTransform: true,
    speed: 500,
    cssEase: "cubic-bezier(0.77, 0, 0.18, 1)",
    asNavFor: $(".photo-slider"),
};

// Photo Options Slider
var photo_slider_options = {
    centerMode: true,
    swipeToSlide: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    fade: false,
    arrows: true,
    adaptiveHeight: false,
    variableWidth: true,
    infinite: true,
    useTransform: true,
    speed: 500,
    cssEase: "cubic-bezier(0.77, 0, 0.18, 1)",
    prevArrow: $(".photo-arrow.prev"),
    nextArrow: $(".photo-arrow.next"),
    asNavFor: $(".photo-nav"),
};

var resize_story_nav = function() {
    var $nav = $('.story__slider-preview')

    // width
    var width = $nav.width() || 1;
    
    // decrease size to smaller size to parent width
    width = Math.floor((76.9 / 100) * width);    

    // set maximal height
    var height = width - (width / 5);
    
    // each height
    $nav.find('.preview-wrap').each((i, o) => {
        $(o).css({
            'width': `${width}px`,
            'height': `${height}px`
        });
    });
}

var resize_storyCaption_nav = function() {
    var $nav = $('.story__slider-caption')

    // width
    var width = $nav.width() || 1;

    // decrease size to smaller size to parent width
    width = Math.floor((76.9 / 100) * width);    

    $nav.find('.story-details-wrapper').each((i, o) => {
        $(o).css({
            'width': `${width}px`,
        });
    });
}

// Resize Photo Nav
var resize_photo_nav = function() {
    var $nav = $('.photo-nav');

    // width
    var width = $nav.width() || 1;

    // decrease size to smaller size to parent width
    width = Math.floor(width - (38.4 / 100) * width);    

    // set maximal height
    var height = width + (width / 3);
    
    // each height
    $nav.find('.preview-wrap').each((i, o) => {
        $(o).css({
            'width': `${width}px`,
            'height': `${height}px`
        });
    });
}

// On Ready
$(document).ready(function () {
    storySlider();
    
    resize_story_nav();

    resize_storyCaption_nav();
    
    resize_photo_nav();

    var kadoWrapper = $('.kado-wrapper');
    if (kadoWrapper) {
        var intervalId = setInterval(function() {
            var $gifts_wrap = $('.hadiah-wrap');
            var $giftItem = $gifts_wrap.find('.hadiah-card-wrap');
    
            if ($giftItem.length) {
                // Sembunyikan semua item terlebih dahulu
                $giftItem.hide();
    
                // Tampilkan dua elemen pertama
                $giftItem.slice(0, 2).show();
    
                if ($giftItem.length > 2) {
                    var $buttonWrap = $('.more-gift-wrap');
                    $buttonWrap.addClass('show');
                }
    
                // Tentukan berapa item yang sudah ditampilkan
                var itemsToShow = 2;

                // Tombol untuk menampilkan lebih banyak hadiah
                $('#moreGifts').off('click').on('click', function() {
                    var hiddenItems = $giftItem.filter(':hidden'); // Ambil item yang tersembunyi

                    if (hiddenItems.length > 0) {
                        hiddenItems.slice(0, 2).fadeIn(); // Tampilkan dua item berikutnya

                        // Perbarui itemsToShow dengan dua item tambahan
                        itemsToShow += 2;

                        // Jika semua item sudah ditampilkan, sembunyikan tombol
                        if (itemsToShow >= $giftItem.length) {
                            $(this).hide();
                        }
                    }
                });
    
                // Toggle hadiah
                $('#toggleWrap').off('click').on('click', function() {
                    toggleGift(); // Fungsi toggle hadiah
                    $(this).toggleClass('active');
                });
    
                // Hentikan interval setelah elemen ditemukan
                clearInterval(intervalId);
            }
        }, 500); // Periksa setiap 500 milidetik
    }


    if ($(".photo-nav").children().length > 0) {
        // Slick
        $(".photo-nav").slick(photo_nav_options);
    }

    if ($(".photo-slider").children().length > 0) {
        // Slick
        $(".photo-slider").slick(photo_slider_options);
    }
})