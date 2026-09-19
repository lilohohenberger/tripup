// url=https://www.figma.com/design/hADCn3gOPrpKnZNj434wPo/Regress?node-id=2047-2496
// source=src/components/ItineraryItem.tsx
// component=ItineraryItem
import figma from 'figma'
const instance = figma.selectedInstance

const state = instance.getEnum('State', {
  'Next': 'next',
  'Default': 'default',
})
const texts = instance.findLayers((n) => n.type === 'TEXT')
const title = texts[0] ? texts[0].textContent : 'Title'
const address = texts[1] ? texts[1].textContent : ''
const start = texts[2] ? texts[2].textContent : ''
const end = texts[3] ? texts[3].textContent : ''

export default {
  example: figma.code`<ItineraryItem
  entry={{
    id: "…",
    title: "${title}",
    address: "${address}",
    start: "${start}",
    end: "${end}",
    state: "${state}",
  }}
/>`,
  imports: ['import ItineraryItem from "src/components/ItineraryItem"'],
  id: 'itinerary-item',
  metadata: { nestable: true },
}
