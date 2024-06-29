'use server'

import { redirect } from 'next/navigation'

/**
 * Navigates to the transactions page.
 * @returns {Promise<void>} A promise that resolves when the navigation is complete.
 */
export async function navigateToTransactionsPage() {
    redirect(`/transactions`)
}

/**
 * Navigates back to the main page.
 * @returns {Promise<void>} A promise that resolves when the navigation is complete.
 */
export async function navigateBackToMainPage(): Promise<void> {
    redirect(`/`)
}