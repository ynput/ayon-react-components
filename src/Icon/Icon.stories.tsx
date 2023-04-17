import type { Meta, StoryObj } from '@storybook/react'
import { Icon } from '.'
import { Toolbar } from '../Layout/Toolbar'

const meta: Meta<typeof Icon> = {
  component: Icon,
  tags: ['autodocs'],
}

export default meta

type Story = StoryObj<typeof Icon>

const iconsToDisplay = [
  'content_copy',
  'add_circle',
  'image',
  'folder',
  'category',
  'live_tv',
  'smart_toy',
  'movie',
  'theaters',
  'task_alt',
  'palette',
  'language',
  'brush',
  'ev_shadow',
  'construction',
  'imagesearch_roller',
  'scene',
  'directions_run',
  'fireplace',
  'highlight',
  'video_stable',
  'layers',
  'gesture',
  'switch_video',
]

const All = () => (
  <Toolbar>
    {iconsToDisplay.map((icon) => (
      <Icon key={icon} icon={icon} />
    ))}
  </Toolbar>
)

export const Icons: Story = {
  render: All,
}
