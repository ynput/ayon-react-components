// import icons
import 'material-symbols/outlined.css'

import './fonts.scss'

// import styles here
import './index.scss'
// import theme
import './theme/theme.scss'
// export theme
export * as theme from './theme'

// export all components here
// ASSIGNEE
// assigneeField
export { AssigneeField } from './Dropdowns/AssigneeSelect/AssigneeField'
export type { AssigneeFieldProps } from './Dropdowns/AssigneeSelect/AssigneeField'
// assigneeDropdownTemplate
// export { AssigneeDropdownTemplate } from './AssigneeSelect/AssigneeDropdownTemplate'
// assigneeSelect
export { AssigneeSelect } from './Dropdowns/AssigneeSelect/AssigneeSelect'
export type { AssigneeSelectProps } from './Dropdowns/AssigneeSelect/AssigneeSelect'
// watcherSelect
export { WatcherSelect } from './Dropdowns/WatcherSelect'
export type { WatcherSelectProps } from './Dropdowns/WatcherSelect'
// tagsSelect
export { TagsSelect } from './Dropdowns/TagsSelect'
export type { TagsSelectProps } from './Dropdowns/TagsSelect'
// iconSelect
export { IconSelect } from './Dropdowns/IconSelect'
export type { IconSelectProps } from './Dropdowns/IconSelect'
// enumDropdown
export { EnumDropdown, EnumTemplate } from './Dropdowns/EnumDropdown'
export type { EnumDropdownProps } from './Dropdowns/EnumDropdown'
// versionSelect
export { VersionSelect } from './Dropdowns/VersionSelect'
export type { VersionSelectProps } from './Dropdowns/VersionSelect'
// sortingDropdown
export { SortingDropdown } from './Dropdowns/SortingDropdown'
export type { SortingDropdownProps, SortCardType } from './Dropdowns/SortingDropdown'
// statusSelect
export { StatusSelect, StatusField } from './Dropdowns/StatusSelect'
export type { StatusSelectProps, StatusFieldProps, Status } from './Dropdowns/StatusSelect'

// BUTTONS
export { Button } from './Buttons/Button'
export type { ButtonProps } from './Buttons/Button'
export { SaveButton } from './Buttons/SaveButton'
export type { SaveButtonProps } from './Buttons/SaveButton'
export { SwitchButton } from './Buttons/SwitchButton'
export type { SwitchButtonProps } from './Buttons/SwitchButton'

export { ShortcutTag } from './ShortcutTag'
export type { ShortcutTagProps } from './ShortcutTag'

// dropdown
export { Dropdown, DefaultValueTemplate, DefaultItemTemplate } from './Dropdowns/Dropdown'
export type {
  DropdownProps,
  DefaultValueTemplateProps,
  DefaultItemTemplateProps,
  DropdownRef,
} from './Dropdowns/Dropdown'

// SEARCH FILTER
export * from './SearchFilter'

// FileUpload
export { FileUpload } from './FileUpload'
export type { FileUploadProps } from './FileUpload'
export { FileCard, getMimeTypeIcon, getFileSizeString } from './FileCard'
export type { FileCardProps } from './FileCard'

// ICONS
// icon
export { Icon } from './Icon'
export type { IconProps } from './Icon'

// INPUT
// text
export { InputText } from './Inputs/InputText'

// textarea
export { InputTextarea } from './Inputs/InputTextarea'
// color
export { InputColor } from './Inputs/InputColor'
// number
export { InputNumber } from './Inputs/InputNumber'
// switch
export { InputSwitch } from './Inputs/InputSwitch'
// password
export { InputPassword } from './Inputs/InputPassword'
// LockedInput
export { LockedInput } from './Inputs/LockedInput'
// date
export { InputDate } from './Inputs/InputDate'

// LAYOUT
// divider
export { Divider } from './Layout/Divider'
// formLayout
export { FormLayout } from './Layout/FormLayout'
// formRow
export { FormRow } from './Layout/FormRow'
// overflowField
export { OverflowField } from './Layout/OverflowField'
export type { OverflowFieldProps } from './Layout/OverflowField'
// section
export { Section } from './Layout/Section'
export type { SectionProps } from './Layout/Section'
// spacer
export { Spacer } from './Layout/Spacer'
// tableRow
export { TableRow } from './Layout/TableRow'
export type { TableRowProps } from './Layout/TableRow'
// toolbar
export { Toolbar } from './Layout/Toolbar'

// OVERLAY
// dialog
export { Dialog } from './Overlay/Dialog'
export type { DialogProps } from './Overlay/Dialog'

// PANELS
// panel
export { Panel } from './Panels/Panel'
export type { PanelProps } from './Panels/Panel'
// scrollPanel
export { ScrollPanel } from './Panels/ScrollPanel'
// tablePanel
export { TablePanel } from './Panels/TablePanel'

// USER
// userImage
export { UserImage } from './User/UserImage'
export type { UserImageProps } from './User/UserImage'
// userImagesStacked
export { UserImagesStacked } from './User/UserImagesStacked'
export type { UserImagesStackedProps } from './User/UserImagesStacked'

// ENTITY
// entityCard
export { EntityCard, NotificationDot } from './EntityCard'
export type { EntityCardProps, Notification } from './EntityCard'

// export helpers
export { getShimmerStyles, getTextColor } from './helpers'
