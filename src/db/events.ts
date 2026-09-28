/**
 * Tiny change bus: repository writes call `notifyDataChanged()` and every
 * mounted live query re-runs. Keeps screens in sync without a state library.
 */
type Listener = () => void;

const listeners = new Set<Listener>();

export function subscribeToDataChanges(listener: Listener): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function notifyDataChanged() {
  listeners.forEach((listener) => listener());
}
