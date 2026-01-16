export type Confidence = 'high' | 'medium' | 'low'
export type NodeType = 'source' | 'vendor' | 'boilerplate' | 'framework'

export interface FilterState {
  searchQuery: string
  showVendor: boolean
  showBoilerplate: boolean
  showFramework: boolean
  minConfidence: Confidence
  includeNeighbors: boolean
}

export interface NodePayload {
  id: string
  label: string
  moduleId?: string
  file?: string
  offset?: number
  size?: number
  inferredName?: string
  minifiedName?: string
  confidence: Confidence
  tags: NodeType[]
}

export interface EdgePayload {
  source: string
  target: string
  weak?: boolean
  confidence?: Confidence
}

export interface GraphPayload {
  nodes: NodePayload[]
  edges: EdgePayload[]
}

export interface WorkerSuccess {
  success: true
  data: GraphPayload
  warnings: string[]
}

export interface WorkerFailure {
  success: false
  error: string
  warnings: string[]
}

export type WorkerResult = WorkerSuccess | WorkerFailure
