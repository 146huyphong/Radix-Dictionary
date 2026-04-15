// --- Cấu hình API Chuẩn ---
// Python (Trie Engine) - Thêm /api để khớp với code Python của bạn
const TRIE_API_URL = "https://radix-dictionary-2.onrender.com/api"; 
// Java (Database) - Thêm /api/db/words để khớp với @RequestMapping Java
const DB_API_URL = "https://radix-dictionary.onrender.com/api/db/words";

const container = document.getElementById('tree-container');
const margin = { top: 60, right: 90, bottom: 60, left: 90 };
let width = container.clientWidth - margin.left - margin.right;
let height = container.clientHeight - margin.top - margin.bottom;

const svg = d3.select("#tree-container")
    .append("svg")
    .attr("width", "100%")
    .attr("height", "100%")
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

// 1. Tải và vẽ cây Radix Trie
async function fetchAndRenderTree() {
    try {
        // Đường dẫn chuẩn: TRIE_API_URL + /trie = .../api/trie
        const response = await fetch(`${TRIE_API_URL}/trie`);
        if (!response.ok) throw new Error("Không thể lấy dữ liệu Trie");
        const treeData = await response.json();
        drawTree(treeData);
    } catch (error) {
        console.error("Lỗi khi tải Radix Trie:", error);
        document.getElementById('resultMeaning').innerText = "Mất kết nối đến Trie Engine.";
    }
}

// 2. Hàm vẽ đồ thị D3.js (Giữ nguyên logic của bạn)
function drawTree(data) {
    svg.selectAll("*").remove();
    const root = d3.hierarchy(data);
    const newHeight = Math.max(height, root.height * 150);
    const treeLayout = d3.tree().size([width, newHeight]);
    treeLayout(root);

    svg.selectAll(".link")
        .data(root.links())
        .enter().append("path")
        .attr("class", "link")
        .attr("d", d3.linkVertical().x(d => d.x).y(d => d.y));

    svg.selectAll(".edge-label")
        .data(root.links())
        .enter().append("text")
        .attr("class", "edge-label")
        .attr("x", d => (d.source.x + d.target.x) / 2)
        .attr("y", d => (d.source.y + d.target.y) / 2 - 5)
        .attr("text-anchor", "middle")
        .text(d => d.target.data.name);

    const node = svg.selectAll(".node")
        .data(root.descendants())
        .enter().append("g")
        .attr("class", "node")
        .attr("transform", d => `translate(${d.x},${d.y})`);

    node.append("circle")
        .attr("r", 12)
        .attr("class", d => {
            if (d.data.is_word) return "is-word";
            if (d.data.is_deleted) return "is-deleted";
            return "";
        });

    node.append("title").text(d => d.data.is_word ? `Offset: ${d.data.offset}` : "Intermediate Node");
}

// 3. Thêm từ mới (Gọi Java Backend)
async function addWord() {
    const word = document.getElementById("wordInput").value.trim();
    const meaning = document.getElementById("meaningInput").value.trim();

    if (!word || !meaning) return alert("Vui lòng nhập đủ từ và nghĩa!");

    try {
        const response = await fetch(DB_API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ word, meaning })
        });
        
        if (!response.ok) throw new Error("Lỗi từ cơ sở dữ liệu");

        const savedEntry = await response.json();
        document.getElementById("resultWord").innerText = word;
        document.getElementById("resultStatus").innerText = "THÀNH CÔNG";
        document.getElementById("resultMeaning").innerText = meaning;
        
        // Đợi một chút để Java gọi Python xong rồi mới vẽ lại cây
        setTimeout(fetchAndRenderTree, 500); 
    } catch (error) {
        alert("Lỗi kết nối hoặc xử lý từ Backend!");
    }
}

// 4. Tìm kiếm từ (Phối hợp Python -> Java)
async function searchWord() {
    const word = document.getElementById("wordInput").value.trim().toLowerCase();
    if (!word) return alert("Vui lòng nhập từ cần tìm!");

    try {
        // Bước A: Tìm offset từ Python
        const trieRes = await fetch(`${TRIE_API_URL}/search/${word}`);
        
        if (!trieRes.ok) {
            document.getElementById("resultStatus").innerText = "KHÔNG TỒN TẠI";
            document.getElementById("resultMeaning").innerText = "Từ này chưa được thêm hoặc đã bị xóa.";
            return;
        }

        const trieData = await trieRes.json();

        // Bước B: Lấy nghĩa từ Java bằng ID (offset)
        const dbRes = await fetch(`${DB_API_URL}/${trieData.offset}`);
        
        if (dbRes.ok) {
            const dbData = await dbRes.json();
            document.getElementById("resultWord").innerText = dbData.word;
            document.getElementById("resultStatus").innerText = "TÌM THẤY";
            document.getElementById("resultMeaning").innerText = dbData.meaning;
        }

    } catch (error) {
        alert("Lỗi kết nối khi tìm kiếm!");
    }
}

// 5. Xóa từ (Gọi Python Trie Engine)
async function deleteWord() {
    const word = document.getElementById("wordInput").value.trim().toLowerCase();
    if (!word) return alert("Vui lòng nhập từ cần xóa!");

    try {
        // Đường dẫn chuẩn: .../api/words/memory/{word}
        const response = await fetch(`${TRIE_API_URL}/words/memory/${word}`, { method: "DELETE" });
        if (response.ok) {
            document.getElementById("resultWord").innerText = word;
            document.getElementById("resultStatus").innerText = "ĐÃ XÓA (Lazy Deletion)";
            document.getElementById("resultMeaning").innerText = "Node đã bị đánh dấu xóa trên RAM.";
            fetchAndRenderTree(); 
        } else {
            alert("Không tìm thấy từ để xóa!");
        }
    } catch (error) {
         alert("Lỗi kết nối khi xóa.");
    }
}

// Khởi chạy lần đầu
fetchAndRenderTree();