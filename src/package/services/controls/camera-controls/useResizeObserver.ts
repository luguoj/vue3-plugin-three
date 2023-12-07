export function useResizeObserver<CTX extends {
    eventTarget: HTMLElement,
    object: { handleResize: () => void }
}>(ctx: CTX) {
    const resizeObserver = new ResizeObserver(() => {
        console.log('resize')
        ctx.object.handleResize()
    })
    resizeObserver.observe(ctx.eventTarget)

    function dispose() {
        resizeObserver.disconnect()
    }

    return {
        dispose
    }
}