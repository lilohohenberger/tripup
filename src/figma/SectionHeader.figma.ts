// url=https://www.figma.com/design/hADCn3gOPrpKnZNj434wPo/Regress?node-id=2047-2477
// source=src/components/SectionHeader.tsx
// component=SectionHeader
import figma from 'figma'
const instance = figma.selectedInstance

const texts = instance.findLayers((n) => n.type === 'TEXT')
const title = texts[0] ? texts[0].textContent : 'Section'

export default {
  example: figma.code`<SectionHeader title="${title}" />`,
  imports: ['import SectionHeader from "src/components/SectionHeader"'],
  id: 'section-header',
  metadata: { nestable: true },
}
