import { useEffect, useRef } from "react";

export default function useAnimationFrame(
    callback,
    enabled = true
) {
    const callbackRef = useRef(callback);
    const frameRef = useRef();
    const lastTimeRef = useRef(null);
    useEffect(() => {
        callbackRef.current = callback;
    }, [callback]);
    useEffect(() => {
        if (!enabled) return;
        const loop = (time) => {
            if (lastTimeRef.current == null) {
                lastTimeRef.current = time;
            }
            const delta = time - lastTimeRef.current;
            lastTimeRef.current = time;
            callbackRef.current(delta);
            frameRef.current = requestAnimationFrame(loop);
        };
        frameRef.current = requestAnimationFrame(loop);
        return () => {
            if (frameRef.current) cancelAnimationFrame(frameRef.current);
            lastTimeRef.current = null;
        };
    }, [enabled]);
}
