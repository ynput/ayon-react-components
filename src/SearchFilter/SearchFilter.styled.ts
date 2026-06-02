import styled from 'styled-components'
import { Button } from '../Buttons/Button'

export const Container = styled.div`
  position: relative;
  width: 100%;
`

export const SearchBar = styled.div`
  display: flex;

  padding: 3px 8px;
  height: 32px;
  align-items: center;
  gap: var(--base-gap-small);

  border-radius: var(--border-radius-m);
  border: 1px solid var(--md-sys-color-outline-variant);
  background-color: var(--md-sys-color-surface-container-low);

  position: relative;
  z-index: 301;
  overflow: hidden;
  user-select: none;

  cursor: pointer;

  &:hover {
    background-color: var(--md-sys-color-surface-container-low-hover);
  }

  &:has(.search-filter-item:hover) {
    background-color: var(--md-sys-color-surface-container-low);
  }
`

export const SearchBarFilters = styled.div`
  display: flex;
  gap: var(--base-gap-small);
  white-space: nowrap;

  max-width: 100%;
  overflow-x: auto;

  /* margin trick to prevent borders being cutoff */
  padding: 2px;
  margin: -2px;

  /* hide the scrollbar */
  &::-webkit-scrollbar {
    display: none;
  }
`

export const FilterButton = styled(Button)`
  &.hasIcon {
    padding: 2px;
  }
`

export const SearchInput = styled.input`
  /* strip native input chrome so it blends into the bar */
  appearance: none;
  border: none;
  background: none;
  font: inherit;
  color: inherit;

  flex: 1;
  min-width: 60px;
  height: 100%;
  padding: 0;
  cursor: text;
  user-select: text;

  &:focus {
    outline: none;
  }

  &::placeholder {
    color: var(--md-sys-color-outline);
  }
`

export const BarRow = styled.div`
  display: flex;
  align-items: center;
  gap: var(--base-gap-small);
  width: 100%;

  /* let the search bar take the remaining space, quick actions keep their size */
  & > .search-bar {
    flex: 1;
    min-width: 0;
  }
`

export const QuickActions = styled.div`
  display: flex;
  align-items: center;
  gap: var(--base-gap-small);
  flex-shrink: 0;
`

export const Backdrop = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;

  z-index: 300;
`
