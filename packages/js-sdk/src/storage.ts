const isBrowser = typeof document !== 'undefined';
const isReactNative = typeof navigator !== 'undefined' && navigator.product === 'ReactNative';

export interface IStorage {
  setItem: (key: string, value: string) => void;
  getItem: (key: string) => string | null
}

class InMemoryStorage implements IStorage {
  _inMemoryState: Record<string, string> = {}

  setItem = (key: string, value: string): void => {
    this._inMemoryState[key] = value
  }

  getItem = (key: string): string | null => {
    const item = this._inMemoryState[key]

    return item || null
  }
}


const getStorage = (): IStorage | null => {
  if (isReactNative) {
    return new InMemoryStorage()
  }

  if (isBrowser) {
    return window['localStorage']
  }

  return null;
}

export default getStorage()
