import { useCallback, useEffect, useRef, useState } from 'react'
import { ToastContext } from './ToastContext.js'

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])
  const timers = useRef(new Map())
  const nextId = useRef(0)

  const dismissToast = useCallback((id) => {
    const timer = timers.current.get(id)
    if (timer) clearTimeout(timer)
    timers.current.delete(id)
    setToasts(current => current.filter(item => item.id !== id))
  }, [])

  const toast = useCallback((message, { type = 'success', duration = 4500 } = {}) => {
    const id = ++nextId.current
    setToasts(current => [...current, { id, message, type }])
    timers.current.set(id, setTimeout(() => dismissToast(id), duration))
  }, [dismissToast])

  useEffect(() => () => {
    timers.current.forEach(timer => clearTimeout(timer))
    timers.current.clear()
  }, [])

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div className="toast-region" aria-label="Notifikasi" aria-live="polite">
        {toasts.map(item => (
          <div
            className={`toast toast--${item.type}`}
            role={item.type === 'error' ? 'alert' : 'status'}
            key={item.id}
          >
            <span>{item.message}</span>
            <button type="button" onClick={() => dismissToast(item.id)} aria-label="Tutup notifikasi">
              ×
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}
