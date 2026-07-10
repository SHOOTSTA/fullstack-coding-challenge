import 'styled-components'
import type { AppTheme } from './theme.ts'

declare module 'styled-components' {
  // Declaration merging is the only way styled-components lets you type
  // `props.theme`; an interface with no extra members is required here.
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  export interface DefaultTheme extends AppTheme {}
}
