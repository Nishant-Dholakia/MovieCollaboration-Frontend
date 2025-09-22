import { useCallback } from "react"

export type ToastOptions = {
  title?: string
  description?: string
  variant?: "default" | "destructive"
}

export function useToast() {
  const toast = useCallback((opts: ToastOptions) => {
    // Minimal fallback: use native alert for now
    // You can replace this with a proper toast implementation later
    const title = opts.title ? `${opts.title}` : "Notice"
    const desc = opts.description ? ` - ${opts.description}` : ""
    if (opts.variant === "destructive") {
      // Use console.error for destructive to help debugging
      console.error(title + desc)
    }
    // Keep UI unobtrusive: use console.log and alert
    console.log("toast:", title + desc)
    try {
      // eslint-disable-next-line no-alert
      alert(title + desc)
    } catch (e) {
      // ignore
    }
  }, [])

  return { toast }
}
