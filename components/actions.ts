'use server'

import { redirect } from 'next/navigation'

export async function navigateToTransactionsPage() {
    redirect(`/transactions`)
}