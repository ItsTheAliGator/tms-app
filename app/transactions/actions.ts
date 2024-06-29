'use server';
import { createClient } from '@/utils/supabase/server';
import { Transaction } from '../types/transaction';
import { redirect } from 'next/navigation';

/**
 * Retrieves a list of transactions from the server.
 * @returns {Promise<Transaction[]>} A promise that resolves to an array of transactions.
 * @throws {Error} If there is an error retrieving the transactions.
 */
export async function getTransactions(): Promise<Transaction[]> {
    const { data, error } = await createClient().from("transactions").select().returns<Transaction[]>()
    if (error) {
        return []
    }
    return data
}

/**
 * Creates a new transaction.
 * @param {Transaction} transaction The transaction to create.
 * @returns {Promise<{ created: boolean, transaction: Transaction }>} A promise that resolves to the created transaction.
 * @throws {Error} If there is an error creating the transaction.
 */
export async function createTransaction(transaction: Transaction): Promise<{ created: boolean, transaction: Transaction }> {
    const { error, data } = await createClient().from("transactions").insert([transaction]).select().returns<Transaction>().single();
    if (error) {
        return { created: false, transaction: transaction }
    }
    return { created: true, transaction: data }
}

/**
 * Updates a transaction.
 * @param {Transaction} transaction The transaction to update.
 * @returns {Promise<{updated: boolean, transaction: Transaction}>} A promise that resolves to the updated transaction.
 * @throws {Error} If there is an error updating the transaction.
 */
export async function updateTransaction(transaction: Transaction): Promise<{ updated: boolean, transaction: Transaction }> {
    const { data, error } = await createClient().from("transactions").update(transaction).match({ id: transaction.id }).single()
    if (error) {
        return { updated: false, transaction: transaction }
    }
    return { updated: true, transaction: data }
}

/**
 * Deletes multiple transactions.
 * @param {Transaction[]} transactions The transactions to delete.
 * @returns {Promise<deleted:boolean>} A promise that resolves when the transactions are deleted.
 * @throws {Error} If there is an error deleting the transactions.
 */
export async function deleteTransactions(transactions: Transaction[]): Promise<{ deleted: boolean }> {
    const { error } = await createClient().from("transactions").delete().in("id", transactions.map(t => t.id))
    if (error) {
        return { deleted: false }
    }
    return { deleted: true }
}