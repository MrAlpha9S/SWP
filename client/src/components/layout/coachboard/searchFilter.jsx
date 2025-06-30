import { useState } from 'react';

const SearchFilter = ({ onSearch, onFilterSpecialty }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedSpecialty, setSelectedSpecialty] = useState('');

    const specialties = [
        'All Specialties',
        'Life Coaching',
        'Business Coaching',
        'Career Coaching',
        'Health & Wellness',
        'Executive Coaching',
        'Relationship Coaching'
    ];

    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearchTerm(value);
        onSearch(value);
    };

    const handleSpecialtyChange = (e) => {
        const value = e.target.value;
        setSelectedSpecialty(value);
        onFilterSpecialty(value === 'All Specialties' ? '' : value);
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
            <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1">
                    <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
                        Tìm kiếm
                    </label>
                    <div className="relative">
                        <input
                            type="text"
                            id="search"
                            value={searchTerm}
                            onChange={handleSearchChange}
                            placeholder="Tìm theo tên..."
                            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200"
                        />
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                    </div>
                </div>

                {/*<div className="lg:w-64">*/}
                {/*    <label htmlFor="specialty" className="block text-sm font-medium text-gray-700 mb-2">*/}
                {/*        Filter by Specialty*/}
                {/*    </label>*/}
                {/*    <select*/}
                {/*        id="specialty"*/}
                {/*        value={selectedSpecialty}*/}
                {/*        onChange={handleSpecialtyChange}*/}
                {/*        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200 bg-white"*/}
                {/*    >*/}
                {/*        {specialties.map((specialty) => (*/}
                {/*            <option key={specialty} value={specialty}>*/}
                {/*                {specialty}*/}
                {/*            </option>*/}
                {/*        ))}*/}
                {/*    </select>*/}
                {/*</div>*/}
            </div>
        </div>
    );
};

export default SearchFilter;