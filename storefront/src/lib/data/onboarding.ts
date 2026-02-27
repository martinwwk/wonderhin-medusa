"use server"
import { cookies as nextCookies } from "next/headers"
import { redirect } from "next/navigation"

// Resets onboarding state in cookies and redirects to the order admin page.
export async function resetOnboardingState(orderId: string) {
  const cookies = await nextCookies()
  cookies.set("_medusa_onboarding", "false", { maxAge: -1 })
  redirect(`http://localhost:7001/a/orders/${orderId}`)
}
