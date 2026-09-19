// url=https://www.figma.com/design/hADCn3gOPrpKnZNj434wPo/Regress?node-id=2047-2495
// source=src/components/PillButton.tsx
// component=PillButton
import figma from 'figma'
const instance = figma.selectedInstance

const variant = instance.getEnum('Style', {
  'Primary': 'primary',
  'Secondary': 'secondary',
})
const texts = instance.findLayers((n) => n.type === 'TEXT')
const label = texts[0] ? texts[0].textContent : 'Label'

export default {
  example: figma.code`<PillButton variant="${variant}">${label}</PillButton>`,
  imports: ['import PillButton from "src/components/PillButton"'],
  id: 'pill-button',
  metadata: { nestable: true },
}
