"use client";

import React, { useEffect, useRef, useState } from 'react';

// Paint particle interface
interface PaintParticle {
    id: number;
    x: number;
    y: number;
    color: string;
    size: number;
    life: number; // 1.0 to 0
    angle: number;
}

export const CustomCursor: React.FC = () => {
    const cursorRef = useRef<HTMLDivElement>(null);
    const cursorDotRef = useRef<HTMLDivElement>(null);
    const [particles, setParticles] = useState<PaintParticle[]>([]);
    const [isHovering, setIsHovering] = useState(false);

    // Disable on admin pages
    const pathname = typeof window !== 'undefined' ? window.location.pathname : '';
    const isAdmin = pathname.startsWith('/admin');

    // Positions to track movement for throttling
    const lastPos = useRef({ x: 0, y: 0 });
    const particleIdCounter = useRef(0);

    // Hanmir Brand Colors: Blue and Orange
    const brandColors = ['#2563EB', '#EA580C'];

    useEffect(() => {
        if (isAdmin) return;

        const cursor = cursorRef.current;
        const cursorDot = cursorDotRef.current;

        const handleMouseMove = (e: MouseEvent) => {
            if (cursor && cursorDot) {
                // Main cursor movement
                cursor.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
                cursorDot.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
            }

            // Calculate distance from last particle
            const dist = Math.hypot(e.clientX - lastPos.current.x, e.clientY - lastPos.current.y);

            // Only create particle if moved enough (brush spacing)
            if (dist > 8) {
                createParticle(e.clientX, e.clientY);
                lastPos.current = { x: e.clientX, y: e.clientY };
            }
        };

        const handleMouseOver = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            if (target.tagName === 'A' || target.tagName === 'BUTTON' || target.closest('a') || target.closest('button')) {
                setIsHovering(true);
            } else {
                setIsHovering(false);
            }
        };

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseover', handleMouseOver);

        // Animation Loop for particles
        let animationFrameId: number;
        const animate = () => {
            setParticles(prev =>
                prev
                    .map(p => ({
                        ...p,
                        life: p.life - 0.015, // Speed of fading
                        size: p.size * 0.99   // Shrink slightly
                    }))
                    .filter(p => p.life > 0)
            );
            animationFrameId = requestAnimationFrame(animate);
        };
        animationFrameId = requestAnimationFrame(animate);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseover', handleMouseOver);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    const createParticle = (x: number, y: number) => {
        const color = brandColors[Math.floor(Math.random() * brandColors.length)];
        const size = 12 + Math.random() * 15; // Varying brush thickness
        const angle = Math.random() * 360;

        const newParticle: PaintParticle = {
            id: particleIdCounter.current++,
            x,
            y,
            color,
            size,
            life: 1.0,
            angle
        };

        setParticles(prev => [...prev.slice(-40), newParticle]); // Limit particles for performance
    };



    if (isAdmin) return null;

    return (
        <div className="pointer-events-none fixed inset-0 z-[9999] overflow-hidden">
            {/* Paint Strokes (Brush Trail) */}
            {particles.map(p => (
                <div
                    key={p.id}
                    style={{
                        position: 'absolute',
                        left: p.x,
                        top: p.y,
                        width: p.size,
                        height: p.size * 1.2, // Slightly elongated like a brush tip
                        backgroundColor: p.color,
                        borderRadius: '40% 60% 30% 70% / 60% 30% 70% 40%', // Irregular brush shape
                        opacity: p.life * 0.6,
                        filter: 'blur(2px)', // Soften for paint feel
                        transform: `translate(-50%, -50%) rotate(${p.angle}deg) scale(${p.life})`,
                        boxShadow: `0 0 15px ${p.color}40`,
                    }}
                />
            ))}

            {/* Main Cursor (Brush Ring) */}
            <div
                ref={cursorRef}
                className={`fixed top-0 left-0 w-6 h-6 rounded-full border border-white/30 transition-all duration-75 ease-out -translate-x-1/2 -translate-y-1/2 pointer-events-none mix-blend-difference
                    ${isHovering ? 'scale-150 border-white/60 bg-white/5' : 'scale-100'}
                `}
            />

            {/* Center Dot (Brush Contact Point) */}
            <div
                ref={cursorDotRef}
                className={`fixed top-0 left-0 w-1 h-1 rounded-full bg-white transition-all duration-75 ease-out -translate-x-1/2 -translate-y-1/2 pointer-events-none mix-blend-difference
                     ${isHovering ? 'scale-0' : 'scale-100'}
                `}
            />

            {/* Legend (Shows "BRUSH") */}
            <div
                className="fixed top-0 left-0 ml-6 mt-6 text-[9px] text-white/40 tracking-[0.3em] font-mono pointer-events-none uppercase"
                style={{
                    transform: cursorRef.current ? cursorRef.current.style.transform : undefined,
                }}
            >
                Brush
            </div>
        </div>
    );
};