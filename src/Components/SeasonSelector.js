import { useState, useRef, useEffect } from 'react';
import { IoIosArrowDown } from "react-icons/io";

const SeasonSelector = ({ props }) => {

    const { onSeasonSelect, setSeasonModal, setShowTable } = props

    const startYear = 2020;
    const endYear = new Date().getFullYear() + 2;

    const [selectedSeason, setSelectedSeason] = useState(`${startYear}/${startYear + 1}`);
    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const dropdownRef = useRef(null);

    useEffect(() => {
        const fetchInitialSeason = async () => {
            try {
                if (typeof window.electronAPI.getPreference === 'function') {
                    const savedSeason = await window.electronAPI.getPreference('selectedSeason');
                    if (savedSeason) {
                        setSelectedSeason(savedSeason);
                        if (typeof setSeasonModal === 'function') {
                            setSeasonModal(savedSeason);
                        }
                        if (typeof onSeasonSelect === 'function') {
                            onSeasonSelect({ filterSeason: savedSeason });
                        }
                    }
                } else {
                    console.error("window.electronAPI.getPreference is not a function");
                }
            } catch (error) {
                console.error("Failed to load preferences", error);
            }
        };
        fetchInitialSeason();
    }, [onSeasonSelect, setSeasonModal]);

    const seasons = Array.from({ length: endYear - startYear }, (_, index) => {
        const year = startYear + index;
        return `${year}/${year + 1}`;
    });

    const toggleDropdown = () => setIsOpen(!isOpen);

    const handleSelect = (season) => {
        setShowTable({});
        setSelectedSeason(season);
        if (typeof setSeasonModal === 'function') {
            setSeasonModal(season);
        }
        setIsOpen(false);
        setSearchQuery(''); // Reset the search query when an item is selected
        if (typeof window.electronAPI.setPreference === 'function') {
            window.electronAPI.setPreference('selectedSeason', season);
        }
        if (typeof onSeasonSelect === 'function') {
            onSeasonSelect({ filterSeason: season });
        }
    };

    const filteredSeasons = seasons.filter(season =>
        season.toLowerCase().includes(searchQuery.toLowerCase())
    );

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [dropdownRef]);

    return (
        <div ref={dropdownRef} className="relative inline-block text-left w-32">
            <div>
                <button
                    type="button"
                    className="inline-flex justify-between w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:border-blue-500"
                    onClick={toggleDropdown}
                >
                    {selectedSeason}
                    <IoIosArrowDown className="ml-2 -mr-1 h-5 w-5" />
                </button>
            </div>
            {isOpen && (
                <div className="origin-top-right absolute right-0 mt-2 w-full rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 max-h-60 overflow-y-auto">
                    <div className="sticky top-0 bg-white z-10">
                        <input
                            type="text"
                            className="w-full px-4 py-2 text-sm border-b border-gray-200 focus:outline-none"
                            placeholder="Ricerca..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <div className="py-1">
                        {filteredSeasons.length > 0 ? (
                            filteredSeasons.map((season, index) => (
                                <div
                                    key={index}
                                    className={`cursor-pointer block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 ${season === selectedSeason ? 'bg-blue-100' : ''}`}
                                    onClick={() => handleSelect(season)}
                                >
                                    {season}
                                </div>
                            ))
                        ) : (
                            <div className="px-4 py-2 text-sm text-gray-700">
                                Nessuna stagione trovata
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default SeasonSelector;
