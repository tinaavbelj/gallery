class Gallery {
    constructor(options) {
        const context = this;
        this.mouseDownOnContainer = false;
        this.touchStartOnContainer = false;
        this.resizing = false;

        this.saveParameters(options);
        this.addLoader();
        this.loadImages().then(function() {
            context.addImagesToContainer();
            context.addPagination();
            context.addEventListeners();
        });
    }

    saveParameters(options) {
        this.container = options['container'];
        this.container.className = 'gallery__container';
        this.api = options['api'];
        this.looping = options['looping'];
    }

    addLoader() {
        this.loader = document.createElement('label');
        this.loader.innerHTML = 'Loading images...';
        this.loader.className = 'gallery__loader';
        this.container.appendChild(this.loader);
    }

    loadImages() {
        const context = this;

        return new Promise(function (resolve, reject) {
            const request = new XMLHttpRequest();

            request.open('GET', `http://localhost:3000/${context.api}`, true);

            request.onreadystatechange = function() {
                if (this.readyState == XMLHttpRequest.DONE) {
                    if (this.status == 200) {
                        const response = JSON.parse(this.responseText);
                        context.imagesUrl = response.map(item => item.url);
                        context.imagesNumber = context.imagesUrl.length;
                        resolve();
                    }
                }
            };
            request.onerror = function() {
                throw Error(`Error when calling the API at ${context.api}`);
                reject();
            }

            request.send();
        });
    }

    addImagesToContainer() {
        this.imagesContainer = document.createElement('div');
        this.imagesContainer.className = 'gallery__images-container';
        this.imagesContainer.style.opacity = 0;

        const numberOfImagesRepeating = this.looping ? 3 : 1;
        this.activeImageIndex = this.looping ? this.imagesNumber : 0;

        const context = this;
        let counter = 0;

        for (let j = 0; j < numberOfImagesRepeating; j++) {
            for (let i = 0; i < this.imagesNumber; i++) {
                const image = document.createElement('img');
                image.onload = function() {
                    image.style.height = `${context.container.offsetHeight}px`;
                    image.className = 'gallery__image';

                    if (++counter === numberOfImagesRepeating * context.imagesNumber) {
                        context.calculateAllImagesWidth();
                        context.calculateFirstImageTranslateValue();
                        context.imagesContainer.style.transform = `translate(${context.firstOffset}px)`;
                        context.saveLoopingAttributes();

                        context.loader.style.opacity = 0;
                        context.imagesContainer.style.opacity = 1;
                    }
                }
                image.src = this.imagesUrl[i];
                this.imagesContainer.appendChild(image);
            }
        }

        this.container.appendChild(this.imagesContainer);
    }

    calculateFirstImageTranslateValue(event) {
        if (this.looping) {
            this.firstOffset = this.container.offsetWidth / 2 - this.allImagesWidth / 3 - this.imagesContainer.childNodes[0].width / 2;
        } else {
            this.firstOffset = this.container.offsetWidth / 2 - this.imagesContainer.childNodes[0].width / 2;
            this.lastOffset = -1 * this.allImagesWidth + this.container.offsetWidth / 2 + this.imagesContainer.childNodes[this.imagesNumber - 1].offsetWidth / 2;
        }
    }

    addPagination() {
        this.pagination = document.createElement('div');
        this.pagination.className = 'gallery__pagination';

        for (let i = 0; i < this.imagesNumber; i++) {
            const newCircle = document.createElement('div');
            newCircle.id = i.toString();
            newCircle.className = (i == this.activeImageIndex % this.imagesNumber) ? 'gallery__active-pagination-circle' : 'gallery__pagination-circle';
            this.pagination.appendChild(newCircle);
        }

        this.container.appendChild(this.pagination);
    }

    calculateAllImagesWidth(event) {
        const images = this.imagesContainer.childNodes;
        let width = 0;
        for (let i = 0; i < images.length; i++) {
            width += images[i].width;
        }
        this.allImagesWidth = width;
    }

    addEventListeners() {
        this.swipeThreshold = 0.2;

        window.addEventListener('resize', event => this.resize(event));
        window.addEventListener('resize', event => this.calculateAllImagesWidth(event));
        window.addEventListener('resize', event => this.calculateFirstImageTranslateValue(event));

        this.mouseDown = this.mousedown.bind(this);
        this.container.addEventListener('mousedown', this.mouseDown);

        document.addEventListener('mouseup', event => this.mouseup(event));

        this.touchStart = this.touchstart.bind(this);
        this.container.addEventListener('touchstart', this.touchStart);

        document.addEventListener('touchend', event => this.touchend(event));
    }

    saveLoopingAttributes() {
        const images = this.imagesContainer.childNodes;
        const oneImagesSetWidth = Math.round(this.allImagesWidth / 3);
        let middleWidth = Math.round(oneImagesSetWidth / 2);
        let widthSum = 0;
        let middleImageIndex = 0;

        for (let i = 0; i < images.length / 3; i++) {
            widthSum += images[i].width;
            if (middleWidth <= widthSum) {
                middleImageIndex = i;
                break;
            }
        }

        this.middleImageIndexRight = middleImageIndex + 2 * this.imagesNumber;
        this.middleImageIndexLeft = middleImageIndex;
    }

    mousedown(event) {
        event.preventDefault();

        this.mouseDownOnContainer = true;

        this.startPosition = event.clientX;
        this.startTime = new Date().getTime();
        this.movedItem = false;

        this.mouseMove = this.mousemove.bind(this);
        this.container.addEventListener('mousemove', this.mouseMove);
    }

    mousemove(event) {
        event.preventDefault();
        this.moveItem(event.clientX);
    }

    mouseup(event) {
        event.preventDefault();
        if(!this.mouseDownOnContainer) {
            return;
        }

        if (!this.movedItem) {
            this.goToItem(this.activeImageIndex);
        }
        this.container.removeEventListener('mousemove', this.mouseMove);
        this.mouseDownOnContainer = false;
    }

    touchstart(event) {
        event.preventDefault();

        this.touchStartOnContainer = true;

        this.startPosition = event.touches[0].clientX;
        this.startTime = new Date().getTime();
        this.movedItem = false;

        this.touchMove = this.touchmove.bind(this);
        this.container.addEventListener('touchmove', this.touchMove);
    }

    touchend(event) {
        event.preventDefault();
        if(!this.touchStartOnContainer) {
            return;
        }

        if (!this.movedItem) {
            this.goToItem(this.activeImageIndex);
        }

        this.container.removeEventListener('touchmove', this.touchMove);
        this.container.addEventListener('touchstart', this.touchStart);
        this.touchStartOnContainer = false;
    }

    touchmove(event) {
        event.preventDefault();
        this.moveItem(event.touches[0].clientX);
    }

    moveItem(x) {
        if (this.shouldMoveToPreviousItem(x)) {
            this.previousItem();
            this.container.removeEventListener('mousemove', this.mouseMove);
            this.container.removeEventListener('touchmove', this.touchMove);
            this.movedItem = true;
        } else if (this.shouldMoveToNextItem(x)) {
            this.nextItem();
            this.container.removeEventListener('mousemove', this.mouseMove);
            this.container.removeEventListener('touchmove', this.touchMove);
            this.movedItem = true;
        } else {
            const currentOffset = this.getTransformValue(this.imagesContainer);

            let offset = this.startPosition - x;
            offset = currentOffset - offset * 2;

            if (!this.looping && !this.shouldMove(offset)) {
                this.movedItem = true;
                return;
            } else {
                this.translateWithTransition(this.imagesContainer, offset, false);
                this.movedItem = false;
            }
        }
    }

    shouldMove(offset) {
        if (offset <= this.lastOffset || offset >= this.firstOffset) {
            return false;
        }

        return true;
    }

    shouldMoveToPreviousItem(x) {
        if (x > this.startPosition && Math.abs(x - this.startPosition) > this.swipeThreshold * this.container.offsetWidth) {
            return true;
        }
        return false;
    }

    shouldMoveToNextItem(x) {
        if (x < this.startPosition && Math.abs(x - this.startPosition) > this.swipeThreshold * this.container.offsetWidth) {
            return true;
        }
        return false;
    }

    getTransformValue(element) {
        const elementComputed = window.getComputedStyle(element);
        const matrix = new WebKitCSSMatrix(elementComputed.webkitTransform);
        return matrix.m41;
    }

    translateWithTransition(element, value, itemChanging) {
        element.style.transition = 'transform 0.4s ease-in-out';
        element.style.transform = `translate(${value}px)`;

        if (itemChanging) {
            console.log("remove")
            this.container.removeEventListener('mousedown', this.mouseDown);
            this.container.removeEventListener('touchstart', this.touchStart);
        }

        element.addEventListener('transitionend', event => {
            element.style.transition = 'none';
            if (itemChanging) {
                console.log("in transition end")
                this.container.addEventListener('mousedown', this.mouseDown);
                this.container.addEventListener('touchstart', this.touchStart);
            }
        });
    }

    resize(event) {
        const images = this.imagesContainer.childNodes;
        for (let i = 0; i < images.length ; i++) {
            images[i].style.height = `${this.container.offsetHeight}px`;
        }
        this.resizing = true;
        this.goToItem(this.activeImageIndex);
    }

    updatePagination(newActiveImageIndex, oldActiveImageIndex) {
        let circles = this.pagination.childNodes;

        let oldIndex = circles[oldActiveImageIndex % this.imagesNumber].id;
        let newIndex = circles[newActiveImageIndex % this.imagesNumber].id;

        circles[newIndex].className = 'gallery__active-pagination-circle';
        circles[oldIndex].className = 'gallery__pagination-circle';
    }

    nextItem() {
        if (!this.looping && this.activeImageIndex === this.imagesNumber - 1) {
            return;
        }
        this.goToItem(this.activeImageIndex + 1);
    }

    previousItem() {
        if (!this.looping && this.activeImageIndex === 0) {
            return;
        }
        this.goToItem(this.activeImageIndex - 1);
    }

    goToItem(index) {
        if (index != this.activeImageIndex) {
            this.updatePagination(index, this.activeImageIndex);
        }

        const images = this.imagesContainer.childNodes;

        let offset = 0;
        for (let i = 0; i < index; i++) {
            offset += images[i].width;
        }
        const newOffset = offset - this.container.offsetWidth / 2 + images[index].offsetWidth / 2;
        offset = newOffset > 0 ? newOffset * -1 : this.firstOffset;

        if(this.resizing) {
            this.imagesContainer.style.transition = 'none';
            this.imagesContainer.style.transform = `translate(${offset}px)`;
            this.resizing = false;
            return;
        }

        this.translateWithTransition(this.imagesContainer, offset, true);
        this.activeImageIndex = index;

        this.imagesContainer.addEventListener('transitionend', event => {
            if (this.looping) {
                this.changeTranslateValue();
            }
        });
    }

    changeTranslateValue() {
        if (this.activeImageIndex === this.middleImageIndexRight) {
            const translateValue = this.getTransformValue(this.imagesContainer);
            const newTranslateValue = translateValue + this.allImagesWidth / 3;

            this.translateWithTransition(this.imagesContainer, newTranslateValue, false);
            this.activeImageIndex = this.activeImageIndex - this.imagesNumber;
        } else if (this.activeImageIndex === this.middleImageIndexLeft) {
            const translateValue = this.getTransformValue(this.imagesContainer);
            const newTranslateValue = translateValue - this.allImagesWidth / 3;

            this.translateWithTransition(this.imagesContainer, newTranslateValue, false);
            this.activeImageIndex = this.activeImageIndex + this.imagesNumber;
        }
    }
}
