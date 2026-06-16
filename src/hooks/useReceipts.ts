import { useState, useEffect, useCallback } from 'react';
import { Receipt, ReceiptFormData, BusinessSettings } from '../db/types';
import { dbGetAllReceipts, dbSaveReceipt, dbGetLastReceipt, dbSaveSettings } from '../db/db';

export function useReceipts() {
  const [receipts, setReceipts] = useState<Receipt[]>([]);
  const [lastReceipt, setLastReceipt] = useState<Receipt | undefined>();
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      const [all, last] = await Promise.all([dbGetAllReceipts(), dbGetLastReceipt()]);
      setReceipts(all);
      setLastReceipt(last);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const issueReceipt = useCallback(
    async (form: ReceiptFormData, settings: BusinessSettings): Promise<Receipt> => {
      const receipt: Receipt = {
        id: crypto.randomUUID(),
        receiptNumber: settings.nextReceiptNumber,
        date: form.date,
        clientName: form.clientName.trim(),
        description: form.description.trim(),
        quantity: form.quantity,
        unitPrice: form.unitPrice,
        totalAmount: Math.round(form.quantity * form.unitPrice * 100) / 100,
        paymentMethod: form.paymentMethod,
        note: form.note.trim() || undefined,
        status: 'saved',
        createdAt: new Date().toISOString(),
        year: parseInt(form.date.split('-')[0]),
      };

      await dbSaveReceipt(receipt);
      await dbSaveSettings({ ...settings, nextReceiptNumber: settings.nextReceiptNumber + 1 });
      await load();
      return receipt;
    },
    [load]
  );

  return { receipts, lastReceipt, loading, issueReceipt, reload: load };
}
