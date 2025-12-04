'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface JobOpening {
    id: string;
    title: string;
    department: string;
    location: string;
    type: string;
    description: string;
    requirements: string[];
    isActive: boolean;
}

export default function CareersPage() {
    const [jobs, setJobs] = useState<JobOpening[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/careers')
            .then((res) => res.json())
            .then((data) => {
                // Filter only active jobs
                const activeJobs = data.filter((job: any) => job.isActive);
                setJobs(activeJobs);
                setLoading(false);
            })
            .catch((err) => console.error(err));
    }, []);

    return (
        <div className="min-h-screen bg-black text-white pt-24 pb-12">
            <div className="container mx-auto px-4">
                {/* Header */}
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-teal-400 to-blue-600 bg-clip-text text-transparent">
                        Join Our Team
                    </h1>
                    <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                        Help us shape the future of sales automation and digital transformation. We are looking for passionate individuals to join our growing team.
                    </p>
                </div>

                {/* Benefits Section */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
                    {[
                        { title: 'Innovation First', desc: 'Work with cutting-edge technologies like AI and Cloud Computing.', icon: '🚀' },
                        { title: 'Growth & Learning', desc: 'Continuous learning opportunities and career advancement paths.', icon: '📈' },
                        { title: 'Great Culture', desc: 'A collaborative environment where your voice is heard and valued.', icon: '🤝' },
                    ].map((benefit, i) => (
                        <div key={i} className="bg-white/5 border border-white/10 p-8 rounded-2xl text-center hover:bg-white/10 transition-colors">
                            <div className="text-4xl mb-4">{benefit.icon}</div>
                            <h3 className="text-xl font-bold mb-2">{benefit.title}</h3>
                            <p className="text-gray-400">{benefit.desc}</p>
                        </div>
                    ))}
                </div>

                {/* Job Openings */}
                <h2 className="text-3xl font-bold mb-8 text-center">Open Positions</h2>

                {loading ? (
                    <div className="text-center py-20 text-gray-500">Loading open positions...</div>
                ) : jobs.length > 0 ? (
                    <div className="space-y-6 max-w-4xl mx-auto">
                        {jobs.map((job) => (
                            <div key={job.id} className="bg-white/5 border border-white/10 rounded-xl p-6 md:p-8 hover:border-teal-500/50 transition-colors group">
                                <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-4">
                                    <div>
                                        <h3 className="text-2xl font-bold group-hover:text-teal-400 transition-colors">{job.title}</h3>
                                        <div className="flex gap-4 text-sm text-gray-400 mt-2">
                                            <span>{job.department}</span>
                                            <span>•</span>
                                            <span>{job.location}</span>
                                            <span>•</span>
                                            <span>{job.type}</span>
                                        </div>
                                    </div>
                                    <Link
                                        href={`mailto:careers@electronicscience.net?subject=Application for ${job.title}`}
                                        className="bg-white text-black font-bold px-6 py-3 rounded-lg hover:bg-teal-400 hover:text-white transition-colors text-center"
                                    >
                                        Apply Now
                                    </Link>
                                </div>
                                <p className="text-gray-300 mb-4">{job.description}</p>
                                {job.requirements.length > 0 && (
                                    <div className="bg-black/30 p-4 rounded-lg">
                                        <h4 className="text-sm font-bold text-gray-400 mb-2 uppercase">Requirements</h4>
                                        <ul className="list-disc list-inside text-gray-300 space-y-1">
                                            {job.requirements.map((req, i) => (
                                                <li key={i}>{req}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-white/5 rounded-2xl border border-white/10 max-w-4xl mx-auto">
                        <p className="text-gray-400 text-lg">No open positions at the moment.</p>
                        <p className="text-gray-500 mt-2">Check back later or send your resume to careers@electronicscience.net</p>
                    </div>
                )}
            </div>
        </div>
    );
}
