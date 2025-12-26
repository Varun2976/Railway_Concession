import React, { useState, useEffect } from "react";
import { Search, Eye, RefreshCw } from "lucide-react";

export default function AdminDashboard() {
    const [registrations, setRegistrations] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const SCRIPT_URL =
        "https://script.google.com/macros/s/AKfycby7pI3sOU_AfT2KBjavs-3sWez5XHnRT0u8kdLjXVuSaVPpPAwxYBQhZ7LLvdtRJWxR4g/exec";

    const fetchData = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(SCRIPT_URL);
            const result = await response.json();

            if (result.status === "success") {
                // Remove duplicates based on a unique identifier (email + aadhar)
                const uniqueRegistrations = [];
                const seen = new Set();

                for (const reg of result.data) {
                    // Create a unique key based on email and aadhar
                    const uniqueKey = `${reg.email}-${reg.aadhar}`;

                    if (!seen.has(uniqueKey)) {
                        seen.add(uniqueKey);
                        uniqueRegistrations.push(reg);
                    }
                }

                setRegistrations(uniqueRegistrations);
            } else {
                setError(result.message);
            }
        } catch (err) {
            setError("Failed to fetch data: " + err.message);
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (id, newStatus) => {
        try {
            // Find the registration to update
            const registration = registrations.find((reg) => reg.id === id);

            if (!registration) {
                throw new Error("Registration not found");
            }

            // Send update to Google Sheets
            const response = await fetch(SCRIPT_URL, {
                method: "POST",
                body: JSON.stringify({
                    action: "updateStatus",
                    email: registration.email,
                    aadhar: registration.aadhar,
                    status: newStatus,
                }),
            });

            // Wait for the response
            const result = await response.json();

            if (result.status === "success") {
                // Update locally only after successful server update
                setRegistrations((prev) =>
                    prev.map((reg) =>
                        reg.id === id ? { ...reg, status: newStatus } : reg
                    )
                );
                return true;
            } else {
                throw new Error(result.message || "Failed to update status");
            }
        } catch (err) {
            console.error("Failed to update status:", err);
            setError("Failed to update status: " + err.message);
            // Refresh data to sync with sheet
            await fetchData();
            throw err;
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const filteredRegistrations = registrations.filter((reg) => {
        if (!reg) return false;
        const search = searchTerm.toLowerCase();
        const name = (reg.name || "").toLowerCase();
        const aadhar = (reg.aadhar || "").toString();
        const phone = (reg.phone || "").toString();
        const email = (reg.email || "").toLowerCase();
        return (
            name.includes(search) ||
            aadhar.includes(searchTerm) ||
            phone.includes(searchTerm) ||
            email.includes(search)
        );
    });

    const handleViewDetails = (user) => {
        setSelectedUser(user);
    };

    const getStatusColor = (status) => {
        switch (status) {
            case "Approved":
                return "bg-green-100 text-green-700 border-green-300";
            case "Pending":
                return "bg-yellow-100 text-yellow-700 border-yellow-300";
            case "Rejected":
                return "bg-red-100 text-red-700 border-red-300";
            default:
                return "bg-slate-100 text-slate-700 border-slate-300";
        }
    };

    if (selectedUser) {
        return (
            <RegistrationDetails
                user={selectedUser}
                onBack={() => setSelectedUser(null)}
                onStatusUpdate={updateStatus}
            />
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-white p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-12 flex justify-between items-center">
                    <div>
                        <h1 className="text-5xl font-light text-slate-900 mb-4">
                            Admin Dashboard
                        </h1>
                        <p className="text-xl text-slate-600">
                            Railway Concession Management System
                        </p>
                    </div>
                    <button
                        onClick={fetchData}
                        disabled={loading}
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50"
                    >
                        <RefreshCw
                            size={20}
                            className={loading ? "animate-spin" : ""}
                        />
                        Refresh
                    </button>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="mb-8 bg-red-50 border border-red-300 rounded-xl p-4 text-red-700">
                        {error}
                    </div>
                )}

                {/* Search Bar */}
                <div className="mb-8">
                    <div className="relative">
                        <Search
                            className="absolute left-5 top-1/2 transform -translate-y-1/2 text-slate-400"
                            size={20}
                        />
                        <input
                            type="text"
                            placeholder="Search by name, Aadhar number, phone, or email..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-14 pr-5 py-4 text-base bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-slate-900 placeholder-slate-400 shadow-sm"
                        />
                    </div>
                </div>

                {/* Statistics Cards */}
                <div className="grid grid-cols-4 gap-6 mb-8">
                    <div className="bg-white/70 backdrop-blur-xl rounded-2xl shadow-lg border border-slate-200/50 p-6">
                        <p className="text-sm font-semibold text-slate-600 uppercase tracking-wide mb-2">
                            Total
                        </p>
                        <p className="text-4xl font-light text-slate-900">
                            {registrations.length}
                        </p>
                    </div>
                    <div className="bg-green-50/70 backdrop-blur-xl rounded-2xl shadow-lg border border-green-200/50 p-6">
                        <p className="text-sm font-semibold text-green-700 uppercase tracking-wide mb-2">
                            Approved
                        </p>
                        <p className="text-4xl font-light text-green-700">
                            {
                                registrations.filter(
                                    (r) => r.status === "Approved"
                                ).length
                            }
                        </p>
                    </div>
                    <div className="bg-yellow-50/70 backdrop-blur-xl rounded-2xl shadow-lg border border-yellow-200/50 p-6">
                        <p className="text-sm font-semibold text-yellow-700 uppercase tracking-wide mb-2">
                            Pending
                        </p>
                        <p className="text-4xl font-light text-yellow-700">
                            {
                                registrations.filter(
                                    (r) => r.status === "Pending"
                                ).length
                            }
                        </p>
                    </div>
                    <div className="bg-red-50/70 backdrop-blur-xl rounded-2xl shadow-lg border border-red-200/50 p-6">
                        <p className="text-sm font-semibold text-red-700 uppercase tracking-wide mb-2">
                            Rejected
                        </p>
                        <p className="text-4xl font-light text-red-700">
                            {
                                registrations.filter(
                                    (r) => r.status === "Rejected"
                                ).length
                            }
                        </p>
                    </div>
                </div>

                {/* Loading State */}
                {loading && registrations.length === 0 && (
                    <div className="text-center py-12">
                        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                        <p className="mt-4 text-slate-600">
                            Loading registrations...
                        </p>
                    </div>
                )}

                {/* Table */}
                {!loading && (
                    <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.3)] border border-slate-200/50 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-slate-100/80 border-b border-slate-200">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                                            Name
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                                            Email
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                                            Phone
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                                            Year
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                                            Degree
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                                            Plan
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                                            Status
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                                            Action
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-200">
                                    {filteredRegistrations.map((reg, index) => (
                                        <tr
                                            key={`${reg.email}-${index}`}
                                            className="hover:bg-slate-50/50 transition-colors"
                                        >
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">
                                                {reg.name}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                                                {reg.email}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                                                {reg.phone}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                                                {reg.year}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                                                {reg.degree}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 capitalize">
                                                {reg.plan}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span
                                                    className={`px-3 py-1 text-xs font-semibold rounded-full border ${getStatusColor(
                                                        reg.status
                                                    )}`}
                                                >
                                                    {reg.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                <button
                                                    onClick={() =>
                                                        handleViewDetails(reg)
                                                    }
                                                    className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium transition-colors"
                                                >
                                                    <Eye size={16} />
                                                    View
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {filteredRegistrations.length === 0 && !loading && (
                            <div className="text-center py-12 text-slate-500">
                                No registrations found
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

// Registration Details Component
function RegistrationDetails({ user, onBack, onStatusUpdate }) {
    const [updating, setUpdating] = useState(false);

    const handleApprove = async () => {
        setUpdating(true);
        try {
            await onStatusUpdate(user.id, "Approved");
            onBack();
        } catch (err) {
            console.error("Error approving:", err);
        } finally {
            setUpdating(false);
        }
    };

    const handleReject = async () => {
        setUpdating(true);
        try {
            await onStatusUpdate(user.id, "Rejected");
            onBack();
        } catch (err) {
            console.error("Error rejecting:", err);
        } finally {
            setUpdating(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-white p-8">
            <div className="max-w-5xl mx-auto">
                {/* Back Button */}
                <button
                    onClick={onBack}
                    disabled={updating}
                    className="mb-8 flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium transition-colors text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    ← Back to Dashboard
                </button>

                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-5xl font-light text-slate-900 mb-4">
                        Registration Details
                    </h1>
                </div>

                {/* Form Card */}
                <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.3)] border border-slate-200/50 p-12">
                    <div className="space-y-10">
                        {/* Personal Information */}
                        <div>
                            <h2 className="text-2xl font-medium text-slate-800 mb-6 pb-3 border-b border-slate-200">
                                Personal Information
                            </h2>
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2 uppercase tracking-wide">
                                        Full Name
                                    </label>
                                    <div className="w-full px-5 py-4 text-base bg-slate-100 border border-slate-300 rounded-xl text-slate-900">
                                        {user.name}
                                    </div>
                                </div>
                                <div className="grid grid-cols-3 gap-6">
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-2 uppercase tracking-wide">
                                            Year
                                        </label>
                                        <div className="w-full px-5 py-4 text-base bg-slate-100 border border-slate-300 rounded-xl text-slate-900">
                                            {user.year}
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-2 uppercase tracking-wide">
                                            Degree
                                        </label>
                                        <div className="w-full px-5 py-4 text-base bg-slate-100 border border-slate-300 rounded-xl text-slate-900">
                                            {user.degree}
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-2 uppercase tracking-wide">
                                            Class
                                        </label>
                                        <div className="w-full px-5 py-4 text-base bg-slate-100 border border-slate-300 rounded-xl text-slate-900">
                                            {user.class}
                                        </div>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-2 uppercase tracking-wide">
                                            Phone Number
                                        </label>
                                        <div className="w-full px-5 py-4 text-base bg-slate-100 border border-slate-300 rounded-xl text-slate-900">
                                            {user.phone}
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-2 uppercase tracking-wide">
                                            Aadhar Number
                                        </label>
                                        <div className="w-full px-5 py-4 text-base bg-slate-100 border border-slate-300 rounded-xl text-slate-900">
                                            {user.aadhar}
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2 uppercase tracking-wide">
                                        Email
                                    </label>
                                    <div className="w-full px-5 py-4 text-base bg-slate-100 border border-slate-300 rounded-xl text-slate-900">
                                        {user.email}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Travel Information */}
                        <div>
                            <h2 className="text-2xl font-medium text-slate-800 mb-6 pb-3 border-b border-slate-200">
                                Travel Information
                            </h2>
                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2 uppercase tracking-wide">
                                        Source Station
                                    </label>
                                    <div className="w-full px-5 py-4 text-base bg-slate-100 border border-slate-300 rounded-xl text-slate-900">
                                        {user.source}
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2 uppercase tracking-wide">
                                        Destination Station
                                    </label>
                                    <div className="w-full px-5 py-4 text-base bg-slate-100 border border-slate-300 rounded-xl text-slate-900">
                                        {user.destination}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Subscription Details */}
                        <div>
                            <h2 className="text-2xl font-medium text-slate-800 mb-6 pb-3 border-b border-slate-200">
                                Subscription Details
                            </h2>
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2 uppercase tracking-wide">
                                        Subscription Plan
                                    </label>
                                    <div className="w-full px-5 py-4 text-base bg-slate-100 border border-slate-300 rounded-xl text-slate-900 capitalize">
                                        {user.plan}
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2 uppercase tracking-wide">
                                        Total Amount
                                    </label>
                                    <div className="w-full px-5 py-4 text-base bg-blue-50 border-2 border-blue-200 rounded-xl text-slate-900 font-semibold">
                                        <span className="text-2xl text-blue-700">
                                            ₹{" "}
                                            {Number(
                                                user.amount
                                            ).toLocaleString()}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Document Link */}
                        {user.documentUrl && (
                            <div className="pt-6">
                                <a
                                    href={user.documentUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl"
                                >
                                    <Eye size={20} />
                                    View Uploaded Documents
                                </a>
                            </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex gap-4 pt-6">
                            <button
                                onClick={handleApprove}
                                disabled={updating}
                                className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-4 text-lg rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl uppercase tracking-wide disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {updating ? "Processing..." : "Approve"}
                            </button>
                            <button
                                onClick={handleReject}
                                disabled={updating}
                                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-4 text-lg rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl uppercase tracking-wide disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {updating ? "Processing..." : "Reject"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
