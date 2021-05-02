import Lottie, { AnimationItem as LottieAnimationItem } from 'lottie-web';
import * as lottieData from '@/assets/logo.json';

export default class HomeController extends EventTarget {
    private element: HTMLElement;
    private lottie = {
        animation: null as null|LottieAnimationItem,
        elem: null as HTMLDivElement|null,
        resizeHandler: null as null|(() => unknown)
    };

    constructor(homeElem: HTMLElement) {
        super();
        this.element = homeElem;

        // Handle clicks for "convert files" button
        this.element.querySelector('button').addEventListener('click', () => { this.dispatchEvent(new Event('convert-files')); });

        // find lottie element
        const lottieElem: HTMLDivElement|null = this.element.querySelector('[data-grad-paa-lottie]');
        if (lottieElem === null) {
            // eslint-disable-next-line no-console
            console.error('Couldn\'t find lottie element');
            return;
        } else {
            lottieElem.removeAttribute('data-grad-paa-lottie');
            this.lottie.elem = lottieElem;
        }

        this.setupLottie();
    }

    private setupLottie() {
        if (this.lottie.elem === null) return;

        // remove placeholder image
        this.lottie.elem.innerHTML = '';

        this.lottie.animation = Lottie.loadAnimation({
            container: this.lottie.elem,
            renderer: 'canvas',
            loop: true,
            autoplay: true,
            animationData: lottieData
        });
        this.lottie.animation.play();

        this.lottie.resizeHandler = () => window.requestAnimationFrame(() => { this.lottie.animation?.resize(); });
        window.addEventListener('resize', this.lottie.resizeHandler);
    }

    private removeLottie() {
        this.lottie.animation?.destroy();
        if (this.lottie.resizeHandler !== null) window.removeEventListener('resize', this.lottie.resizeHandler);

        this.lottie.animation = null;
        this.lottie.resizeHandler = null;
    }

    public toggle (shown: boolean): void {
        if (shown) {
            this.element.style.display = '';

            window.requestAnimationFrame(() => {
                this.setupLottie();
            });
        } else {
            this.removeLottie();
            this.element.style.display = 'none';
        }
    }
}
