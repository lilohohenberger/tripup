// url=https://www.figma.com/design/hADCn3gOPrpKnZNj434wPo/Regress?node-id=2047-2448
// source=src/components/PromptCard.tsx
// component=PromptCard
import figma from 'figma'
const instance = figma.selectedInstance

const texts = instance.findLayers((n) => n.type === 'TEXT')
const eyebrow = texts[0] ? texts[0].textContent : ''
const headline = texts[1] ? texts[1].textContent : ''

export default {
  example: figma.code`<PromptCard
  eyebrow="${eyebrow}"
  headline="${headline}"
  actions={
    <>
      <PillButton variant="secondary">Let the group decide!</PillButton>
      <PillButton variant="primary">Add plan</PillButton>
    </>
  }
/>`,
  imports: [
    'import PromptCard from "src/components/PromptCard"',
    'import PillButton from "src/components/PillButton"',
  ],
  id: 'prompt-card',
  metadata: { nestable: false },
}
