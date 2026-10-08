'use client';

import React, { useEffect, useState } from 'react';
import { API_BASE_URL, formatImageUrl } from '@/config/api';

interface OrderItem {
    id: number;
    order_code?: string;
    buyer_name?: string;
    customer_name?: string;
    email?: string;
    customer_email?: string;
    phone?: string;
    customer_phone?: string;
    total_amount: number;
    status: 'pending' | 'paid' | 'rejected' | 'cancelled' | string;
    payment_proof?: string;
    payment?: {
        payment_proof: string;
        status: string;
    };
    created_at?: string;
}

export default function AdminOrdersPage() {
    const [orders, setOrders] = useState<OrderItem[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchOrders = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/ticketing/admin/orders`);
            if (res.ok) {
                const data = await res.json();
                setOrders(data.data || []);
            }
        } catch (error) {
            console.error("Gagal mengambil data pesanan:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const handleUpdateStatus = async (orderId: number, status: 'paid' | 'rejected') => {
        try {
            const res = await fetch(`${API_BASE_URL}/ticketing/admin/orders/${orderId}/status`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status })
            });

            if (res.ok) {
                alert(`Status order #${orderId} berhasil diubah menjadi ${status}`);
                fetchOrders(); // Refresh data
            } else {
                alert("Gagal memperbarui status pesanan");
            }
        } catch (error) {
            console.error("Error updating status:", error);
        }
    };

    return (
        <div className="p-8 bg-slate-950 min-h-screen text-white">
            <h1 className="text-2xl font-bold mb-6">Admin - Verifikasi Tiket BYFEST</h1>
            {loading ? <p>Memuat data...</p> : (
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse border border-slate-800 text-left text-sm">
                        <thead>
                            <tr className="bg-slate-900 border-b border-slate-800">
                                <th className="p-3 border border-slate-800">Kode & ID</th>
                                <th className="p-3 border border-slate-800">Nama Pembeli</th>
                                <th className="p-3 border border-slate-800">Total</th>
                                <th className="p-3 border border-slate-800">Bukti Transfer</th>
                                <th className="p-3 border border-slate-800">Status</th>
                                <th className="p-3 border border-slate-800">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="p-6 text-center text-gray-400">Belum ada pesanan masuk.</td>
                                </tr>
                            ) : (
                                orders.map((order) => {
                                    const buyerName = order.buyer_name || order.customer_name || 'Tanpa Nama';
                                    const buyerEmail = order.email || order.customer_email || '-';
                                    const proofUrl = order.payment_proof || order.payment?.payment_proof;

                                    return (
                                        <tr key={order.id} className="border-b border-slate-800 hover:bg-slate-900/50">
                                            <td className="p-3 border border-slate-800">
                                                <span className="font-mono font-semibold">{order.order_code || `#${order.id}`}</span>
                                            </td>
                                            <td className="p-3 border border-slate-800">
                                                <div className="font-medium">{buyerName}</div>
                                                <span className="text-xs text-gray-400">{buyerEmail}</span>
                                            </td>
                                            <td className="p-3 border border-slate-800 font-semibold">
                                                Rp {(order.total_amount || 0).toLocaleString('id-ID')}
                                            </td>
                                            <td className="p-3 border border-slate-800">
                                                {proofUrl ? (
                                                    <a 
                                                        href={formatImageUrl(proofUrl)} 
                                                        target="_blank" 
                                                        rel="noreferrer"
                                                        className="text-blue-400 hover:text-blue-300 underline font-medium"
                                                    >
                                                        Lihat Bukti
                                                    </a>
                                                ) : (
                                                    <span className="text-gray-500">Tidak Ada</span>
                                                )}
                                            </td>
                                            <td className="p-3 border border-slate-800 uppercase font-bold">
                                                <span className={
                                                    order.status === 'paid' ? 'text-green-400' : 
                                                    order.status === 'rejected' ? 'text-red-400' : 
                                                    order.status === 'cancelled' ? 'text-gray-400' : 
                                                    'text-yellow-400'
                                                }>
                                                    {order.status}
                                                </span>
                                            </td>
                                            <td className="p-3 border border-slate-800 space-x-2">
                                                {order.status === 'pending' && (
                                                    <>
                                                        <button 
                                                            onClick={() => handleUpdateStatus(order.id, 'paid')}
                                                            className="bg-green-600 hover:bg-green-700 px-3 py-1 rounded text-white text-xs font-semibold cursor-pointer"
                                                        >
                                                            Setujui
                                                        </button>
                                                        <button 
                                                            onClick={() => handleUpdateStatus(order.id, 'rejected')}
                                                            className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-white text-xs font-semibold cursor-pointer"
                                                        >
                                                            Tolak
                                                        </button>
                                                    </>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}