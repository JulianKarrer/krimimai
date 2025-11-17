import { useEffect, useRef } from "react";

export default function useAnimationFrame(
    callback,
    depends,
    enabled = true
) {
    const callbackRef = useRef(callback);
    const frameRef = useRef();
    useEffect(() => {
        callbackRef.current = callback;
    }, [callback, ...depends]);
    useEffect(() => {
        if (!enabled) return;
        const loop = (time) => {
            callbackRef.current(time/1000);
            frameRef.current = requestAnimationFrame(loop);
        };
        frameRef.current = requestAnimationFrame(loop);
        return () => {
            if (frameRef.current) cancelAnimationFrame(frameRef.current);
        };
    }, [enabled, ...depends]);
}
