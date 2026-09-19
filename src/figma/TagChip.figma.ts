// url=https://www.figma.com/design/hADCn3gOPrpKnZNj434wPo/Regress?node-id=2047-2463
// source=src/components/TagChip.tsx
// component=TagChip
import figma from 'figma'
const instance = figma.selectedInstance

const texts = instance.findLayers((n) => n.type === 'TEXT')
const label = texts[0] ? texts[0].textContent : 'Tag'

export default {
  example: figma.code`<TagChip label="${label}" />`,
  imports: ['import TagChip from "src/components/TagChip"'],
  id: 'tag-chip',
  metadata: { nestable: true },
}
