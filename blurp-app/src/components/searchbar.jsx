
function SearchBar() {
    return (
        <>
            <form class="absolute w-full flex items-center justify-center m-2">   
            <div class="relative w-2/5">
                <div class="searchbar-icon">
                    <svg aria-hidden="true" class="w-5 h-5 text-gray-500 dark:text-gray-500" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd"></path></svg>
                </div>
                <input type="text" id="voice-search" class="searchbar-input" placeholder="Search map" required />
            </div>
            <button type="submit" class="searchbar-btn">Search</button>
        </form>
        </>
    );
}

export default SearchBar;