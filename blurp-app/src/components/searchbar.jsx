
function SearchBar() {
    return (
        <>
            <form className="absolute w-full flex items-center justify-center py-2">   
                <div classNameName="relative w-2/5">
                    <div className="searchbar-icon">
                        <svg aria-hidden="true" className="w-5 h-5 text-gray-500 dark:text-gray-500"
                            fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6
                                0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 
                                6 0 012 8z" clip-rule="evenodd" />
                        </svg>
                    </div>
                    <input type="text" id="voice-search" className="searchbar-input"
                        placeholder="Search map" required />
                </div>
                <button type="submit" className="searchbar-btn">Search</button>
            </form>
        </>
    );
}

export default SearchBar;