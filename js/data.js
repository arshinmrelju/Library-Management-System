// Mock Data representing the shared library state
const defaultBooks = [
    {
        id: 1,
        title: "Godan",
        author: "Munshi Premchand",
        description: "A classic Hindi novel depicting the life of rural India and the struggles of a poor peasant.",
        image: "🌾",
        color: "#4caf50",
        location: { section: "Fiction", shelf: "A-1", row: "Top" },
        available: true
    },
    {
        id: 2,
        title: "Panchatantra",
        author: "Vishnu Sharma",
        description: "Ancient Indian collection of interrelated animal fables filled with moral lessons for everyday life.",
        image: "🦁",
        color: "#ff9800",
        location: { section: "Non-Fiction", shelf: "B-2", row: "Middle" },
        available: true
    },
    {
        id: 3,
        title: "Agriculture Basics",
        author: "Gov. of India",
        description: "Simple techniques and modern practices for improving crop yield in rural farming.",
        image: "🚜",
        color: "#8bc34a",
        location: { section: "Science", shelf: "C-1", row: "Bottom" },
        available: true
    },
    {
        id: 4,
        title: "Children's Stories",
        author: "Various Authors",
        description: "A collection of simple, fun bedtime stories for kids with pictures.",
        image: "🧸",
        color: "#03a9f4",
        location: { section: "Children's Books", shelf: "A-3", row: "Eye-level" },
        available: true
    },
    {
        id: 5,
        title: "Health & Hygiene Guide",
        author: "Medical Council",
        description: "Important tips for maintaining family health and clean surroundings.",
        image: "🏥",
        color: "#e91e63",
        location: { section: "Science", shelf: "D-2", row: "Top" },
        available: true
    },
    {
        id: 6,
        title: "Basic Mathematics",
        author: "Education Board",
        description: "Learn counting, addition, subtraction, and basic accounting for daily shops and trades.",
        image: "🧮",
        color: "#9c27b0",
        location: { section: "Non-Fiction", shelf: "C-2", row: "Middle" },
        available: true
    }
];

// Initialize global state in LocalStorage (so admin and app can share it)
let libraryData = JSON.parse(localStorage.getItem('navodaya_library_data'));

if (!libraryData) {
    libraryData = {
        books: defaultBooks,
        requests: [] // shape: { id, userPhone, userName, bookId, status: 'pending'|'approved'|'rejected'|'returned', timestamp }
    };
    localStorage.setItem('navodaya_library_data', JSON.stringify(libraryData));
}

// Helper to save global state
window.saveLibraryData = function() {
    localStorage.setItem('navodaya_library_data', JSON.stringify(libraryData));
};

// Helper to format dates
window.formatDate = function(timestamp) {
    const d = new Date(timestamp);
    return d.toLocaleDateString() + ' ' + d.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
};
