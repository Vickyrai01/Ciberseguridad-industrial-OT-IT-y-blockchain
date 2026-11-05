import { useCallback } from 'react'
import { multiplayerService } from '../services/multiplayerService'
import type { ChoiceId } from '../../../types'
import type { AnswerResult } from '../types'
import type { MultiplayerAction, MultiplayerState } from './multiplayerReducer'
import { getMultiplayerErrorMessage } from './useMultiplayerRequest'

interface ParticipantActionsOptions {
  state: MultiplayerState
  dispatch: (action: MultiplayerAction) => void
  refresh: () => Promise<void>
}

export function useMultiplayerParticipantActions({ state, dispatch, refresh }: ParticipantActionsOptions) {
  const submitAnswer = useCallback(
    async (scenarioId: number, choiceId: ChoiceId): Promise<AnswerResult> => {
      if (!state.session) throw new Error('PARTICIPANT_SESSION_MISSING')
      const result = await multiplayerService.submitAnswer(state.session.participantToken, scenarioId, choiceId)
      void refresh()
      return result
    },
    [refresh, state.session],
  )

  const openQuestion = useCallback(
    (scenarioId: number) => {
      if (!state.session) return
      void multiplayerService.openQuestion(state.session.participantToken, scenarioId).catch((error: unknown) => {
        dispatch({ type: 'ERROR', message: getMultiplayerErrorMessage(error, 'QUESTION_OPEN_FAILED') })
      })
    },
    [dispatch, state.session],
  )

  return { submitAnswer, openQuestion }
}
