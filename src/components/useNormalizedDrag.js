import { useEffect, useRef, useState } from 'react'

export default function useNormalizedDrag(mousePosition = { x: 0, y: 0 }, options = {}) {
    const { target = typeof window !== 'undefined' ? window : null } = options

    const [mouseNorm, setMouseNorm] = useState({ x: 0, y: 0 })
    const [drag, setDrag] = useState({ x: 0, y: 0 })        // live delta while dragging
    const [down, setDown] = useState(false)

    // persistent accumulated offset (normalized coords)
    const [accum, setAccum] = useState({ x: 0, y: 0 })

    // refs for latest values
    const mouseNormRef = useRef({ x: 0, y: 0 })
    const dragStartRef = useRef({ x: 0, y: 0 })
    const downRef = useRef(false)
    const targetRef = useRef(target)

    useEffect(() => { targetRef.current = target }, [target])

    // update normalized mouse and live drag delta
    useEffect(() => {
        const w = typeof window !== 'undefined' ? window.innerWidth : 1
        const h = typeof window !== 'undefined' ? window.innerHeight : 1
        const x = (mousePosition.x - w / 2) / w
        const y = (mousePosition.y - h / 2) / h
        const norm = { x, y }

        mouseNormRef.current = norm
        setMouseNorm(norm)

        if (downRef.current) {
            const d = {
                x: norm.x - dragStartRef.current.x,
                y: norm.y - dragStartRef.current.y,
            }
            setDrag(d)
        } else {
            setDrag({ x: 0, y: 0 })
        }
    }, [mousePosition])

    // pointer handlers: commit the live drag into accum on pointerup
    useEffect(() => {
        function getTarget() {
            const t = targetRef.current
            if (t && t.current) return t.current
            return t
        }

        function handlePointerDown(e) {
            const start = mouseNormRef.current
            dragStartRef.current = start
            downRef.current = true
            setDown(true)
            // reset live drag at start
            setDrag({ x: 0, y: 0 })
        }

        function handlePointerUp(e) {
            // commit latest live drag into accumulated offset
            // use the current live drag computed from refs:
            const latestDrag = {
                x: mouseNormRef.current.x - dragStartRef.current.x,
                y: mouseNormRef.current.y - dragStartRef.current.y,
            }

            // update accum atomically
            setAccum(prev => ({
                x: prev.x + latestDrag.x,
                y: prev.y + latestDrag.y,
            }))

            // clear live drag and mark up
            setDrag({ x: 0, y: 0 })
            downRef.current = false
            setDown(false)
        }

        function handlePointerCancel() {
            handlePointerUp()
        }

        const t = getTarget() || window
        if (!t || !t.addEventListener) return

        t.addEventListener('pointerdown', handlePointerDown)
        t.addEventListener('pointerup', handlePointerUp)
        t.addEventListener('pointercancel', handlePointerCancel)
        t.addEventListener('pointerleave', handlePointerCancel)

        return () => {
            t.removeEventListener('pointerdown', handlePointerDown)
            t.removeEventListener('pointerup', handlePointerUp)
            t.removeEventListener('pointercancel', handlePointerCancel)
            t.removeEventListener('pointerleave', handlePointerCancel)
        }
    }, [])

    return { mouseNorm, drag, down, accum, setAccum }
}