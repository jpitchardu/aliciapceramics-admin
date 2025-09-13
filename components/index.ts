import {
  createBox,
  createText,
} from '@shopify/restyle'
import { Theme } from '../theme'

// Base components - these are all we really need for the migration
export const Box = createBox<Theme>()
export const Text = createText<Theme>()

// Export additional components that use Box as base for now
// We can enhance these later if needed
export { Box as Button }
export { Box as Card }