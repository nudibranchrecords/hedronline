// Demo related CSS
import './main.css'

import { HedrOnline } from './lib'

// Import your sketches and their configs
import Solid from './sketches/solid'
import solidConfig from './sketches/solid/config'

const app = new HedrOnline({
  // You may want more than one of the same sketch, so we define the modules here
  sketchModules: {
    solid: {
      module: Solid,
      config: solidConfig,
    },
  },
  // And use the modules in the list of sketches in the scene here
  sketches: [
    {
      id: 'solid_0',
      moduleKey: 'solid', // Keys are based on the sketchModules property names
    },
  ],
})

// Start the thing
app.start()

// Programatically change params
app.updateSketchParam('solid_0', 'rotSpeedX', 0.6)
app.updateSketchParam('solid_0', 'rotSpeedY', 0.6)

// Fire a shot on body click
document.addEventListener('click', () => {
  app.fireShot('solid_0', 'shapeShift')
})

// Make it responsive
window.addEventListener('resize', () => {
  app.setSize(window.innerWidth, window.innerHeight)
})
