"use client";

// ============================================================================
// [HeroBackground3D.tsx] - Three.js 기반 3D 히어로 배경
// 기능성 도료(불연, 난연) 제조 기업 이미지를 표현하는 3D 그래픽
// ============================================================================

import React, { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Line } from "@react-three/drei";
import * as THREE from "three";

// ---------------------------------------------------------------------------
// 파티클 시스템 - 열/불꽃을 차단하는 보호 입자 느낌
// ---------------------------------------------------------------------------
function Particles({ count = 600 }: { count?: number }) {
    const meshRef = useRef<THREE.InstancedMesh>(null);
    const dummy = useMemo(() => new THREE.Object3D(), []);

    const particles = useMemo(() => {
        const temp = [];
        for (let i = 0; i < count; i++) {
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(2 * Math.random() - 1);
            const r = 2.5 + Math.random() * 4;
            temp.push({
                x: r * Math.sin(phi) * Math.cos(theta),
                y: r * Math.sin(phi) * Math.sin(theta),
                z: r * Math.cos(phi),
                speed: 0.002 + Math.random() * 0.006,
                offset: Math.random() * Math.PI * 2,
                scale: 0.01 + Math.random() * 0.03,
            });
        }
        return temp;
    }, [count]);

    useFrame((state) => {
        const time = state.clock.getElapsedTime();
        if (!meshRef.current) return;

        particles.forEach((particle, i) => {
            const { x, y, z, speed, offset, scale } = particle;

            // 천천히 공전하는 파티클
            const angle = time * speed + offset;
            const cos = Math.cos(angle);
            const sin = Math.sin(angle);

            dummy.position.set(
                x * cos - z * sin,
                y + Math.sin(time * 0.3 + offset) * 0.3,
                x * sin + z * cos
            );

            // 깜빡이는 효과
            const flicker = 0.5 + 0.5 * Math.sin(time * 1.5 + offset * 3);
            const s = scale * (0.7 + flicker * 0.6);
            dummy.scale.set(s, s, s);
            dummy.updateMatrix();
            meshRef.current!.setMatrixAt(i, dummy.matrix);
        });

        meshRef.current.instanceMatrix.needsUpdate = true;
    });

    return (
        <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
            <sphereGeometry args={[1, 6, 6]} />
            <meshBasicMaterial
                color="#8ab4d4"
                transparent
                opacity={0.4}
            />
        </instancedMesh>
    );
}

// ---------------------------------------------------------------------------
// 에너지 파티클 - 앰버/오렌지 색상의 활성 입자 (불연/난연 이미지)
// ---------------------------------------------------------------------------
function EnergyParticles({ count = 200 }: { count?: number }) {
    const meshRef = useRef<THREE.InstancedMesh>(null);
    const dummy = useMemo(() => new THREE.Object3D(), []);

    const particles = useMemo(() => {
        const temp = [];
        for (let i = 0; i < count; i++) {
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(2 * Math.random() - 1);
            const r = 1.8 + Math.random() * 2.5;
            temp.push({
                x: r * Math.sin(phi) * Math.cos(theta),
                y: r * Math.sin(phi) * Math.sin(theta),
                z: r * Math.cos(phi),
                speed: 0.004 + Math.random() * 0.008,
                offset: Math.random() * Math.PI * 2,
                scale: 0.008 + Math.random() * 0.02,
            });
        }
        return temp;
    }, [count]);

    useFrame((state) => {
        const time = state.clock.getElapsedTime();
        if (!meshRef.current) return;

        particles.forEach((particle, i) => {
            const { x, y, z, speed, offset, scale } = particle;
            const angle = time * speed + offset;
            const cos = Math.cos(angle);
            const sin = Math.sin(angle);

            dummy.position.set(
                x * cos - z * sin,
                y + Math.sin(time * 0.5 + offset) * 0.2,
                x * sin + z * cos
            );

            const pulse = 0.3 + 0.7 * Math.abs(Math.sin(time * 2 + offset * 5));
            const s = scale * pulse;
            dummy.scale.set(s, s, s);
            dummy.updateMatrix();
            meshRef.current!.setMatrixAt(i, dummy.matrix);
        });

        meshRef.current.instanceMatrix.needsUpdate = true;
    });

    return (
        <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
            <sphereGeometry args={[1, 6, 6]} />
            <meshBasicMaterial
                color="#d4a574"
                transparent
                opacity={0.5}
            />
        </instancedMesh>
    );
}

