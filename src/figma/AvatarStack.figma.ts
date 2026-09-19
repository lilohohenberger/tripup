// url=https://www.figma.com/design/hADCn3gOPrpKnZNj434wPo/Regress?node-id=2047-2472
// source=src/components/AvatarStack.tsx
// component=AvatarStack
import figma from 'figma'

export default {
  example: figma.code`<AvatarStack images={trip.members} size={40} onAdd={() => openAddMember()} />`,
  imports: ['import AvatarStack from "src/components/AvatarStack"'],
  id: 'avatar-stack',
  metadata: { nestable: true },
}
