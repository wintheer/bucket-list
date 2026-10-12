<template>
  <div class="max-w-6xl mx-auto px-6 py-10">
    <div class="flex items-start justify-between mb-8">
      <div>
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Where I've been</h1>
        <p class="text-gray-500 dark:text-gray-400 mt-1 text-sm max-w-md">
          Click a country to mark it as visited. Scroll to zoom, drag to pan.
        </p>
      </div>
      <div v-if="countries.length" class="text-right shrink-0">
        <p class="text-2xl font-bold text-gray-900 dark:text-white tabular-nums">
          {{ visitedCount }}<span class="text-gray-300 dark:text-gray-600 text-lg font-normal"> / {{ countries.length }}</span>
        </p>
        <p class="text-xs text-gray-400">{{ percent }}% of the world</p>
      </div>
    </div>

    <!-- Map -->
    <div class="relative rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden mb-10">
      <div v-if="!countries.length || !store.loaded" class="aspect-[2/1] animate-pulse bg-gray-100 dark:bg-gray-800" />
      <div
        v-show="countries.length && store.loaded"
        ref="zoomEl"
        class="map ocean cursor-grab active:cursor-grabbing select-none"
      >
      <svg
        ref="svgEl"
        :viewBox="`0 0 ${WIDTH} ${HEIGHT}`"
        class="w-full h-auto block"
        @mouseleave="hovered = null"
      >
        <g ref="mapEl" :style="{ '--label-size': `${LABEL_SIZE}px` }">
          <path
            v-for="c in countries"
            :key="c.name"
            :d="c.d"
            class="country"
            :class="store.visitedNames.has(c.name) ? 'country--visited' : ''"
            :style="{ '--hue': c.hue }"
            @click="onCountryClick(c.name)"
            @mouseenter="hovered = c.name"
          />
          <text
            v-for="c in visibleLabels"
            :key="`label-${c.name}`"
            :x="c.labelX"
            :y="c.labelY"
            class="country-label"
          >{{ c.name }}</text>
        </g>
      </svg>
      </div>

      <div
        v-if="hovered"
        class="absolute top-3 left-3 px-3 py-1.5 rounded-lg bg-white/90 dark:bg-gray-900/90 text-sm text-gray-800 dark:text-gray-100 shadow-sm pointer-events-none"
      >
        {{ hovered }}
        <span v-if="store.visitedNames.has(hovered)" class="text-primary-500 ml-1">✓</span>
      </div>

      <div class="absolute bottom-3 right-3 flex flex-col gap-1">
        <UButton size="xs" color="neutral" variant="outline" icon="i-lucide-plus" @click="zoomBy(1.5)" />
        <UButton size="xs" color="neutral" variant="outline" icon="i-lucide-minus" @click="zoomBy(1 / 1.5)" />
        <UButton size="xs" color="neutral" variant="outline" icon="i-lucide-maximize" @click="resetZoom" />
      </div>
    </div>

    <!-- List, for countries too small to click on the map -->
    <div class="grid md:grid-cols-2 gap-10">
      <div>
        <p class="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-4">Visited</p>
        <p v-if="!store.visited.length" class="text-sm text-gray-400">Nowhere yet. Where did your travels begin?</p>
        <div class="flex flex-wrap gap-2">
          <button
            v-for="c in sortedVisited"
            :key="c.id"
            class="group px-3 py-1 rounded-full text-sm bg-primary-50 dark:bg-primary-950 text-primary-700 dark:text-primary-300 hover:bg-red-50 dark:hover:bg-red-950 hover:text-red-500 transition-colors"
            :title="`Remove ${c.name}`"
            @click="store.toggle(c.name)"
          >
            {{ c.name }} <span class="opacity-40 group-hover:opacity-100">×</span>
          </button>
        </div>
      </div>

      <div>
        <p class="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-4">All countries</p>
        <input
          v-model="search"
          type="text"
          placeholder="Search..."
          class="w-full bg-transparent border-b border-gray-200 dark:border-gray-700 focus:border-primary-400 dark:focus:border-primary-600 focus:outline-none py-1.5 mb-3 text-gray-900 dark:text-white placeholder:text-gray-300 dark:placeholder:text-gray-700 transition-colors"
        />
        <div class="max-h-80 overflow-y-auto pr-2">
          <label
            v-for="c in filteredCountries"
            :key="c.name"
            class="flex items-center gap-3 py-1.5 text-sm text-gray-700 dark:text-gray-300 cursor-pointer hover:text-gray-900 dark:hover:text-white"
            @mouseenter="hovered = c.name"
            @mouseleave="hovered = null"
          >
            <input
              type="checkbox"
              class="accent-primary-500"
              :checked="store.visitedNames.has(c.name)"
              @change="store.toggle(c.name)"
            />
            {{ c.name }}
          </label>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { geoNaturalEarth1, geoPath, type GeoPermissibleObjects } from 'd3-geo'
