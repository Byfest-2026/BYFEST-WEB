'use client';

import React, { useEffect, useState } from 'react';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
const ASSETS_BASE_URL = process.env.NEXT_PUBLIC_ASSETS_URL || "http://localhost:5000";

interface OrderItem {
    id: number;
    customer_name: string;
    customer_email: string;
    customer_phone: string;
    total_amount: number;
    status: string;
    payment?: {
        payment_proof: string;
        status: string;
    };
}

export default function AdminOrdersPage() {
    const [orders, setOrders] = useState<OrderItem[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchOrders = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/ticketing/orders`); // Pastikan kamu punya endpoint list order di backend
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

    const handleUpdateStatus = async (orderId: number, status: 'success' | 'failed') => {
        try {
            const res = await fetch(`${API_BASE_URL}/ticketing/order/${orderId}/status`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status, payment_method: 'qris_manual' })
            });

            if (res.ok) {
                alert(`Status order #${orderId} berhasil diubah menjadi ${status}`);
                fetchOrders(); // Refresh data
            } else {
                alert("Gagal memperbarui status");
            }
        } catch (error) {
            console.error("Error updating status:", error);
        }
    };

    return (
        <div className="p-8 bg-slate-950 min-h-screen text-white">
            <h1 className="text-2xl font-bold mb-6">Admin - Verifikasi Tiket</h1>
            {loading ? <p>Memuat data...</p> : (
                <table className="w-full border-collapse border border-slate-800 text-left text-sm">
                    <thead>
                        <tr className="bg-slate-900 border-b border-slate-800">
                            <th className="p-3 border">ID</th>
                            <th className="p-3 border">Nama Pemesan</th>
                            <th className="p-3 border">Total</th>
                            <th className="p-3 border">Bukti Transfer</th>
                            <th className="p-3 border">Status</th>
                            <th className="p-3 border">Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map((order) => (
                            <tr key={order.id} className="border-b border-slate-800">
                                <td className="p-3 border">#{order.id}</td>
                                <td className="p-3 border">{order.customer_name}<br/><span className="text-xs text-gray-400">{order.customer_email}</span></td>
                                <td className="p-3 border">Rp {order.total_amount.toLocaleString('id-ID')}</td>
                                <td className="p-3 border">
                                    {order.payment?.payment_proof ? (
                                        <a 
                                            href={`${ASSETS_BASE_URL}/${order.payment.payment_proof}`} 
                                            target="_blank" 
                                            rel="noreferrer"
                                            className="text-blue-400 underline"
                                        >
                                            Lihat Bukti
                                        </a>
                                    ) : 'Tidak Ada'}
                                </td>
                                <td className="p-3 border uppercase font-bold">
                                    <span className={order.status === 'paid' ? 'text-green-400' : order.status === 'cancelled' ? 'text-red-400' : 'text-yellow-400'}>
                                        {order.status}
                                    </span>
                                </td>
                                <td className="p-3 border space-x-2">
                                    {order.status === 'pending' && (
                                        <>
                                            <button 
                                                onClick={() => handleUpdateStatus(order.id, 'success')}
                                                className="bg-green-600 hover:bg-green-700 px-3 py-1 rounded text-white text-xs"
                                            >
                                                Setujui
                                            </button>
                                            <button 
                                                onClick={() => handleUpdateStatus(order.id, 'failed')}
                                                className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-white text-xs"
                                            >
                                                Tolak
                                            </button>
                                        </>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}