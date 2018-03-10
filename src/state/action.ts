import { Injectable } from '@angular/core';
import { FluxStandardAction } from 'flux-standard-action';
import { dispatch } from '@angular-redux/store';

export type NumberAction = FluxStandardAction<number, void>;
export type VoidAction = FluxStandardAction<void, void>;

@Injectable()
export class FlappyBirdActions {
  static SET_MAX_Y = 'SET_MAX_Y';
  static SET_AY = 'SET_AY';
  static SET_VY = 'SET_VY';
  static SET_Y = 'SET_Y';
  static MOVE_BIRD = 'MOVE_BIRD';
  static FLY = 'FLY';
  static MOVE_BACKGROUND = 'MOVE_BACKGROUND';

  @dispatch() setMaxY = (maxY: number): NumberAction => ({
    type: FlappyBirdActions.SET_MAX_Y,
    payload: maxY,
    meta: undefined
  })

  @dispatch() setAy = (ay: number): NumberAction => ({
    type: FlappyBirdActions.SET_AY,
    payload: ay,
    meta: undefined
  })

  @dispatch() setVy = (vy: number): NumberAction => ({
    type: FlappyBirdActions.SET_VY,
    payload: vy,
    meta: undefined
  })

  @dispatch() setY = (y: number): NumberAction => ({
    type: FlappyBirdActions.SET_Y,
    payload: y,
    meta: undefined
  })

  @dispatch() moveBird = (): VoidAction => ({
    type: FlappyBirdActions.MOVE_BIRD,
    payload: undefined,
    meta: undefined
  })

  @dispatch() fly = (): VoidAction => ({
    type: FlappyBirdActions.FLY,
    payload: undefined,
    meta: undefined
  })

  @dispatch() moveBackground = (): VoidAction => ({
    type: FlappyBirdActions.MOVE_BACKGROUND,
    payload: undefined,
    meta: undefined
  })
}