import { zoom, zoomIdentity, type ZoomBehavior, type ZoomTransform } from 'd3-zoom'
import { select } from 'd3-selection'
import 'd3-transition'
import { feature, neighbors } from 'topojson-client'
import type { Topology, GeometryCollection } from 'topojson-specification'
import { useTravelStore } from '~/stores/travel'

const store = useTravelStore()

const WIDTH = 960
const HEIGHT = 500
// Label font size in map units at zoom 1; divided by the zoom scale so text stays the same size on screen
const LABEL_SIZE = 9
// Hues for a political-map look: coral, amber, lime, teal, sky, violet, pink
const HUES = [12, 38, 95, 165, 205, 260, 325]

// Greedy graph colouring so bordering countries never share a hue
function assignHues(adjacency: number[][]) {
  const hues: number[] = []
  const order = adjacency.map((_, i) => i).sort((a, b) => adjacency[b]!.length - adjacency[a]!.length)
  for (const i of order) {
    const taken = new Set(adjacency[i]!.map(j => hues[j]))
    hues[i] = HUES.find(h => !taken.has(h)) ?? HUES[i % HUES.length]!
  }
  return hues
}

const zoomEl = ref<HTMLDivElement | null>(null)
const svgEl = ref<SVGSVGElement | null>(null)
const mapEl = ref<SVGGElement | null>(null)
interface Country {
  name: string
  d: string
  hue: number
  labelX: number
  labelY: number
  labelWidth: number // width/height of the main landmass at zoom 1, to decide when the label fits
  labelHeight: number
}

const countries = ref<Country[]>([])
// Zoom scale rounded down to quarter-octave steps; only used to pick which labels fit, so it changes rarely
const labelScale = ref(1)
const hovered = ref<string | null>(null)
const search = ref('')

let zoomBehavior: ZoomBehavior<HTMLDivElement, unknown> | null = null
// A drag ends with a click event; ignore it so panning doesn't toggle countries
let dragged = false
// The transform the SVG was last drawn at. Zoom transforms are in screen pixels of the map container
let committed = zoomIdentity
let resizeObserver: ResizeObserver | null = null

// Redrawing ~100k vertices every frame stutters, so during a gesture the already-drawn SVG is moved
// as a GPU layer with a CSS transform, and only redrawn sharp at the new zoom once the gesture ends
function preview(t: ZoomTransform) {
  const s = t.k / committed.k
  svgEl.value!.style.transform = `translate(${t.x - s * committed.x}px, ${t.y - s * committed.y}px) scale(${s})`
}

function commit(t: ZoomTransform) {
  const pxPerUnit = zoomEl.value!.clientWidth / WIDTH
  mapEl.value!.setAttribute('transform', `translate(${t.x / pxPerUnit},${t.y / pxPerUnit}) scale(${t.k})`)
  mapEl.value!.style.setProperty('--k', String(t.k))
  svgEl.value!.style.transform = ''
  committed = t
  labelScale.value = 2 ** (Math.floor(Math.log2(t.k) * 4) / 4)
}

// d3-zoom's default constrain, but against the container's current size so it survives resizes
function constrain(t: ZoomTransform, extent: [[number, number], [number, number]]) {
  const [[x0, y0], [x1, y1]] = extent
  const dx0 = t.invertX(x0) - x0, dx1 = t.invertX(x1) - x1
  const dy0 = t.invertY(y0) - y0, dy1 = t.invertY(y1) - y1
  return t.translate(
    dx1 > dx0 ? (dx0 + dx1) / 2 : Math.min(0, dx0) || Math.max(0, dx1),
    dy1 > dy0 ? (dy0 + dy1) / 2 : Math.min(0, dy0) || Math.max(0, dy1),
  )
}

