(() => {
  const KEY = 'volumeWorkoutStateV1';

  const defaultState = () => ({
    workouts: {},
    history: []
  });

  const load = () => {
    try {
      const parsed = JSON.parse(localStorage.getItem(KEY));
      return parsed && typeof parsed === 'object' ? parsed : defaultState();
    } catch {
      return defaultState();
    }
  };

  const save = (state) => localStorage.setItem(KEY, JSON.stringify(state));

  const getWorkout = (dayId) => {
    const state = load();
    return state.workouts[dayId] || { sets: {}, finished: false, updatedAt: null };
  };

  const saveSet = (dayId, exerciseId, setNumber, payload) => {
    const state = load();
    state.workouts[dayId] ||= { sets: {}, finished: false, updatedAt: null };
    state.workouts[dayId].sets[exerciseId] ||= {};
    state.workouts[dayId].sets[exerciseId][setNumber] = payload;
    state.workouts[dayId].updatedAt = new Date().toISOString();
    save(state);
    return state;
  };

  const finishWorkout = (dayId, dayName, percent) => {
    const state = load();
    state.workouts[dayId] ||= { sets: {}, finished: false, updatedAt: null };
    state.workouts[dayId].finished = true;
    state.workouts[dayId].updatedAt = new Date().toISOString();
    state.history.unshift({
      id: `${dayId}-${Date.now()}`,
      dayId,
      name: dayName,
      percent,
      date: new Date().toISOString()
    });
    state.history = state.history.slice(0, 20);
    save(state);
  };

  const reset = () => localStorage.removeItem(KEY);

  window.WorkoutStorage = { load, save, getWorkout, saveSet, finishWorkout, reset };
})();
