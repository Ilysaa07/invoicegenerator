import React from 'react';

export default function Dates({ invoiceDate, dueDate, paymentTerms, poNumber, title, invoiceNumber, balanceDue }) {

  const formattedBalanceDue = (balanceDue !== undefined && balanceDue !== null) ? balanceDue : 0;

  return (
    <>
      <div className="mr-12 text-right">
  <header className="flex items-center mb-14 dark:bg-gray-900 dark:text-gray-200">
    <div className="flex flex-col ml-40">
      <h2 className="font-bold uppercase tracking-wide text-4xl">
        {title || "INVOICE"}
      </h2>
      <h1 className="text-right text-lg"># {invoiceNumber}</h1>
    </div>
  </header>

  {/* Tanggal Invoice */}
  <div className="flex justify-between mb-2">
    <h2 className="text-sm">Tanggal:</h2>
    <h2 className="text-sm font-bold uppercase">{invoiceDate}</h2>
  </div>

  {/* Syarat Pembayaran */}
  <div className="flex justify-between mb-2">
    <h2 className="text-sm">Syarat Pembayaran:</h2>
    <h2 className="text-sm font-bold uppercase">{paymentTerms}</h2>
  </div>

  {/* Tenggat Waktu */}
  <div className="flex justify-between mb-2">
    <h2 className="text-sm">Tenggat Waktu:</h2>
    <h2 className="text-sm font-bold uppercase">{dueDate}</h2>
  </div>

  {/* Nomor PO */}
  <div className="flex justify-between mb-2">
    <h2 className="text-sm">Nomor PO:</h2>
    <h2 className="text-sm font-bold uppercase">{poNumber}</h2>
  </div>

  {/* Sisa Pembayaran */}
  <div className="flex justify-between bg-gray-200 p-2 pl-4 rounded mb-5">
    <h2 className="font-bold text-base">Sisa Pembayaran:</h2>
    <h2 className="font-bold text-base">Rp.{formattedBalanceDue.toLocaleString()}</h2>
  </div>
</div>
    </>
  );
}
