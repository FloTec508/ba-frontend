interface EventState {
  event: string | null;
  payload: unknown;
}

const initialEventState: EventState = {
  event: null,
  payload: null,
};

export const eventReducer = (
  _state = initialEventState,
  action: { type: string; payload?: unknown }
): EventState => ({
  event: action.type,
  payload: action.payload ?? null,
});