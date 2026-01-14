export type Confidence = 'high' | 'medium' | 'low'

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
