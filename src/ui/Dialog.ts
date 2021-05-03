const template = document.createElement('template');
template.innerHTML = `
    <div class="grad-paa-dialog__backdrop"></div>
    <div class="grad-paa-dialog__dialog">
        <h2 class="grad-paa-dialog__heading"></h2>
        <button class="grad-paa-dialog__close grad-paa--not-responsive">
            <i class="material-icons-round">cancel</i>
        </button>
        <div class="grad-paa-dialog__actions"></div>
    </div>
`;

export class Dialog {
    protected element: HTMLElement;

    constructor(heading: string, content: HTMLDivElement, options: { close?: boolean, actions?: HTMLElement[] }) {
        this.element = document.createElement('div');
        this.element.className = 'grad-paa-dialog';

        this.element.appendChild(template.content.cloneNode(true));
        document.body.appendChild(this.element);

        // double RAF to make sure, that the element is rendered before the "shown" class
        // is added. This will ensure that the animation will actually trigger
        window.requestAnimationFrame(() => {
            window.requestAnimationFrame(() => {
                this.element.classList.add('grad-paa-dialog--shown');
            });
        });

        if (heading.length > 0) {
            this.element.querySelector('.grad-paa-dialog__heading').textContent = heading;
        } else {
            this.element.querySelector('.grad-paa-dialog__heading').remove();
        }

        if (options.close === false) {
            this.element.querySelector('.grad-paa-dialog__close').remove();
        } else {
            this.element.querySelector('.grad-paa-dialog__close').addEventListener('click', () => this.close());
            this.element.querySelector('.grad-paa-dialog__dialog').classList.add('grad-paa-dialog--close');
        }

        content.classList.add('grad-paa-dialog__content');

        this.element.querySelector('.grad-paa-dialog__dialog').appendChild(content);

        const actionsContainer = this.element.querySelector('.grad-paa-dialog__actions');
        for (const el of (options.actions ?? [])) {
            actionsContainer.appendChild(el);
        }
    }

    protected get dialogElement (): HTMLElement {
        return this.element.querySelector('.grad-paa-dialog__dialog');
    }

    public close(): void {
        this.element.classList.remove('grad-paa-dialog--shown');

        window.setTimeout(() => {
            this.element.remove();
        }, 400);
    }
}
