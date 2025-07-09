import React, { useState, useMemo, useEffect } from 'react';
import { Search, Filter, X, ChevronRight, Briefcase, Globe, DollarSign, Calendar, CheckCircle, Clock, BarChart2 } from 'lucide-react';

// --- Components ---

const Header = () => (
    <header className="bg-white shadow-md p-4 flex justify-between items-center">
        <div className="flex items-center space-x-4">
            <img 
                src="https://www.un.org/youthenvoy/wp-content/uploads/2016/10/UNOPS-logo-300x56.png" 
                alt="UNOPS Logo" 
                className="h-10"
                onError={(e) => { e.target.onerror = null; e.target.src='https://placehold.co/150x40/0075C9/FFFFFF?text=UNOPS'; }}
            />
            <h1 className="text-xl md:text-2xl font-semibold text-gray-800">Africa Funding Gateway</h1>
        </div>
    </header>
);

const FilterSection = ({ filters, setFilters, onReset, allOpportunities }) => {
    // Dynamically get unique values from the live data
    const countries = [...new Set(allOpportunities.map(op => op.country).filter(Boolean))].sort();
    const thematicPriorities = [...new Set(allOpportunities.map(op => op.thematicPriority).filter(Boolean))].sort();
    const fundingTypes = [...new Set(allOpportunities.map(op => op.fundingType).filter(Boolean))].sort();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    return (
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center"><Filter className="w-5 h-5 mr-2" /> Filters</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4 items-end">
                <div className="relative col-span-1 md:col-span-2">
                    <label htmlFor="searchTerm" className="text-sm font-medium text-gray-600 block mb-1">Search by Keyword</label>
                    <div className="relative">
                        <input
                            type="text"
                            name="searchTerm"
                            id="searchTerm"
                            placeholder="e.g., 'Health' or 'Kenya'"
                            value={filters.searchTerm}
                            onChange={handleInputChange}
                            className="w-full p-2 pl-10 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    </div>
                </div>

                <div>
                    <label htmlFor="country" className="text-sm font-medium text-gray-600 block mb-1">Country</label>
                    <select name="country" id="country" value={filters.country} onChange={handleInputChange} className="w-full p-2 border border-gray-300 rounded-md bg-white">
                        <option value="">All Countries</option>
                        {countries.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                </div>

                <div>
                    <label htmlFor="thematicPriority" className="text-sm font-medium text-gray-600 block mb-1">Thematic Priority</label>
                    <select name="thematicPriority" id="thematicPriority" value={filters.thematicPriority} onChange={handleInputChange} className="w-full p-2 border border-gray-300 rounded-md bg-white">
                        <option value="">All Priorities</option>
                        {thematicPriorities.map(p => <option key={p} value={p}>{p}</option>)}
                    </select>
                </div>
                
                <div>
                     <button onClick={onReset} className="w-full px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-100">
                        Reset Filters
                    </button>
                </div>
            </div>
        </div>
    );
};

const FundingCard = ({ opportunity, onSelect }) => {
    const { title, country, fundingAmount, deadline, status } = opportunity;
    const isPastDeadline = deadline ? new Date(deadline) < new Date() : false;
    const effectiveStatus = status === 'Closed' || isPastDeadline ? 'Closed' : 'Open';

    return (
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-300 flex flex-col">
            <div className="p-5 flex-grow">
                <h4 className="text-lg font-bold text-blue-800 mb-2">{title}</h4>
                <div className="flex items-center text-gray-600 text-sm mb-2">
                    <Globe className="w-4 h-4 mr-2 text-gray-500" />
                    <span>{country || 'N/A'}</span>
                </div>
                <div className="flex items-center text-gray-600 text-sm mb-2">
                    <DollarSign className="w-4 h-4 mr-2 text-gray-500" />
                    <span className="font-semibold">{fundingAmount || 'N/A'}</span>
                </div>
                <div className="flex items-center text-gray-600 text-sm mb-4">
                    <Calendar className="w-4 h-4 mr-2 text-gray-500" />
                    <span>Deadline: {deadline ? new Date(deadline).toLocaleDateString() : 'N/A'}</span>
                </div>
            </div>
            <div className="bg-gray-50 p-4 flex justify-between items-center rounded-b-lg">
                <span className={`px-3 py-1 text-xs font-semibold rounded-full ${effectiveStatus === 'Open' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {effectiveStatus}
                </span>
                <button onClick={() => onSelect(opportunity)} className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                    View Details
                </button>
            </div>
        </div>
    );
};

const FundingModal = ({ opportunity, onClose }) => {
    if (!opportunity) return null;
    
    const [activeTab, setActiveTab] = useState('details');

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4">
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-4xl h-full max-h-[90vh] flex flex-col">
                <div className="p-5 border-b border-gray-200 flex justify-between items-start">
                    <div>
                        <h2 className="text-2xl font-bold text-blue-900">{opportunity.title}</h2>
                        <div className="flex items-center text-gray-500 mt-2 space-x-4 text-sm">
                            <span className="flex items-center"><Globe className="w-4 h-4 mr-1.5"/>{opportunity.country || 'N/A'}</span>
                            <span className="flex items-center"><Briefcase className="w-4 h-4 mr-1.5"/>{opportunity.thematicPriority || 'N/A'}</span>
                            <span className="flex items-center"><DollarSign className="w-4 h-4 mr-1.5"/>{opportunity.fundingAmount || 'N/A'}</span>
                        </div>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <X className="w-8 h-8" />
                    </button>
                </div>

                <div className="border-b border-gray-200">
                    <nav className="flex space-x-4 px-5">
                        <button onClick={() => setActiveTab('details')} className={`py-3 px-1 font-medium ${activeTab === 'details' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}>
                           Details
                        </button>
                        <button onClick={() => setActiveTab('impact')} className={`py-3 px-1 font-medium ${activeTab === 'impact' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}>
                           Impact Tracking
                        </button>
                    </nav>
                </div>

                <div className="flex-grow overflow-y-auto p-6">
                    {activeTab === 'details' && (
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-800 mb-2">Description</h3>
                                <p className="text-gray-600 leading-relaxed">{opportunity.description || 'Not available.'}</p>
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-800 mb-2">Eligibility</h3>
                                <p className="text-gray-600 leading-relaxed">{opportunity.eligibility || 'Not available.'}</p>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <h4 className="font-semibold text-gray-700 mb-2 flex items-center"><Calendar className="w-5 h-5 mr-2 text-blue-600"/>Application Deadline</h4>
                                    <p className="text-gray-800 text-base font-medium">{opportunity.deadline ? new Date(opportunity.deadline).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A'}</p>
                                </div>
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <h4 className="font-semibold text-gray-700 mb-2 flex items-center">
                                        {opportunity.status === 'Open' ? <CheckCircle className="w-5 h-5 mr-2 text-green-600"/> : <Clock className="w-5 h-5 mr-2 text-red-600"/>}
                                        Status
                                    </h4>
                                    <p className={`text-base font-medium ${opportunity.status === 'Open' ? 'text-green-700' : 'text-red-700'}`}>{opportunity.status}</p>
                                </div>
                            </div>
                        </div>
                    )}
                    {activeTab === 'impact' && (
                        <div className="text-center py-10">
                            <BarChart2 className="w-12 h-12 mx-auto text-gray-300 mb-4" />
                            <h3 className="text-lg font-semibold text-gray-700">Impact Tracking</h3>
                            <p className="text-gray-500 mt-2">This feature is under development and will be available soon.</p>
                        </div>
                    )}
                </div>

                <div className="p-5 border-t border-gray-200 bg-gray-50 flex justify-end items-center space-x-4">
                    <button onClick={onClose} className="px-6 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-100">
                        Close
                    </button>
                    <a href={opportunity.source_url || '#'} target="_blank" rel="noopener noreferrer" className="px-6 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 inline-flex items-center">
                        Go to Source <ChevronRight className="w-4 h-4 ml-1"/>
                    </a>
                </div>
            </div>
        </div>
    );
};

// --- Main App Component ---
export default function App() {
    const [selectedOpportunity, setSelectedOpportunity] = useState(null);
    const [allOpportunities, setAllOpportunities] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const initialFilters = {
        searchTerm: '',
        country: '',
        thematicPriority: '',
        fundingType: '',
        status: 'Open',
    };
    const [filters, setFilters] = useState(initialFilters);

    // Fetch data from the live backend API when the component loads
    useEffect(() => {
        const API_URL = "https://us-central1-unops-cameron.cloudfunctions.net/api-function"; 

        fetch(API_URL)
            .then(res => {
                if (!res.ok) {
                    throw new Error('Network response was not ok');
                }
                return res.json();
            })
            .then(data => {
                setAllOpportunities(Array.isArray(data) ? data : []);
                setIsLoading(false);
            })
            .catch(err => {
                console.error("Error fetching data:", err);
                setError(err.message);
                setIsLoading(false);
            });
    }, []);

    const filteredOpportunities = useMemo(() => {
        if (!allOpportunities) return [];
        return allOpportunities.filter(op => {
            if (!op || typeof op.title !== 'string') return false; // Data integrity check
            const searchTermLower = filters.searchTerm.toLowerCase();
            const isPastDeadline = op.deadline ? new Date(op.deadline) < new Date() : false;
            const effectiveStatus = op.status === 'Closed' || isPastDeadline ? 'Closed' : 'Open';

            const titleMatch = op.title.toLowerCase().includes(searchTermLower);
            const descriptionMatch = op.description && op.description.toLowerCase().includes(searchTermLower);

            return (
                (filters.country ? op.country === filters.country : true) &&
                (filters.thematicPriority ? op.thematicPriority === filters.thematicPriority : true) &&
                (filters.fundingType ? op.fundingType === filters.fundingType : true) &&
                (filters.status ? effectiveStatus === filters.status : true) &&
                (titleMatch || descriptionMatch)
            );
        });
    }, [filters, allOpportunities]);

    return (
        <div className="bg-gray-100 min-h-screen font-sans">
            <Header />
            <main className="p-4 md:p-8">
                <FilterSection filters={filters} setFilters={setFilters} onReset={() => setFilters(initialFilters)} allOpportunities={allOpportunities} />
                
                <div className="mt-6">
                    {isLoading ? (
                        <div className="text-center py-16">
                            <p className="text-gray-600 text-lg">Loading opportunities...</p>
                        </div>
                    ) : error ? (
                        <div className="text-center py-16 px-6 bg-red-50 text-red-700 rounded-lg border border-red-200">
                            <h3 className="text-xl font-semibold">Failed to load data</h3>
                            <p className="mt-2">Could not connect to the backend. Please try again later.</p>
                            <p className="text-xs mt-4">Error: {error}</p>
                        </div>
                    ) : (
                        <>
                            <p className="text-gray-600 mb-4">{filteredOpportunities.length} opportunities found.</p>
                            {filteredOpportunities.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {filteredOpportunities.map((op, index) => (
                                        <FundingCard key={op.id || index} opportunity={op} onSelect={setSelectedOpportunity} />
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-16 px-6 bg-white rounded-lg border border-gray-200">
                                    <h3 className="text-xl font-semibold text-gray-700">No matching opportunities found</h3>
                                    <p className="text-gray-500 mt-2">Try adjusting your filters or check back later.</p>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </main>
            
            <FundingModal opportunity={selectedOpportunity} onClose={() => setSelectedOpportunity(null)} />
        </div>
    );
}
