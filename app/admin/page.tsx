'use client';

export default function AdminDashboard() {
    return (
        <div>
            <h1 className="text-3xl font-bold text-white mb-8">Dashboard Overview</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {[
                    { title: 'Total Blogs', value: '12', color: 'from-blue-500 to-cyan-400' },
                    { title: 'Active Jobs', value: '3', color: 'from-purple-500 to-pink-400' },
                    { title: 'Products', value: '5', color: 'from-orange-500 to-red-400' },
                    { title: 'Chat Queries', value: '1,248', color: 'from-green-500 to-emerald-400' },
                ].map((stat, i) => (
                    <div key={i} className="bg-white/5 border border-white/10 rounded-xl p-6 relative overflow-hidden group">
                        <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${stat.color} opacity-10 rounded-bl-full transition-transform group-hover:scale-110`} />
                        <h3 className="text-gray-400 text-sm font-medium mb-2">{stat.title}</h3>
                        <p className="text-3xl font-bold text-white">{stat.value}</p>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                    <h2 className="text-xl font-bold text-white mb-4">Recent Activity</h2>
                    <div className="space-y-4">
                        {[1, 2, 3].map((_, i) => (
                            <div key={i} className="flex items-center gap-4 p-3 hover:bg-white/5 rounded-lg transition-colors">
                                <div className="w-2 h-2 rounded-full bg-teal-500" />
                                <div>
                                    <p className="text-white text-sm">New blog post published</p>
                                    <p className="text-gray-500 text-xs">2 hours ago</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                    <h2 className="text-xl font-bold text-white mb-4">Quick Actions</h2>
                    <div className="grid grid-cols-2 gap-4">
                        <button className="p-4 bg-white/5 hover:bg-white/10 rounded-lg border border-white/10 text-left transition-colors">
                            <span className="text-2xl mb-2 block">📝</span>
                            <span className="text-white font-medium text-sm">Write New Blog</span>
                        </button>
                        <button className="p-4 bg-white/5 hover:bg-white/10 rounded-lg border border-white/10 text-left transition-colors">
                            <span className="text-2xl mb-2 block">💼</span>
                            <span className="text-white font-medium text-sm">Post Job Opening</span>
                        </button>
                        <button className="p-4 bg-white/5 hover:bg-white/10 rounded-lg border border-white/10 text-left transition-colors">
                            <span className="text-2xl mb-2 block">📦</span>
                            <span className="text-white font-medium text-sm">Update Product</span>
                        </button>
                        <button className="p-4 bg-white/5 hover:bg-white/10 rounded-lg border border-white/10 text-left transition-colors">
                            <span className="text-2xl mb-2 block">💬</span>
                            <span className="text-white font-medium text-sm">View Chat Logs</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
