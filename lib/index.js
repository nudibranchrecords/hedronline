import Scene from './Scene'
import * as THREE from 'three'
import { getSingle } from './getSketchParams'

const spf60 = 1000 / 60

export class HedrOnline {
  constructor (config) {
    this.scene = new Scene()
    this.renderer = new THREE.WebGLRenderer()
    this.scene.renderer = this.renderer
    this.sketches = new Map()
    this.config = config

    this.renderer.setSize(window.innerWidth, window.innerHeight)
    document.body.appendChild(this.renderer.domElement)

    this.setSize(window.innerWidth, window.innerHeight)

    config.sketches.forEach(item => {
      // populate params with defaults from config
      this.addSketchToScene(item)
    })
  }

  addSketchToScene (item) {
    const meta = {
      sketchesFolder: `/sketches`,
    }

    const moduleItem = this.config.sketchModules[item.moduleKey]
    const Sketch = moduleItem.module

    const params = new Map()

    moduleItem.config.params.forEach(item => {
      params.set(item.key, {
        ...item,
        value: item.defaultValue,
        min: item.defaultMin,
        max: item.defaultMax,
      }
      )
    })

    const parsedParams = getSingle(params)
    const sketch = new Sketch(this.scene, parsedParams, meta)

    this.sketches.set(item.id, {
      params,
      sketch,
    })

    sketch.root && this.scene.scene.add(sketch.root)
  }

  updateSketchParam (sketchId, paramId, value) {
    const params = this.sketches.get(sketchId).params
    const param = params.get(paramId)
    param.value = value
  }

  fireShot (sketchId, shotId) {
    const item = this.sketches.get(sketchId)
    const sketch = item.sketch
    const params = getSingle(item.params)

    const newParams = sketch[shotId](params)

    for (const key in newParams) {
      const param = item.params.get(key)
      param.value = newParams[key]
    }
  }

  setSize (width, height) {
    this.renderer.setSize(width, height)
    this.scene.setRatio(width / height)
  }

  start () {
    let elapsedFrames = 1
    let tick = 0
    let oldTimeReal = performance.now()
    let newTime

    const animate = () => {
      requestAnimationFrame(animate)

      newTime = performance.now()

      elapsedFrames = (newTime - oldTimeReal) / spf60
      tick += elapsedFrames

      this.sketches.forEach(item => {
        const params = getSingle(item.params)
        item.sketch.update(params, tick, elapsedFrames)
      })

      this.renderer.render(this.scene.scene, this.scene.camera)

      oldTimeReal = newTime
    }

    animate()
  }
}
