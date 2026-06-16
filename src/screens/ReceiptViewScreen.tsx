import { useEffect, useState } from 'react';
import { Receipt, BusinessSettings } from '../db/types';
import { dbGetReceipt } from '../db/db';
import { formatDate, formatCurrency, PAYMENT_RU } from '../utils/formatting';
import { printReceipt, shareReceipt } from '../utils/pdfPrint';

interface Props {
  receiptId: string;
  settings: BusinessSettings;
  onBack: () => void;
}

export function ReceiptViewScreen({ receiptId, settings, onBack }: Props) {
  const [receipt, setReceipt] = useState<Receipt | null>(null);
  const [loading, setLoading] = useState(true);
  const [sharing, setSharing] = useState(false);

  useEffect(() => {
    dbGetReceipt(receiptId).then((r) => {
      setReceipt(r ?? null);
      setLoading(false);
    });
  }, [receiptId]);

  if (loading) {
    return (
      <div className="screen screen-center">
        <div className="spinner" />
      </div>
    );
  }

  if (!receipt) {
    return (
      <div className="screen screen-center">
        <div className="empty-state">
          <div className="empty-icon">🔍</div>
          <div>Кабала не найдена</div>
          <button className="btn-back-small" onClick={onBack}>Назад</button>
        </div>
      </div>
    );
  }

  async function handleShare() {
    if (!receipt) return;
    setSharing(true);
    try {
      await shareReceipt(receipt, settings);
    } finally {
      setSharing(false);
    }
  }

  return (
    <div className="screen">
      <div className="form-header">
        <button className="back-btn" onClick={onBack}>‹ Назад</button>
        <div className="form-title">Кабала #{receipt.receiptNumber}</div>
      </div>

      {/* Receipt card */}
      <div className="view-card">
        {/* Header stamp */}
        <div className="view-stamp">
          <div className="view-he-title">קבלה</div>
          <div className="view-num">№ {receipt.receiptNumber}</div>
          <div className="view-date">{formatDate(receipt.date)}</div>
        </div>

        {/* Business info */}
        <div className="view-biz">
          <div className="view-biz-name">{settings.ownerName}</div>
          <div className="view-biz-sub">עוסק פטור · מס' {settings.oseqNumber}</div>
        </div>

        <div className="view-divider" />

        {/* Client */}
        <div className="view-field">
          <div className="view-field-label">Клиент / לקוח</div>
          <div className="view-field-value large">{receipt.clientName}</div>
        </div>

        <div className="view-divider" />

        {/* Details */}
        <div className="view-field">
          <div className="view-field-label">Услуга / שירות</div>
          <div className="view-field-value">{receipt.description}</div>
        </div>
        <div className="view-field-row">
          <div className="view-field half">
            <div className="view-field-label">Кол-во / כמות</div>
            <div className="view-field-value">{receipt.quantity}</div>
          </div>
          <div className="view-field half">
            <div className="view-field-label">Цена за ед. / מחיר</div>
            <div className="view-field-value">{formatCurrency(receipt.unitPrice)}</div>
          </div>
        </div>

        <div className="view-divider" />

        {/* Total */}
        <div className="view-total-row">
          <span>Итого / סה"כ</span>
          <span className="view-total-amount">{formatCurrency(receipt.totalAmount)}</span>
        </div>

        <div className="view-divider" />

        {/* Payment */}
        <div className="view-field">
          <div className="view-field-label">Оплата / תשלום</div>
          <div className="view-payment-badge">{PAYMENT_RU[receipt.paymentMethod]}</div>
        </div>

        {/* Note */}
        {receipt.note && (
          <>
            <div className="view-divider" />
            <div className="view-field">
              <div className="view-field-label">Примечание / הערה</div>
              <div className="view-field-value view-note">{receipt.note}</div>
            </div>
          </>
        )}

        {/* Legal footer */}
        <div className="view-legal">עוסק פטור — לא נגבה מע״מ</div>
      </div>

      {/* Actions */}
      <div className="view-actions">
        <button
          className="action-btn"
          onClick={handleShare}
          disabled={sharing}
        >
          <span className="action-icon">↑</span>
          {sharing ? 'Загрузка...' : 'Поделиться'}
        </button>
        <button
          className="action-btn"
          onClick={() => printReceipt(receipt, settings)}
        >
          <span className="action-icon">🖨</span>
          Печать / PDF
        </button>
      </div>
    </div>
  );
}
