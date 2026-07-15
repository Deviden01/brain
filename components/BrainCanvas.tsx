'use client'

import { useEffect, useRef, useState, useMemo } from 'react'
import * as d3 from 'd3'
import { AnimatePresence } from 'motion/react'
import { Memory } from '@/types/memory'
import { getTagColor } from '@/lib/tagColors'
import MemoryCard from './MemoryCard'

interface BrainNode extends d3.SimulationNodeDatum {
  id: string
  memory: Memory
  radius: number
  primaryTag: string
  color: string
  degree: number
  clusterX: number
  clusterY: number
  z: number
  projX?: number
  projY?: number
  projZ?: number
  scale?: number
  alpha?: number
}

interface BrainLink extends d3.SimulationLinkDatum<BrainNode> {
  source: string | BrainNode
  target: string | BrainNode
  sharedTagsCount: number
}

const W = 1920
const H = 1080
const CENTER = { x: W / 2, y: H / 2 }

export default function BrainCanvas({ memories = [] }: { memories: Memory[] }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const svgRef = useRef<SVGSVGElement>(null)
  
  const [selected, setSelected] = useState<Memory | null>(null)
  const [tooltip, setTooltip] = useState<{ memory: Memory; x: number; y: number } | null>(null)
  const [activeTag, setActiveTag] = useState<string | null>(null)

  // 3D rotation state controlled by d3.zoom, stored in ref to avoid re-renders during tick
  const rot = useRef({ rx: 0, ry: 0, scale: 1 })

  const uniqueTags = useMemo(() => {
    const set = new Set<string>()
    ;(memories || []).forEach((m) => {
      if (m.tags && m.tags.length > 0) set.add(m.tags[0])
    })
    return Array.from(set)
  }, [memories])

  useEffect(() => {
    const svg = d3.select(svgRef.current!)
    svg.selectAll('.sim-g').remove()

    if (!memories || memories.length === 0) return

    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768
    const baseRadius = isMobile ? 65 : 30
    const radiusMultiplier = isMobile ? 18 : 8
    const maxRadius = isMobile ? 150 : 70
    const baseFontSize = isMobile ? 28 : 14

    const clusterCenters: Record<string, { x: number; y: number }> = {}
    const numClusters = uniqueTags.length || 1
    uniqueTags.forEach((tag, idx) => {
      const angle = (idx / numClusters) * Math.PI * 2 - Math.PI / 2
      const dist = 550
      clusterCenters[tag] = {
        x: CENTER.x + Math.cos(angle) * dist,
        y: CENTER.y + Math.sin(angle) * (dist * 0.75),
      }
    })

    const linkMap = new Map<string, number>()
    const links: BrainLink[] = []

    for (let i = 0; i < memories.length; i++) {
      for (let j = i + 1; j < memories.length; j++) {
        const m1 = memories[i]
        const m2 = memories[j]
        const shared = (m1.tags || []).filter((t) => (m2.tags || []).includes(t))
        if (shared.length > 0) {
          links.push({ source: m1.id, target: m2.id, sharedTagsCount: shared.length })
          linkMap.set(m1.id, (linkMap.get(m1.id) || 0) + 1)
          linkMap.set(m2.id, (linkMap.get(m2.id) || 0) + 1)
        }
      }
    }

    const nodes: BrainNode[] = memories.map((m) => {
      const degree = linkMap.get(m.id) || 0
      const primaryTag = (m.tags && m.tags[0]) || 'default'
      const cluster = clusterCenters[primaryTag] || CENTER
      
      const radius = Math.max(baseRadius, Math.min(maxRadius, baseRadius + degree * radiusMultiplier))
      const angle = Math.random() * Math.PI * 2
      const r = 100 + Math.random() * 400

      return {
        id: m.id,
        memory: m,
        degree,
        radius,
        primaryTag,
        color: getTagColor(primaryTag),
        clusterX: cluster.x,
        clusterY: cluster.y,
        x: cluster.x + Math.cos(angle) * r,
        y: cluster.y + Math.sin(angle) * r,
        z: (Math.random() - 0.5) * 800, // Z-axis spread for 3D volume
      }
    })

    const g = svg.append('g').attr('class', 'sim-g')
    const linksGroup = g.append('g').attr('class', 'links')
    const nodesGroup = g.append('g').attr('class', 'nodes')

    const sim = d3.forceSimulation<BrainNode>(nodes)
      .force('link', d3.forceLink<BrainNode, BrainLink>(links).id((d) => d.id).distance(280).strength(0.08))
      .force('charge', d3.forceManyBody<BrainNode>().strength(-400))
      .force('collide', d3.forceCollide<BrainNode>().radius((d) => d.radius + 20).strength(0.6))
      .force('clusterX', d3.forceX<BrainNode>((d) => d.clusterX).strength(0.03))
      .force('clusterY', d3.forceY<BrainNode>((d) => d.clusterY).strength(0.03))
      .force('center', d3.forceCenter(CENTER.x, CENTER.y).strength(0.01))
      .alphaDecay(0.015)

    const linkLines = linksGroup
      .selectAll<SVGLineElement, BrainLink>('line')
      .data(links)
      .join('line')
      .attr('stroke', 'rgba(255, 255, 255, 0.08)')
      .attr('stroke-width', 1.5)

    const nodeContainers = nodesGroup
      .selectAll<SVGGElement, BrainNode>('g.node-group')
      .data(nodes, (d) => d.id)
      .join('g')
      .attr('class', 'node-group')
      .style('cursor', 'pointer')

    // Clean Solid Glass (Colorful with White Outline)
    nodeContainers.append('circle')
      .attr('class', 'bubble-solid')
      .attr('r', (d) => d.radius)
      .attr('fill', (d) => d.color)
      .attr('fill-opacity', 0.85)
      .attr('stroke', 'rgba(255,255,255,0.6)')
      .attr('stroke-width', 1.5)
      .style('filter', 'none')
      .style('transition', 'fill 0.2s, fill-opacity 0.2s, stroke 0.2s, stroke-width 0.2s, filter 0.2s')

    // Outer Energy Ring (Halo) - Hidden in Idle
    nodeContainers.append('circle')
      .attr('class', 'bubble-ring')
      .attr('r', (d) => d.radius + 6)
      .attr('fill', 'none')
      .attr('stroke', 'rgba(255,255,255,0.15)')
      .attr('stroke-width', 1)
      .style('opacity', 0)
      .style('transition', 'r 0.3s ease, stroke 0.3s ease, stroke-width 0.3s ease, filter 0.3s ease, opacity 0.3s ease')

    nodeContainers.append('text')
      .attr('class', 'node-label')
      .attr('text-anchor', 'middle')
      .attr('fill', '#ffffff')
      .attr('font-size', String(baseFontSize))
      .attr('font-family', 'Inter, sans-serif')
      .attr('font-weight', '500')
      .attr('pointer-events', 'none')
      .text((d) => (d.degree > 1 ? (d.memory.title || '').substring(0, 20) + '...' : ''))

    // ── MATH 3D PROJECTION ──
    const getProj = (x: number, y: number, z: number) => {
      const rx = (rot.current.rx * Math.PI) / 180
      const ry = (rot.current.ry * Math.PI) / 180
      
      const cx = Math.cos(rx), sx = Math.sin(rx)
      const cy = Math.cos(ry), sy = Math.sin(ry)

      const dx = x - CENTER.x
      const dy = y - CENTER.y
      const dz = z

      // Rotate X (pitch)
      const y1 = dy * cx - dz * sx
      const z1 = dz * cx + dy * sx

      // Rotate Y (yaw)
      const x2 = dx * cy + z1 * sy
      const z2 = z1 * cy - dx * sy

      // Perspective Scale (Focal length 1200)
      const f = 1200
      const scale = f / (f - z2)

      return {
        px: x2 * scale * rot.current.scale + CENTER.x,
        py: y1 * scale * rot.current.scale + CENTER.y,
        pz: z2,
        s: Math.max(0.1, scale * rot.current.scale),
        alpha: Math.max(0.05, Math.min(1, (z2 + 800) / 1400)) // Fade based on depth
      }
    }

    const updatePositions = () => {
      // Calculate projections
      nodes.forEach(d => {
        const p = getProj(d.x!, d.y!, d.z)
        d.projX = p.px
        d.projY = p.py
        d.projZ = p.pz
        d.scale = p.s
        d.alpha = p.alpha
      })

      // Sort nodes by Z-index (Draw order) so closer nodes render on top!
      nodeContainers.sort((a, b) => (a.projZ || 0) - (b.projZ || 0))

      // Apply coordinates
      nodeContainers
        .attr('transform', d => `translate(${d.projX}, ${d.projY}) scale(${d.scale})`)
        .style('opacity', d => d.alpha ?? 1)
      
      nodeContainers.selectAll('.node-label')
        .attr('y', d => (d as BrainNode).radius + (isMobile ? 36 : 22) / ((d as BrainNode).scale || 1)) // keep label distance proportional
        .attr('font-size', d => baseFontSize / ((d as BrainNode).scale || 1)) // counter-scale text so it stays readable

      linkLines
        .each(function(l) {
          const s = l.source as BrainNode
          const t = l.target as BrainNode
          d3.select(this)
            .attr('x1', s.projX!)
            .attr('y1', s.projY!)
            .attr('x2', t.projX!)
            .attr('y2', t.projY!)
            .attr('stroke-opacity', Math.min(s.alpha!, t.alpha!) * 0.5)
        })
    }

    sim.on('tick', updatePositions)

    // Interactivity
    nodeContainers
      .on('mouseenter', function (event: MouseEvent, d: BrainNode) {
        d3.select(this).select('.bubble-solid')
          .attr('fill', d.color)
          .attr('fill-opacity', 0.85)
          .attr('stroke-width', 2)
          .attr('stroke', '#ffffff')
          .style('filter', `drop-shadow(0 0 35px ${d.color})`)
        
        d3.select(this).select('.bubble-ring')
          .style('opacity', 1)
          .attr('r', d.radius + 12)
          .attr('stroke', d.color)
          .attr('stroke-width', 2)
          .style('filter', `drop-shadow(0 0 15px ${d.color})`)
        
        setTooltip({ memory: d.memory, x: d.projX!, y: d.projY! - (d.radius * d.scale!) - 24 })
      })
      .on('mouseleave', function (_: MouseEvent, d: BrainNode) {
        d3.select(this).select('.bubble-solid')
          .attr('fill', d.color)
          .attr('fill-opacity', 0.85)
          .attr('stroke-width', 1.5)
          .attr('stroke', 'rgba(255,255,255,0.6)')
          .style('filter', 'none')
        
        d3.select(this).select('.bubble-ring')
          .style('opacity', 0)
          .attr('r', d.radius + 6)
          .attr('stroke', 'rgba(255,255,255,0.15)')
          .attr('stroke-width', 1)
          .style('filter', 'none')
          
        setTooltip(null)
      })
      .on('click', (event: MouseEvent, d: BrainNode) => {
        event.stopPropagation()
        setSelected(d.memory)
        setTooltip(null)
      })

    // D3 Zoom for Drag/Rotation control
    const zoomBehavior = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.3, 4])
      .filter((event) => {
        // Prevent zoom drag when clicking directly on a bubble or inside node
        const target = event.target as HTMLElement
        const isBubble = target?.classList?.contains('bubble-solid') || target?.classList?.contains('bubble-ring') || target?.closest('.node-group') !== null
        return !isBubble && !event.ctrlKey && !event.button
      })
      .on('zoom', (e) => {
        // e.transform.x & y are unbounded pan values. We map them to degrees!
        // Moving mouse right (positive x) -> rotate Y around positive
        rot.current = {
          rx: e.transform.y * 0.4,
          ry: e.transform.x * 0.4,
          scale: e.transform.k
        }
        updatePositions() // Force update even if sim is stopped
      })

    svg.call(zoomBehavior)
    svg.call(zoomBehavior.transform, d3.zoomIdentity.translate(isMobile ? 40 : 20, isMobile ? -30 : -10).scale(isMobile ? 0.95 : 1.1)) // Initial cool angle, zoomed in for big nodes

    return () => { sim.stop() }
  }, [memories, uniqueTags])

  return (
    <div className="relative w-full h-full flex items-center justify-center bg-transparent overflow-hidden">
      
      {/* Ambient background glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-indigo-600/10 rounded-full blur-[180px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-emerald-600/5 rounded-full blur-[180px] pointer-events-none" />

      <svg
        ref={svgRef}
        viewBox={`0 0 ${W} ${H}`}
        className="w-full h-full cursor-grab active:cursor-grabbing relative z-10"
        aria-label="3D Mathematical Knowledge Graph"
      >
        {tooltip && (
          <g transform={`translate(${tooltip.x},${tooltip.y})`} style={{ pointerEvents: 'none' }}>
            <rect x={-120} y={-64} width={240} height={56} rx={12} fill="rgba(5,5,10,0.9)" stroke="rgba(255,255,255,0.15)" strokeWidth="1" style={{ backdropFilter: 'blur(10px)' }} />
            <text x={0} y={-38} textAnchor="middle" fill="#fff" fontSize="13" fontWeight="600" fontFamily="Inter, sans-serif" letterSpacing="0.3">
              {(tooltip.memory.title || '').length > 28 ? (tooltip.memory.title || '').slice(0, 28) + '…' : (tooltip.memory.title || '')}
            </text>
            <text x={0} y={-18} textAnchor="middle" fill="#818cf8" fontSize="10" fontWeight="600" fontFamily="Inter, sans-serif" letterSpacing="1">
              {(tooltip.memory.tags || []).slice(0, 3).join(' • ').toUpperCase()}
            </text>
          </g>
        )}
      </svg>

      <div className="hidden sm:flex absolute bottom-6 left-1/2 -translate-x-1/2 z-20 items-center gap-4 px-6 py-2.5 bg-black/40 border border-white/10 backdrop-blur-md rounded-full text-[10px] text-slate-300 tracking-widest pointer-events-none">
        <span>🖱️ SCROLL TO ZOOM</span>
        <span className="w-1 h-1 rounded-full bg-slate-600" />
        <span>👆 DRAG TO ROTATE 3D</span>
        <span className="w-1 h-1 rounded-full bg-slate-600" />
        <span>✨ PURE MATH PROJECTION</span>
      </div>

      <AnimatePresence>
        {selected && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md pointer-events-auto">
            <MemoryCard
              memory={selected}
              onClose={() => setSelected(null)}
              onDelete={(id) => { console.log('delete', id); setSelected(null) }}
              onEdit={(m) => { console.log('edit', m.id); setSelected(null) }}
            />
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
