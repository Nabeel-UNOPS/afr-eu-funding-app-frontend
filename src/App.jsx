import React, { useState, useMemo, useEffect } from 'react';
import { Search, Filter, X, ChevronRight, Briefcase, Globe, DollarSign, Calendar, Clock, BarChart2, Loader2 } from 'lucide-react';

// --- Components ---

const Header = () => (
    <header className="bg-white shadow-sm p-4 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto flex justify-center items-center">
            <div className="flex items-center space-x-4">
                <img 
                    src="https://www.unops.org/assets/unops-logo-blue.svg" 
                    alt="UNOPS Logo" 
                    className="h-8"
                    onError={(e) => { e.target.onerror = null; e.target.src='https://placehold.co/120x32/0075C9/FFFFFF?text=UNOPS'; }}
                />
                <h1 className="text-xl md:text-2xl font-semibold text-gray-700">UNOPS Africa Funding Gateway</h1>
            </div>
        </div>
    </header>
);

const FilterSection = ({ filters, setFilters, onReset, allOpportunities }) => {
    const countries = [...new Set(allOpportunities.map(op => op.country).filter(Boolean).filter(c => c !== 'Not specified'))].sort();
    const thematicPriorities = [...new Set(allOpportunities.map(op => op.thematicPriority).filter(Boolean).filter(p => p !== 'Not specified'))].sort();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    return (
        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-end">
                <div className="lg:col-span-2">
                    <label htmlFor="searchTerm" className="text-sm font-medium text-gray-600 block mb-1">Search by Keyword</label>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                        <input
                            type="text"
                            name="searchTerm"
                            id="searchTerm"
                            placeholder="e.g., 'Health', 'Infrastructure', 'Kenya'..."
                            value={filters.searchTerm}
                            onChange={handleInputChange}
                            className="w-full p-2 pl-10 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                </div>

                <div>
                    <label htmlFor="country" className="text-sm font-medium text-gray-600 block mb-1">Country</label>
                    <select name="country" id="country" value={filters.country} onChange={handleInputChange} className="w-full p-2 border border-gray-300 rounded-md bg-white">
                        <option value="">All Countries</option>
                        {countries.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                </div>
            </div>
             <button onClick={onReset} className="mt-4 text-sm text-gray-600 hover:text-blue-600">
                Reset filters
            </button>
        </div>
    );
};

const FundingCard = ({ opportunity, onSelect }) => {
    const { title, country, fundingAmount, deadline, status } = opportunity;
    const isPastDeadline = deadline && deadline !== 'Not specified' ? new Date(deadline) < new Date() : false;
    const effectiveStatus = status === 'Closed' || isPastDeadline ? 'Closed' : 'Open';

    return (
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-300 flex flex-col group">
            <div className="p-5 flex-grow">
                <span className={`mb-2 inline-block px-2.5 py-0.5 text-xs font-semibold rounded-full ${effectiveStatus === 'Open' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {effectiveStatus}
                </span>
                <h4 className="text-lg font-bold text-gray-800 group-hover:text-blue-600 transition-colors duration-300 mb-2">{title}</h4>
                <div className="flex items-center text-gray-500 text-sm mb-2">
                    <Globe className="w-4 h-4 mr-2 flex-shrink-0" />
                    <span>{country || 'Not specified'}</span>
                </div>
                <div className="flex items-center text-gray-500 text-sm">
                    <DollarSign className="w-4 h-4 mr-2 flex-shrink-0" />
                    <span className="font-medium text-gray-700">{fundingAmount || 'Not specified'}</span>
                </div>
            </div>
            <div className="border-t border-gray-100 bg-gray-50/50 p-4 flex justify-between items-center rounded-b-lg">
                 <div className="flex items-center text-sm text-gray-500">
                    <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                    <span>Deadline: {deadline || 'Not specified'}</span>
                </div>
                <button onClick={() => onSelect(opportunity)} className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                    Details
                </button>
            </div>
        </div>
    );
};

const FundingModal = ({ opportunity, onClose }) => {
    if (!opportunity) return null;
    
    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-center items-center p-4 animate-fade-in">
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col">
                <div className="p-5 border-b border-gray-200 flex justify-between items-start">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800">{opportunity.title}</h2>
                        <div className="flex flex-wrap items-center text-gray-500 mt-2 gap-x-4 gap-y-1 text-sm">
                            <span className="flex items-center"><Globe className="w-4 h-4 mr-1.5"/>{opportunity.country || 'Not specified'}</span>
                            <span className="flex items-center"><DollarSign className="w-4 h-4 mr-1.5"/>{opportunity.fundingAmount || 'Not specified'}</span>
                        </div>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <div className="flex-grow overflow-y-auto p-6 space-y-6">
                    <div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-2 border-b pb-2">Description</h3>
                        <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">{opportunity.description || 'Not available.'}</p>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-2 border-b pb-2">Eligibility</h3>
                        <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">{opportunity.eligibility || 'Not available.'}</p>
                    </div>
                </div>

                <div className="p-4 border-t border-gray-200 bg-gray-50 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <div className="text-sm text-gray-600">
                        <strong>Deadline:</strong> {opportunity.deadline || 'Not specified'}
                    </div>
                    <a href={opportunity.source_url || '#'} target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto px-6 py-2.5 text-sm font-semibold text-white bg-green-600 rounded-md hover:bg-green-700 inline-flex items-center justify-center">
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
    };
    const [filters, setFilters] = useState(initialFilters);

    useEffect(() => {
        const API_URL = "https://us-central1-unops-cameron.cloudfunctions.net/api-function"; 

        fetch(API_URL)
            .then(res => {
                if (!res.ok) throw new Error('Network response was not ok');
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
            if (!op || typeof op.title !== 'string') return false;
            const searchTermLower = filters.searchTerm.toLowerCase();
            
            const titleMatch = op.title.toLowerCase().includes(searchTermLower);
            const descriptionMatch = op.description && op.description.toLowerCase().includes(searchTermLower);
            const countryMatch = op.country && op.country.toLowerCase().includes(searchTermLower);

            return (
                (filters.country ? op.country === filters.country : true) &&
                (filters.thematicPriority ? op.thematicPriority === filters.thematicPriority : true) &&
                (searchTermLower === '' || titleMatch || descriptionMatch || countryMatch)
            );
        });
    }, [filters, allOpportunities]);

    return (
        <div className="bg-gray-100 min-h-screen font-sans">
            <Header />
            <main className="max-w-7xl mx-auto p-4 md:p-8">
                <FilterSection filters={filters} setFilters={setFilters} onReset={() => setFilters(initialFilters)} allOpportunities={allOpportunities} />
                
                <div className="mt-8">
                    {isLoading ? (
                        <div className="text-center py-16 flex flex-col items-center text-gray-500">
                            <Loader2 className="w-8 h-8 animate-spin mb-4" />
                            <p className="text-lg">Loading opportunities...</p>
                        </div>
                    ) : error ? (
                        <div className="text-center py-16 px-6 bg-red-50 text-red-700 rounded-lg border border-red-200">
                            <h3 className="text-xl font-semibold">Failed to Load Data</h3>
                            <p className="mt-2">Could not connect to the backend engine. Please try again later.</p>
                        </div>
                    ) : (
                        <>
                            <p className="text-gray-600 mb-4 text-sm">{filteredOpportunities.length} opportunities found.</p>
                            {filteredOpportunities.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {filteredOpportunities.map((op, index) => (
                                        <FundingCard key={op.source_url || index} opportunity={op} onSelect={setSelectedOpportunity} />
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-16 px-6 bg-white rounded-lg border border-gray-200">
                                    <h3 className="text-xl font-semibold text-gray-700">No Matching Opportunities Found</h3>
                                    <p className="text-gray-500 mt-2">Try adjusting your filters or check back later for new data.</p>
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
