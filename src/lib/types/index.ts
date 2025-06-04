export type Position = [x: number, y: number]

export interface BaseAction {
  timestamp?: number
}

export interface ClickAction extends BaseAction {
  type: 'click'
  position: Position
}

export interface DragAction extends BaseAction {
  type: 'drag'
  from: Position
  to: Position
}

export interface TypeAction extends BaseAction {
  type: 'type'
  text: string
}

export interface ScrollAction extends BaseAction {
  type: 'scroll'
  direction: 'up' | 'down'
  amount?: number
}

export interface KeyAction extends BaseAction {
  type: 'key'
  key: string
  modifiers?: ('ctrl' | 'alt' | 'shift' | 'meta')[]
}

export type Action = ClickAction | DragAction | TypeAction | ScrollAction | KeyAction

export interface Turn {
  id: string
  index: number
  timestamp?: number
  screenshot?: string
  thought?: string
  actions: Action[]
  metadata?: Record<string, any>
}

export type TurnLoader<T> = (source: T) => Promise<Turn[]> | AsyncIterable<Turn>
