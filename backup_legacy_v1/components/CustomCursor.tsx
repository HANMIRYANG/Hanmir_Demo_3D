import React, { useEffect, useRef, useState } from 'react';

interface Splatter {
    id: number;
    x: number;
    y: number;
    color: string;
    size: number;
    dx: number;
    dy: number;
    life: number;
}

export const CustomCursor: React.FC = () => {
    const cursorRef = useRef<HTMLDivElement>(null);
    const cursorDotRef = useRef<HTMLDivElement>(null);
    const [splatters, setSplatters] = useState<Splatter[]>([]);
    const [isHovering, setIsHovering] = useState(false);
    const [isClicking, setIsClicking] = useState(false);
    
    // Hanmir Brand Colors
    const colors = ['#2563EB', '#EA580C', '#FFFFFF'];

    useEffect(() => {
        const cursor = cursorRef.current;
        const cursorDot = cursorDotRef.current;
        
        const moveCursor = (e: MouseEvent) => {
            if (cursor && cursorDot) {
                // Smooth follow for the outer ring
                cursor.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
                // Instant follow for the inner dot
                cursorDot.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
            }
        };

        const handleMouseDown = (e: MouseEvent) => {
            setIsClicking(true);
            createSplatter(e.clientX, e.clientY);
        };

        const handleMouseUp = () => {
            setIsClicking(false);
        };

        const handleMouseOver = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            if (target.tagName === 'A' || target.tagName === 'BUTTON' || target.closest('a') || target.closest('button')) {
                setIsHovering(true);
            } else {
                setIsHovering(false);
            }
        };

        window.addEventListener('mousemove', moveCursor);
        window.addEventListener('mousedown', handleMouseDown);
        window.addEventListener('mouseup', handleMouseUp);
        window.addEventListener('mouseover', handleMouseOver);

        // Splatter Animation Loop
        let animationFrameId: number;
        const animateSplatters = () => {
            setSplatters(prev => prev.map(s => ({
                ...s,
                x: s.x + s.dx,
                y: s.y + s.dy,
                life: s.life - 0.02
            })).filter(s => s.life > 0));
            animationFrameId = requestAnimationFrame(animateSplatters);
        };
        animationFrameId = requestAnimationFrame(animateSplatters);

        return () => {
            window.removeEventListener('mousemove', moveCursor);
            window.removeEventListener('mousedown', handleMouseDown);
            window.removeEventListener('mouseup', handleMouseUp);
            window.removeEventListener('mouseover', handleMouseOver);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    const createSplatter = (x: number, y: number) => {
        const newSplatters: Splatter[] = [];
        const count = 5 + Math.random() * 5; // Generate 5-10 particles

        for (let i = 0; i < count; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = 2 + Math.random() * 4;
            newSplatters.push({
                id: Date.now() + i,
                x: x,
                y: y,
                color: colors[Math.floor(Math.random() * colors.length)],
                size: 4 + Math.random() * 8,
                dx: Math.cos(angle) * speed,
                dy: Math.sin(angle) * speed,
                life: 1.0
            });
        }

        setSplatters(prev => [...prev, ...newSplatters]);
    };

    return (
        <div className="pointer-events-none fixed inset-0 z-[9999] overflow-hidden">
            {/* Paint Splatters */}
            {splatters.map(s => (
                <div
                    key={s.id}
                    style={{
                        position: 'absolute',
                        left: s.x,
                        top: s.y,
                        width: s.size,
                        height: s.size,
                        backgroundColor: s.color,
                        borderRadius: '50% 60% 40% 70%', // Organic shape
                        opacity: s.life,
                        transform: `translate(-50%, -50%) scale(${s.life})`,
                        transition: 'opacity 0.1s linear',
                        boxShadow: `0 0 10px ${s.color}80` // Glow effect
                    }}
                />
            ))}

            {/* Main Cursor (Outer Ring / Brush Edge) */}
            <div
                ref={cursorRef}
                className={`fixed top-0 left-0 w-8 h-8 rounded-full border-2 border-white/50 transition-all duration-100 ease-out -translate-x-1/2 -translate-y-1/2 pointer-events-none mix-blend-difference
                    ${isHovering ? 'scale-150 bg-white/10 border-white/80' : 'scale-100'}
                    ${isClicking ? 'scale-75 border-blue-500' : ''}
                `}
            />

            {/* Inner Dot (Brush Tip) */}
            <div 
                ref={cursorDotRef}
                className={`fixed top-0 left-0 w-2 h-2 rounded-full bg-white transition-all duration-75 ease-out -translate-x-1/2 -translate-y-1/2 pointer-events-none mix-blend-difference
                     ${isHovering ? 'bg-orange-500' : 'bg-white'}
                     ${isClicking ? 'bg-blue-500 scale-125' : ''}
                `}
            />
            
            {/* Brush Label (Optional - shows tool name) */}
            <div 
                className="fixed top-0 left-0 ml-6 mt-6 text-[10px] text-white/50 tracking-widest font-mono pointer-events-none"
                style={{
                    transform: cursorRef.current ? cursorRef.current.style.transform : undefined,
                    opacity: isHovering ? 1 : 0,
                    transition: 'opacity 0.2s'
                }}
            >
                PAINT
            </div>
        </div>
    );
};