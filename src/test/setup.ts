import '@testing-library/jest-dom'
import { afterEach } from 'vitest'
import { useGraphStore } from '../store/useGraphStore'

afterEach(() => {
  useGraphStore.getState().reset()
})
