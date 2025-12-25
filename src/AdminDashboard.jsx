import React, { useState } from 'react';
import { Search, Eye } from 'lucide-react';

export default function AdminDashboard() {
  // Placeholder data - replace with spreadsheet data later
  const [registrations] = useState([
    { id: 1, name: 'Rahul Sharma', aadhar: '1234 5678 9012', phone: '9876543210', year: '2024', degree: 'B.Tech', class: 'A', status: 'Pending' },
    { id: 2, name: 'Priya Patel', aadhar: '2345 6789 0123', phone: '9876543211', year: '2023', degree: 'B.Sc', class: 'B', status: 'Approved' },
    { id: 3, name: 'Amit Kumar', aadhar: '3456 7890 1234', phone: '9876543212', year: '2024', degree: 'M.Tech', class: 'A', status: 'Pending' },
    { id: 4, name: 'Sneha Reddy', aadhar: '4567 8901 2345', phone: '9876543213', year: '2022', degree: 'B.Tech', class: 'C', status: 'Rejected' },
    { id: 5, name: 'Vikram Singh', aadhar: '5678 9012 3456', phone: '9876543214', year: '2024', degree: 'B.Com', class: 'A', status: 'Approved' },
  ]);

  const [selectedUser, setSelectedUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredRegistrations = registrations.filter(reg =>
    reg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    reg.aadhar.includes(searchTerm)
  );

  const handleViewDetails = (user) => {
    setSelectedUser(user);
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'Approved': return 'bg-green-100 text-green-700 border-green-300';
      case 'Pending': return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      case 'Rejected': return 'bg-red-100 text-red-700 border-red-300';
      default: return 'bg-slate-100 text-slate-700 border-slate-300';
    }
  };

  if (selectedUser) {
    return <RegistrationDetails user={selectedUser} onBack={() => setSelectedUser(null)} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-white p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-5xl font-light text-slate-900 mb-4">Admin Dashboard</h1>
          <p className="text-xl text-slate-600">Railway Concession Management System</p>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative">
            <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
            <input
              type="text"
              placeholder="Search by name or Aadhar number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-14 pr-5 py-4 text-base bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-slate-900 placeholder-slate-400 shadow-sm"
            />
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-4 gap-6 mb-8">
          <div className="bg-white/70 backdrop-blur-xl rounded-2xl shadow-lg border border-slate-200/50 p-6">
            <p className="text-sm font-semibold text-slate-600 uppercase tracking-wide mb-2">Total</p>
            <p className="text-4xl font-light text-slate-900">{registrations.length}</p>
          </div>
          <div className="bg-green-50/70 backdrop-blur-xl rounded-2xl shadow-lg border border-green-200/50 p-6">
            <p className="text-sm font-semibold text-green-700 uppercase tracking-wide mb-2">Approved</p>
            <p className="text-4xl font-light text-green-700">{registrations.filter(r => r.status === 'Approved').length}</p>
          </div>
          <div className="bg-yellow-50/70 backdrop-blur-xl rounded-2xl shadow-lg border border-yellow-200/50 p-6">
            <p className="text-sm font-semibold text-yellow-700 uppercase tracking-wide mb-2">Pending</p>
            <p className="text-4xl font-light text-yellow-700">{registrations.filter(r => r.status === 'Pending').length}</p>
          </div>
          <div className="bg-red-50/70 backdrop-blur-xl rounded-2xl shadow-lg border border-red-200/50 p-6">
            <p className="text-sm font-semibold text-red-700 uppercase tracking-wide mb-2">Rejected</p>
            <p className="text-4xl font-light text-red-700">{registrations.filter(r => r.status === 'Rejected').length}</p>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.3)] border border-slate-200/50 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-100/80 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">Aadhar Number</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">Phone</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">Year</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">Degree</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredRegistrations.map((reg) => (
                  <tr key={reg.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">{reg.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{reg.aadhar}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{reg.phone}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{reg.year}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{reg.degree}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${getStatusColor(reg.status)}`}>
                        {reg.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button
                        onClick={() => handleViewDetails(reg)}
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

          {filteredRegistrations.length === 0 && (
            <div className="text-center py-12 text-slate-500">
              No registrations found
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Registration Details Component
function RegistrationDetails({ user, onBack }) {
  const [formData] = useState({
    name: user.name,
    year: user.year,
    degree: user.degree,
    class: user.class,
    gender: 'male',
    source: 'Mumbai Central',
    destination: 'Dadar',
    plan: 'quarterly',
    amount: 5000,
    phone: user.phone,
    aadhar: user.aadhar.replace(/\s/g, '')
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-white p-8">
      <div className="max-w-5xl mx-auto">
        {/* Back Button */}
        <button
          onClick={onBack}
          className="mb-8 flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium transition-colors text-lg"
        >
          ← Back to Dashboard
        </button>

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-light text-slate-900 mb-4">Registration Details</h1>
          <p className="text-xl text-slate-600">{user.name}</p>
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
                  <label className="block text-sm font-semibold text-slate-700 mb-2 uppercase tracking-wide">Full Name</label>
                  <div className="w-full px-5 py-4 text-base bg-slate-100 border border-slate-300 rounded-xl text-slate-900">{formData.name}</div>
                </div>
                <div className="grid grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2 uppercase tracking-wide">Year</label>
                    <div className="w-full px-5 py-4 text-base bg-slate-100 border border-slate-300 rounded-xl text-slate-900">{formData.year}</div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2 uppercase tracking-wide">Degree</label>
                    <div className="w-full px-5 py-4 text-base bg-slate-100 border border-slate-300 rounded-xl text-slate-900">{formData.degree}</div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2 uppercase tracking-wide">Class</label>
                    <div className="w-full px-5 py-4 text-base bg-slate-100 border border-slate-300 rounded-xl text-slate-900">{formData.class}</div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2 uppercase tracking-wide">Phone Number</label>
                    <div className="w-full px-5 py-4 text-base bg-slate-100 border border-slate-300 rounded-xl text-slate-900">{formData.phone}</div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2 uppercase tracking-wide">Aadhar Number</label>
                    <div className="w-full px-5 py-4 text-base bg-slate-100 border border-slate-300 rounded-xl text-slate-900">{formData.aadhar}</div>
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
                  <label className="block text-sm font-semibold text-slate-700 mb-2 uppercase tracking-wide">Source Station</label>
                  <div className="w-full px-5 py-4 text-base bg-slate-100 border border-slate-300 rounded-xl text-slate-900">{formData.source}</div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2 uppercase tracking-wide">Destination Station</label>
                  <div className="w-full px-5 py-4 text-base bg-slate-100 border border-slate-300 rounded-xl text-slate-900">{formData.destination}</div>
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
                  <label className="block text-sm font-semibold text-slate-700 mb-2 uppercase tracking-wide">Subscription Plan</label>
                  <div className="w-full px-5 py-4 text-base bg-slate-100 border border-slate-300 rounded-xl text-slate-900 capitalize">{formData.plan}</div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2 uppercase tracking-wide">Total Amount</label>
                  <div className="w-full px-5 py-4 text-base bg-blue-50 border-2 border-blue-200 rounded-xl text-slate-900 font-semibold">
                    <span className="text-2xl text-blue-700">₹ {formData.amount.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-6">
              <button className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-4 text-lg rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl uppercase tracking-wide">
                Approve
              </button>
              <button className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-4 text-lg rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl uppercase tracking-wide">
                Reject
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}