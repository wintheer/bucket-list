export function useConfetti() {
  async function fire() {
    if (!import.meta.client) return
    const confetti = (await import('canvas-confetti')).default

    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.65 },
      colors: ['#22c55e', '#10b981', '#6ee7b7', '#fbbf24', '#f59e0b'],
    })

    setTimeout(() => {
      confetti({
        particleCount: 60,
        spread: 100,
        origin: { x: 0.2, y: 0.6 },
        colors: ['#22c55e', '#34d399', '#a7f3d0'],
        startVelocity: 25,
      })
      confetti({
        particleCount: 60,
        spread: 100,
        origin: { x: 0.8, y: 0.6 },
        colors: ['#22c55e', '#34d399', '#a7f3d0'],
        startVelocity: 25,
      })
    }, 150)
  }

  return { fire }
}
