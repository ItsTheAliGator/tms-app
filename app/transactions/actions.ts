'use server';
import { createClient } from '@/utils/supabase/client';
import { Transaction } from '../types/transaction';
// This is a Supabase with Next.js SSR project in typescript. I need functions to get and display all transactions from the database. 
// Also I need the functions to Create a single transactions, delete a single or multiple transactions and update a single transaction. The type are auto generated from the database schema.
// The types are in Database import { Database } from '../types/supabase';

/**
 * Retrieves a list of transactions from the server.
 * @returns {Promise<Transaction[]>} A promise that resolves to an array of transactions.
 * @throws {Error} If there is an error retrieving the transactions.
 */
export async function getTransactions(): Promise<Transaction[]> {
    const { data, error } = await createClient().from("transactions").select().returns<Transaction[]>()
    if (error) throw error
    console.log(data)
    return data
}

/**
 * Creates a new transaction.
 * @param {Transaction} transaction The transaction to create.
 * @returns {Promise<Transaction>} A promise that resolves to the created transaction.
 * @throws {Error} If there is an error creating the transaction.
 */
export async function createTransaction(transaction: Transaction): Promise<Transaction> {
    const { data, error } = await createClient().from("transactions").insert(transaction).single()
    if (error) throw error
    return data
}

/**
 * Updates a transaction.
 * @param {Transaction} transaction The transaction to update.
 * @returns {Promise<Transaction>} A promise that resolves to the updated transaction.
 * @throws {Error} If there is an error updating the transaction.
 */
export async function updateTransaction(transaction: Transaction): Promise<Transaction> {
    const { data, error } = await createClient().from("transactions").update(transaction).match({ id: transaction.id }).single()
    if (error) throw error
    return data
}

/**
 * Deletes multiple transactions.
 * @param {Transaction[]} transactions The transactions to delete.
 * @returns {Promise<>} A promise that resolves when the transactions are deleted.
 * @throws {Error} If there is an error deleting the transactions.
 */
export async function deleteTransactions(transactions: Transaction[]): Promise<{ deleted: boolean }> {
    const { error, } = await createClient().from("transactions").delete().in("id", transactions.map(t => t.id))
    if (error) {
        return { deleted: false }
    }
    return { deleted: true }
}