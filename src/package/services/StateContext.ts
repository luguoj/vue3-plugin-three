import {ref, ShallowRef, watch} from "vue";

export class StateContext {
    static readonly PR = Math.round(window.devicePixelRatio || 1)
    static readonly  PANEL_SIZE = {
        WIDTH: 80 * StateContext.PR,
        HEIGHT: 48 * StateContext.PR,
        TEXT_X: 3 * StateContext.PR,
        TEXT_Y: 2 * StateContext.PR,
        GRAPH_X: 3 * StateContext.PR,
        GRAPH_Y: 15 * StateContext.PR,
        GRAPH_WIDTH: 74 * StateContext.PR,
        GRAPH_HEIGHT: 30 * StateContext.PR
    }
    readonly PANELS = [
        ['FPS', '#0ff', '#002'],
        ['MS', '#0f0', '#020'],
        ['MB', '#f08', '#201']
    ]
    readonly panelValues = [
        {min: Infinity, max: 0},
        {min: Infinity, max: 0},
        {min: Infinity, max: 0}
    ]

    readonly canvasRef: ShallowRef<HTMLCanvasElement | undefined> = ref<HTMLCanvasElement>()
    canvasContext: CanvasRenderingContext2D | null = null
    beginTime: number = (performance || Date).now()
    prevTime: number = this.beginTime
    frames: number = 0;

    constructor() {
        watch(this.canvasRef, canvas => {
            if (canvas) {
                const PR = StateContext.PR
                const {WIDTH, HEIGHT, TEXT_X, TEXT_Y, GRAPH_X, GRAPH_Y, GRAPH_WIDTH, GRAPH_HEIGHT} = StateContext.PANEL_SIZE
                const context = this.canvasContext = canvas.getContext('2d')!;
                context.font = 'bold ' + (9 * PR) + 'px Helvetica,Arial,sans-serif';
                context.textBaseline = 'top';
                for (let i = 0; i < this.PANELS.length; i++) {
                    const OFFSET_Y = HEIGHT * i;
                    const panel = this.PANELS[i];
                    const [name, fg, bg] = panel
                    context.fillStyle = bg;
                    context.fillRect(0, 0 + OFFSET_Y, WIDTH, HEIGHT);

                    context.fillStyle = fg;
                    context.fillText(name, TEXT_X, TEXT_Y + OFFSET_Y);
                    context.fillRect(GRAPH_X, GRAPH_Y + OFFSET_Y, GRAPH_WIDTH, GRAPH_HEIGHT);

                    context.fillStyle = bg;
                    context.globalAlpha = 0.9;
                    context.fillRect(GRAPH_X, GRAPH_Y + OFFSET_Y, GRAPH_WIDTH, GRAPH_HEIGHT);
                }
            }
        })
    }

    begin() {
        this.beginTime = (performance || Date).now();
    }

    end() {
        this.frames++;
        const time = (performance || Date).now();
        this.updatePanel(1, {value: time - this.beginTime, maxValue: 200})

        if (time >= this.prevTime + 1000) {
            this.updatePanel(0, {value: (this.frames * 1000) / (time - this.prevTime), maxValue: 100})
            this.prevTime = time;
            this.frames = 0;
            const memory = (performance as any).memory;
            this.updatePanel(2, {value: memory.usedJSHeapSize / 1048576, maxValue: memory.jsHeapSizeLimit / 1048576});
        }
        return time;
    }

    update() {
        this.beginTime = this.end();
    }

    private updatePanel(i: number, values: { value: number, maxValue: number }) {
        if (this.canvasContext && this.canvasRef.value) {
            const canvas = this.canvasRef.value
            const context = this.canvasContext
            const PR = StateContext.PR
            const {WIDTH, HEIGHT, TEXT_X, TEXT_Y, GRAPH_X, GRAPH_Y, GRAPH_WIDTH, GRAPH_HEIGHT} = StateContext.PANEL_SIZE
            const OFFSET_Y = HEIGHT * i;
            const panel = this.PANELS[i];
            const [name, fg, bg] = panel
            const {value, maxValue} = values
            const panelValue = this.panelValues[i]
            const min = panelValue.min = Math.min(panelValue.min, value);
            const max = panelValue.max = Math.max(panelValue.max, value);

            context.fillStyle = bg;
            context.globalAlpha = 1;
            context.fillRect(0, 0 + OFFSET_Y, WIDTH, GRAPH_Y);
            context.fillStyle = fg;
            context.fillText(Math.round(value) + ' ' + name + ' (' + Math.round(min) + '-' + Math.round(max) + ')', TEXT_X, TEXT_Y + OFFSET_Y);

            context.drawImage(canvas, GRAPH_X + PR, GRAPH_Y + OFFSET_Y, GRAPH_WIDTH - PR, GRAPH_HEIGHT, GRAPH_X, GRAPH_Y + OFFSET_Y, GRAPH_WIDTH - PR, GRAPH_HEIGHT);

            context.fillRect(GRAPH_X + GRAPH_WIDTH - PR, GRAPH_Y + OFFSET_Y, PR, GRAPH_HEIGHT);

            context.fillStyle = bg;
            context.globalAlpha = 0.9;
            context.fillRect(GRAPH_X + GRAPH_WIDTH - PR, GRAPH_Y + OFFSET_Y, PR, Math.round((1 - (value / maxValue)) * GRAPH_HEIGHT));
        }
    }
}