onMounted(async () => {
  store.load()

  // 50m resolution includes small island nations; loaded lazily so it only ships with this page
  const topo = (await import('world-atlas/countries-50m.json')).default as unknown as Topology<{ countries: GeometryCollection<{ name: string }> }>
  const geo = feature(topo, topo.objects.countries)
  const projection = geoNaturalEarth1().fitExtent([[8, 8], [WIDTH - 8, HEIGHT - 8]], geo)
  const path = geoPath(projection)
  const hues = assignHues(neighbors(topo.objects.countries.geometries))
  countries.value = geo.features
    .map((f, i) => {
      // Label the largest polygon, so e.g. France isn't labelled in the Atlantic between Europe and French Guiana
      let main: GeoPermissibleObjects = f
      if (f.geometry.type === 'MultiPolygon') {
        const polygons = f.geometry.coordinates.map(coordinates => ({ type: 'Polygon', coordinates }) as const)
        main = polygons.reduce((a, b) => path.area(b) > path.area(a) ? b : a)
      }
      const [labelX, labelY] = path.centroid(main)
      const [[x0, y0], [x1, y1]] = path.bounds(main)
      return { name: f.properties.name, d: path(f) ?? '', hue: hues[i]!, labelX, labelY, labelWidth: x1 - x0, labelHeight: y1 - y0 }
    })
    .filter(c => c.d)
    .sort((a, b) => a.name.localeCompare(b.name))

  // Transforms are applied directly to the DOM: going through Vue would re-render every country on each frame
  zoomBehavior = zoom<HTMLDivElement, unknown>()
    .scaleExtent([1, 20])
    .constrain(constrain)
    .on('start', () => { dragged = false })
    .on('zoom', (e) => {
      if (e.sourceEvent?.type === 'mousemove') dragged = true
      preview(e.transform)
    })
    .on('end', e => commit(e.transform))
  select(zoomEl.value!).call(zoomBehavior)

  // Zoom is in pixels, so a width change would shift the map; start over at the new size
  let width = zoomEl.value!.clientWidth
  resizeObserver = new ResizeObserver(() => {
    const w = zoomEl.value!.clientWidth
    if (w === width || !w) return
    width = w
    select(zoomEl.value!).call(zoomBehavior!.transform, zoomIdentity)
  })
  resizeObserver.observe(zoomEl.value!)
})

onBeforeUnmount(() => {
  resizeObserver?.disconnect()
  if (zoomEl.value) select(zoomEl.value).on('.zoom', null)
})

function onCountryClick(name: string) {
  if (dragged) return
  store.toggle(name)
}

function zoomBy(k: number) {
  if (zoomBehavior) select(zoomEl.value!).transition().duration(250).call(zoomBehavior.scaleBy, k)
}

function resetZoom() {
  if (zoomBehavior) select(zoomEl.value!).transition().duration(250).call(zoomBehavior.transform, zoomIdentity)
}

// Only label countries big enough on screen to fit their name; more appear as you zoom in
const visibleLabels = computed(() => {
  const size = LABEL_SIZE / labelScale.value
  return countries.value.filter(c =>
    c.labelWidth >= c.name.length * size * 0.55 && c.labelHeight >= size * 1.2,
  )
})

const visitedCount = computed(() => countries.value.filter(c => store.visitedNames.has(c.name)).length)
const percent = computed(() => countries.value.length ? Math.round(visitedCount.value / countries.value.length * 100) : 0)

const sortedVisited = computed(() => [...store.visited].sort((a, b) => a.name.localeCompare(b.name)))

const filteredCountries = computed(() => {
  const q = search.value.trim().toLowerCase()
  return q ? countries.value.filter(c => c.name.toLowerCase().includes(q)) : countries.value
})
</script>

<style scoped>
/* Each country carries --hue; unvisited are pastel, visited the saturated version of the same hue */
.map {
  --land-s: 70%;
  --land-l: 86%;
  --land-hover-l: 78%;
  --visited-s: 75%;
  --visited-l: 48%;
  --visited-hover-l: 40%;
  --ocean: #a9c9ec;
  --border: #fff;
}
:global(.dark) .map {
  --land-s: 18%;
  --land-l: 40%;
  --land-hover-l: 47%;
  --visited-s: 75%;
  --visited-l: 60%;
  --visited-hover-l: 68%;
  --ocean: #162c48;
  --border: #162c48;
}
.ocean {
  background: var(--ocean);
}
.map svg {
  transform-origin: 0 0;
  will-change: transform;
}
.country {
  fill: hsl(var(--hue) var(--land-s) var(--land-l));
  stroke: var(--border);
  stroke-width: 0.5;
  vector-effect: non-scaling-stroke;
  cursor: pointer;
  transition: fill 0.15s;
}
.country:hover {
  fill: hsl(var(--hue) var(--land-s) var(--land-hover-l));
}
.country--visited {
  fill: hsl(var(--hue) var(--visited-s) var(--visited-l));
}
.country-label {
  /* Divided by the zoom scale so text stays the same size on screen */
  font-size: calc(var(--label-size) / var(--k, 1));
  stroke-width: calc(2.5px / var(--k, 1));
  fill: #1f2937;
  stroke: rgb(255 255 255 / 0.7);
  paint-order: stroke;
  text-anchor: middle;
  dominant-baseline: central;
  font-weight: 500;
  pointer-events: none;
}
:global(.dark) .country-label {
  fill: #f3f4f6;
  stroke: rgb(3 7 18 / 0.7);
}
.country--visited:hover {
  fill: hsl(var(--hue) var(--visited-s) var(--visited-hover-l));
}
</style>
