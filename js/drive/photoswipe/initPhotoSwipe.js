
function InitPhotoSwipe(driveData) {

    this.init = function (querySelector) {
        initPhoto();
        initPhotoSwipeFromDOM(querySelector);
    }

    function initPhoto() {
        const body = document.getElementsByTagName("body")[0];
        body.insertAdjacentHTML("beforeend", '<div class="pswp" index="-1" role="dialog" aria-hidden="true"><div class="pswp__bg"></div><div class="pswp__scroll-wrap"><div class="pswp__container"><div class="pswp__item"></div><div class="pswp__item"></div><div class="pswp__item"></div></div><div class="pswp__ui pswp__ui--hidden"><div class="pswp__top-bar"><div class="pswp__counter"></div><button class="pswp__button pswp__button--close" title="Close (Esc)"></button><button class="pswp__button pswp__button--share" title="Share"></button><button class="pswp__button pswp__button--fs" title="Toggle fullscreen"></button><button class="pswp__button pswp__button--zoom" title="Zoom in/out"></button><div class="pswp__preloader"><div class="pswp__preloader__icn"><div class="pswp__preloader__cut"><div class="pswp__preloader__donut"></div></div></div></div></div><div class="pswp__share-modal pswp__share-modal--hidden pswp__single-tap"><div class="pswp__share-tooltip"></div></div><button class="pswp__button pswp__button--arrow--left" title="Previous (arrow left)"></button><button class="pswp__button pswp__button--arrow--right" title="Next (arrow right)"></button><div class="pswp__caption"><div class="pswp__caption__center"></div></div></div></div></div>');
    }

    var initPhotoSwipeFromDOM = function (gallerySelector) {

        // parse slide data (url, title, size ...) from DOM elements 
        // (children of gallerySelector)

        var parseThumbnailElements = function (el) {
            var thumbElements = el.childNodes,
                numNodes = thumbElements.length,
                items = [],
                figureEl,
                linkEl,
                size,
                item;

            for (var i = 0; i < numNodes; i++) {

                figureEl = thumbElements[i]; // <figure> element

                // include only element nodes 
                if (figureEl.nodeType !== 1 || figureEl.id == 'space') {
                    continue;
                }

                linkEl = figureEl.children[0]; // <a> element
                const dataSize = linkEl.getAttribute('data-size');

                if (!dataSize) {
                    continue;
                }

                size = linkEl.getAttribute('data-size').split('x');

                // create slide object
                item = {
                    src: linkEl.getAttribute('href'),
                    w: parseInt(size[0], 10),
                    h: parseInt(size[1], 10)
                };



                if (figureEl.children.length > 1) {
                    // <figcaption> content
                    item.title = figureEl.children[1].innerHTML;
                }

                if (linkEl.children.length > 0) {
                    // <img> thumbnail element, retrieving thumbnail url
                    item.msrc = linkEl.children[0].getAttribute('src');
                }

                item.el = figureEl; // save link to element for getThumbBoundsFn
                items.push(item);
            }

            return items;
        };

        // find nearest parent element
        var closest = function closest(el, fn) {
            return el && (fn(el) ? el : closest(el.parentNode, fn));
        };

        // triggers when user clicks on thumbnail
        var onThumbnailsClick = function (e) {
            e = e || window.event;
            e.preventDefault ? e.preventDefault() : e.returnValue = false;

            var eTarget = e.target || e.srcElement;

            // find root element of slide
            var clickedListItem = closest(eTarget, function (el) {
                return (el.tagName && el.tagName.toUpperCase() === 'FIGURE');
            });

            if (!clickedListItem) {
                return;
            }

            // find index of clicked item by looping through all child nodes
            // alternatively, you may define index via data- attribute
            var clickedGallery = clickedListItem.parentNode,
                childNodes = clickedListItem.parentNode.childNodes,
                numChildNodes = childNodes.length,
                nodeIndex = 0,
                index;

            for (var i = 0; i < numChildNodes; i++) {
                if (childNodes[i].nodeType !== 1) {
                    continue;
                }

                if (childNodes[i] === clickedListItem) {
                    index = nodeIndex;
                    break;
                }
                nodeIndex++;
            }



            if (index >= 0) {
                // open PhotoSwipe if valid index found
                openPhotoSwipe(index, clickedGallery);
            }
            return false;
        };

        // parse picture index and gallery index from URL (#&pid=1&gid=2)
        var photoswipeParseHash = function () {
            var hash = window.location.hash.substring(1),
                params = {};

            if (hash.length < 5) {
                return params;
            }

            var vars = hash.split('&');
            for (var i = 0; i < vars.length; i++) {
                if (!vars[i]) {
                    continue;
                }
                var pair = vars[i].split('=');
                if (pair.length < 2) {
                    continue;
                }
                params[pair[0]] = pair[1];
            }

            if (params.gid) {
                params.gid = parseInt(params.gid, 10);
            }

            if (!params.hasOwnProperty('pid')) {
                return params;
            }
            params.pid = parseInt(params.pid, 10);
            return params;
        };

        var openPhotoSwipe = function (index, galleryElement, disableAnimation) {
            var pswpElement = document.querySelectorAll('.pswp')[0],
                gallery,
                options,
                items;

            items = parseThumbnailElements(galleryElement);

            // define options (if needed)
            options = {
                index: index,

                // define gallery index (for URL)
                galleryUID: galleryElement.getAttribute('data-pswp-uid'),

                getThumbBoundsFn: function (index) {

                    if (items.length != 0) {

                        var thumbnail = items[index].el.getElementsByTagName('img')[0], // find thumbnail
                            pageYScroll = window.pageYOffset || document.documentElement.scrollTop,
                            rect = thumbnail.getBoundingClientRect();

                        return { x: rect.left, y: rect.top + pageYScroll, w: rect.width };
                    }

                },

                getDoubleTapZoom: function (isMouseClick, item) {

                    // isMouseClick          - true if mouse, false if double-tap
                    // item                  - slide object that is zoomed, usually current
                    // item.initialZoomLevel - initial scale ratio of image
                    //                         e.g. if viewport is 700px and image is 1400px,
                    //                              initialZoomLevel will be 0.5

                    if (isMouseClick) {

                        var level = window.innerWidth / item.w;

                        if (level > 1) {
                            return 1;
                        }

                        return level;

                    } else {
                        return item.initialZoomLevel < 0.7 ? 1 : 1.5;
                    }
                }

            };

            if (disableAnimation) {
                options.showAnimationDuration = 0;
            }

            // Pass data to PhotoSwipe and initialize it
            gallery = new PhotoSwipe(pswpElement, PhotoSwipeUI_Default, items, options);
            driveData.setPswp(gallery);

            var zoom, level;

            mGallery = gallery;

            gallery.listen('initialZoomInEnd', function () {
                driveData.setKeyEvent(true);
                isDoubleClicked = false;

                const div = document.createElement("div");
                div.setAttribute("id", "clickZone");

                const wrap = document.getElementsByClassName("pswp__scroll-wrap")[0];
                wrap.appendChild(div);
            });

            gallery.listen('initialZoomOut', function () {
                driveData.setKeyEvent(false);
                isZoom = false;
                document.getElementById("clickZone").remove();
            });

            gallery.listen('beforeChange', function () {
                zoom = gallery.getZoomLevel();
            });

            gallery.listen('afterChange', function () {

                if (isZoom) {

                    let item = gallery.currItem;

                    if (item.initialZoomLevel == 1) {
                        return;
                    }

                    let z = window.innerWidth / item.w;

                    if (z <= 1) {
                        gallery.applyZoomPan(z, 0, 0);

                    } else {
                        let x = (window.innerWidth - item.w) / 2;
                        gallery.applyZoomPan(1, x, 60);
                    }
                }

            });

            gallery.init();
        };



        // loop through all gallery elements and bind events
        var galleryElements = document.querySelectorAll(gallerySelector);

        for (var i = 0, l = galleryElements.length; i < l; i++) {
            galleryElements[i].setAttribute('data-pswp-uid', i + 1);
            galleryElements[i].onclick = onThumbnailsClick;
        }

        // Parse URL and open gallery if it contains #&pid=3&gid=1
        var hashData = photoswipeParseHash();
        if (hashData.pid > 0 && hashData.gid > 0) {
            openPhotoSwipe(hashData.pid - 1, galleryElements[hashData.gid - 1], true);
        }
    };

    var getDevice = (function () {
        var ua = navigator.userAgent;
        if (ua.indexOf('iPhone') > 0 || ua.indexOf('iPod') > 0 || ua.indexOf('Android') > 0 && ua.indexOf('Mobile') > 0) {
            return 'sp';
        } else if (ua.indexOf('iPad') > 0 || ua.indexOf('Android') > 0) {
            return 'tab';
        } else {
            return 'other';
        }
    })();

    let isDoubleClicked;
    let isZoom;

    document.addEventListener("click", function () {

        if (!driveData.isKeyEvent()) {
            return;
        }

        const zone = document.getElementById("clickZone");

        if (isDoubleClicked) {
            isDoubleClicked = false;
            zone.classList.remove("hide");
            zone.classList.add("show");

            if (!isZoom) {
                isZoom = true;
            } else {
                isZoom = false;
            }

            return;
        }

        isDoubleClicked = true;
        zone.classList.add("hide");
        zone.classList.remove("show");

        setTimeout(function () {

            if (isDoubleClicked) {

                zone.classList.remove("hide");
                zone.classList.add("show");
                mGallery.prev();
            }

            isDoubleClicked = false;

        }, 300);

    });

    document.addEventListener("contextmenu", function (e) {

        if (!driveData.isKeyEvent()) {
            return;
        }

        e.preventDefault();
        mGallery.next();

        const zone = document.getElementById("clickZone");
        zone.classList.remove("hide");
        zone.classList.add("show");
        return false;

    });

}