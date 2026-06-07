import { useCallback, useState } from 'react'

export type UseStepperReturn = {
  /** Zero-based index of the current step. */
  step: number
  totalSteps: number
  isFirst: boolean
  isLast: boolean
  next: () => void
  prev: () => void
  goTo: (step: number) => void
  reset: () => void
}

/**
 * Headless stepper state — pairs with the `<Stepper />` component.
 *
 * ```tsx
 * const s = useStepper(steps.length)
 * <Stepper steps={steps} currentStep={s.step} />
 * <Button onClick={s.next} disabled={s.isLast}>Next</Button>
 * ```
 */
export const useStepper = (
  totalSteps: number,
  initialStep = 0,
): UseStepperReturn => {
  const [step, setStep] = useState(initialStep)

  const clamp = useCallback(
    (value: number) => Math.max(0, Math.min(value, totalSteps - 1)),
    [totalSteps],
  )

  const next = useCallback(() => setStep((s) => clamp(s + 1)), [clamp])
  const prev = useCallback(() => setStep((s) => clamp(s - 1)), [clamp])
  const goTo = useCallback((value: number) => setStep(clamp(value)), [clamp])
  const reset = useCallback(() => setStep(initialStep), [initialStep])

  return {
    step,
    totalSteps,
    isFirst: step === 0,
    isLast: step === totalSteps - 1,
    next,
    prev,
    goTo,
    reset,
  }
}
