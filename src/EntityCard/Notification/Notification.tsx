import { Icon, IconType } from '../../Icon'
import * as Styled from './Notification.styled'

// type NotificationType = 'comment' | 'due' | 'overdue'
export type Notification = {
  comment?: boolean
  due?: boolean
  overdue?: boolean
}

type NotificationKey = keyof Notification

type NotificationConfig = {
  color: string
  icon: IconType
}

const notifications: Record<NotificationKey, NotificationConfig> = {
  comment: {
    color: 'primary',
    icon: 'forum',
  },
  due: {
    color: 'warning',
    icon: 'schedule',
  },
  overdue: {
    color: 'error',
    icon: 'alarm',
  },
}

// if there are multiple notifications, the priority is based on the order of the keys, first has highest priority
const notificationPriorities: NotificationKey[] = ['overdue', 'due', 'comment']

const resolveNotification = (notification: Notification): NotificationConfig | undefined => {
  const highest = notificationPriorities.find((key) => notification[key] === true)
  return highest ? notifications[highest] : undefined
}

const resolveColors = (colorKey: string): { backgroundColor: string; color: string } => {
  const color = `--md-sys-color-on-${colorKey}`
  const backgroundColor = `--md-sys-color-${colorKey}`

  return {
    backgroundColor: `var(${backgroundColor})`,
    color: `var(${color})`,
  }
}

import { forwardRef } from 'react'

export interface NotificationProps extends React.HTMLAttributes<HTMLDivElement> {
  notification?: Notification
}

export const NotificationDot = forwardRef<HTMLDivElement, NotificationProps>(
  ({ notification, style = {}, ...props }, ref) => {
    if (!notification) return null
    // get the notification color and icon
    const config = resolveNotification(notification)
    if (!config) return null
    const { icon, color: colorKey } = config
    const { backgroundColor, color } = resolveColors(colorKey)

    return (
      <Styled.Notification style={{ backgroundColor, ...style }} {...props} ref={ref}>
        <Icon icon={icon} style={{ color }} />
      </Styled.Notification>
    )
  },
)