// ---------------------------------------------------------------------------
// 보호 쉴드 - 와이어프레임 구체 (기능성 도료 코팅막 이미지)
// ---------------------------------------------------------------------------
function Shield() {
    const meshRef = useRef<THREE.Mesh>(null);
    const meshRef2 = useRef<THREE.Mesh>(null);

    useFrame((state) => {
        const time = state.clock.getElapsedTime();
        if (meshRef.current) {
            meshRef.current.rotation.x = time * 0.05;
            meshRef.current.rotation.y = time * 0.08;
        }
        if (meshRef2.current) {
            meshRef2.current.rotation.x = -time * 0.03;
            meshRef2.current.rotation.z = time * 0.06;
        }
    });

    return (
        <group>
            {/* 외부 보호막 */}
            <mesh ref={meshRef}>
                <icosahedronGeometry args={[2.8, 1]} />
                <meshBasicMaterial
                    color="#4a7a9b"
                    wireframe
                    transparent
                    opacity={0.12}
                />
            </mesh>

            {/* 내부 보호막 */}
            <mesh ref={meshRef2}>
                <icosahedronGeometry args={[2.2, 2]} />
                <meshBasicMaterial
                    color="#6a9ab8"
                    wireframe
                    transparent
                    opacity={0.08}
                />
            </mesh>

            {/* 코어 글로우 */}
            <mesh>
                <sphereGeometry args={[0.6, 32, 32]} />
                <meshBasicMaterial
                    color="#3a6a8a"
                    transparent
                    opacity={0.15}
                />
            </mesh>
        </group>
    );
}

// ---------------------------------------------------------------------------
// 연결선 - 구조적 네트워크 (도료의 분자 결합 이미지)
// ---------------------------------------------------------------------------
function ConnectionLines() {
    const linesRef = useRef<THREE.Group>(null);

    const lines = useMemo(() => {
        const result: { start: THREE.Vector3; end: THREE.Vector3 }[] = [];
        const points: THREE.Vector3[] = [];

        for (let i = 0; i < 20; i++) {
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(2 * Math.random() - 1);
            const r = 2 + Math.random() * 2;
            points.push(
                new THREE.Vector3(
                    r * Math.sin(phi) * Math.cos(theta),
                    r * Math.sin(phi) * Math.sin(theta),
                    r * Math.cos(phi)
                )
            );
        }

        for (let i = 0; i < points.length; i++) {
            for (let j = i + 1; j < points.length; j++) {
                if (points[i].distanceTo(points[j]) < 2.5) {
                    result.push({ start: points[i], end: points[j] });
                }
            }
        }

        return result;
    }, []);

    useFrame((state) => {
        const time = state.clock.getElapsedTime();
        if (linesRef.current) {
            linesRef.current.rotation.y = time * 0.02;
            linesRef.current.rotation.x = Math.sin(time * 0.01) * 0.1;
        }
    });

    return (
        <group ref={linesRef}>
            {lines.map((line, i) => (
                <Line
                    key={i}
                    points={[
                        [line.start.x, line.start.y, line.start.z],
                        [line.end.x, line.end.y, line.end.z],
                    ]}
                    color="#4a7a9b"
                    transparent
                    opacity={0.06}
                    lineWidth={1}
                />
            ))}
        </group>
    );
}

// ---------------------------------------------------------------------------
// 메인 씬 - 전체 3D 씬 구성
// ---------------------------------------------------------------------------
function Scene() {
    const groupRef = useRef<THREE.Group>(null);

    useFrame((state) => {
        const time = state.clock.getElapsedTime();
        if (groupRef.current) {
            // 전체 씬의 미세한 움직임
            groupRef.current.rotation.y = time * 0.03;
            groupRef.current.position.y = Math.sin(time * 0.2) * 0.1;
        }
    });

    return (
        <group ref={groupRef} position={[1.5, 0, 0]}>
            <Shield />
            <Particles count={600} />
            <EnergyParticles count={200} />
            <ConnectionLines />
        </group>
    );
}

// ---------------------------------------------------------------------------
// 메인 컴포넌트 - Canvas 래퍼
// ---------------------------------------------------------------------------
export const HeroBackground3D: React.FC = () => {
    return (
        <Canvas
            camera={{ position: [0, 0, 7], fov: 50 }}
            dpr={[1, 1.5]}
            gl={{
                antialias: true,
                alpha: true,
                powerPreference: "high-performance",
            }}
            style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
            }}
        >
            <color attach="background" args={["#000000"]} />
            <fog attach="fog" args={["#000000", 6, 15]} />
            <Scene />
        </Canvas>
    );
};
