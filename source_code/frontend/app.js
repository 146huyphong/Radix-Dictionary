// --- Cấu hình API ---
// --- Cấu hình API ---
const TRIE_API_URL = "https://radix-dictionary-2.onrender.com";
const DB_API_URL = "https://radix-dictionary.onrender.com/api/words";
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

async function fetchAndRenderTree() {
    try {
        const response = await fetch(`${TRIE_API_URL}/trie`);
        const treeData = await response.json();
        drawTree(treeData);
    } catch (error) {
        console.error("Lỗi khi tải Radix Trie:", error);
        document.getElementById('resultMeaning').innerText = "Mất kết nối đến Trie Engine (Cổng 8000).";
    }
}

function drawTree(data) {
    svg.selectAll("*").remove(); // Xóa khung vẽ cũ

    const root = d3.hierarchy(data);
    
    const newHeight = Math.max(height, root.height * 150);
    const treeLayout = d3.tree().size([width, newHeight]);
    treeLayout(root);

    svg.selectAll(".link")
        .data(root.links())
        .enter().append("path")
        .attr("class", "link")
        .attr("d", d3.linkVertical()
            .x(d => d.x)
            .y(d => d.y)
        );

    // 2. Vẽ nhãn trên các đường nối (Edge Labels - Tiền tố)
    svg.selectAll(".edge-label")
        .data(root.links())
        .enter().append("text")
        .attr("class", "edge-label")
        .attr("x", d => (d.source.x + d.target.x) / 2)
        .attr("y", d => (d.source.y + d.target.y) / 2 - 5)
        .attr("text-anchor", "middle")
        .text(d => d.target.data.name); // Tên node chính là nhãn của đường đi đến nó

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
    // Gắn hiệu ứng hover (Hiện tooltip nghĩa của từ)
    node.append("title").text(d => d.data.is_word ? `Offset: ${d.data.offset}` : "Intermediate Node");
}


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
        
        if (!response.ok) {
            throw new Error("Lỗi từ cơ sở dữ liệu");
        }

        document.getElementById("resultWord").innerText = word;
        document.getElementById("resultStatus").innerText = "THÀNH CÔNG";
        document.getElementById("resultMeaning").innerText = meaning;
        
        setTimeout(fetchAndRenderTree, 200); 
    } catch (error) {
        alert("Lỗi kết nối hoặc xử lý từ Backend!");
    }
}

async function searchWord() {
    const word = document.getElementById("wordInput").value.trim();
    if (!word) return alert("Vui lòng nhập từ cần tìm!");

    try {
        const trieRes = await fetch(`${TRIE_API_URL}/search/${word}`);
        
        if (!trieRes.ok) {
            document.getElementById("resultStatus").innerText = "KHÔNG TỒN TẠI";
            document.getElementById("resultMeaning").innerText = "Từ này chưa được thêm hoặc đã bị xóa mềm.";
            return;
        }

        const trieData = await trieRes.json();

        const dbRes = await fetch(`${DB_API_URL}/${trieData.offset}`);
        
        if (dbRes.ok) {
            const dbData = await dbRes.json();
            // Hiển thị kết quả hoàn hảo lên màn hình!
            document.getElementById("resultWord").innerText = dbData.word;
            document.getElementById("resultStatus").innerText = "TÌM THẤY";
            document.getElementById("resultStatus").className = "text-green-600 font-label text-xs uppercase font-bold mt-1";
            document.getElementById("resultMeaning").innerText = dbData.meaning;
        }

    } catch (error) {
        alert("Lỗi kết nối!");
    }
}

async function deleteWord() {
    const word = document.getElementById("wordInput").value.trim();
    if (!word) return alert("Vui lòng nhập từ cần xóa!");

    try {
        const response = await fetch(`${TRIE_API_URL}/words/memory/${word}`, { method: "DELETE" });
        if (response.ok) {
            document.getElementById("resultWord").innerText = word;
            document.getElementById("resultStatus").innerText = "ĐÃ XÓA (Lazy Deletion)";
            document.getElementById("resultMeaning").innerText = "Node đã bị ngắt cờ is_word.";
            fetchAndRenderTree(); // Cập nhật lại màu sắc của node trên đồ thị
        } else {
            alert("Không tìm thấy từ để xóa!");
        }
    } catch (error) {
         alert("Lỗi kết nối khi xóa.");
    }
}

fetchAndRenderTree();