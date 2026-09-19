// url=https://www.figma.com/design/hADCn3gOPrpKnZNj434wPo/Regress?node-id=2047-2460
// source=src/components/IdeaCard.tsx
// component=IdeaCard
import figma from 'figma'
const instance = figma.selectedInstance

const texts = instance.findLayers((n) => n.type === 'TEXT')
const tag = texts[0] ? texts[0].textContent : 'Tag'
const title = texts[1] ? texts[1].textContent : 'Title'
const addedBy = texts[2] ? texts[2].textContent : ''

export default {
  example: figma.code`<IdeaCard
  idea={{
    id: "…",
    image: ideaImage,
    tag: "${tag}",
    title: "${title}",
    addedBy: "${addedBy}",
    voters: [avatarA, avatarB],
  }}
/>`,
  imports: ['import IdeaCard from "src/components/IdeaCard"'],
  id: 'idea-card',
  metadata: { nestable: false },
}
