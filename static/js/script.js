document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const dropZone = document.getElementById('dropZone');
    const browseBtn = document.getElementById('browseBtn');
    const folderInput = document.getElementById('folderInput');
    const organizeBtn = document.getElementById('organizeBtn');
    const progressSection = document.getElementById('progressSection');
    const progressBar = document.getElementById('progressBar');
    const progressPercent = document.getElementById('progressPercent');
    const progressText = document.getElementById('progressText');
    const resultsSection = document.getElementById('resultsSection');
    const totalFilesEl = document.getElementById('totalFiles');
    const organizedFilesEl = document.getElementById('organizedFiles');
    const duplicatesRemovedEl = document.getElementById('duplicatesRemoved');
    const categoriesTable = document.getElementById('categoriesTable');

    // Variables
    let selectedFiles = [];
    
    // Event Listeners
    browseBtn.addEventListener('click', () => folderInput.click());
    
    folderInput.addEventListener('change', handleFileSelect);
    
    dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropZone.classList.add('border-blue-500', 'bg-blue-50');
    });
    
    dropZone.addEventListener('dragleave', () => {
        dropZone.classList.remove('border-blue-500', 'bg-blue-50');
    });
    
    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropZone.classList.remove('border-blue-500', 'bg-blue-50');
        if (e.dataTransfer.items) {
            const items = [...e.dataTransfer.items];
            const files = items
                .filter(item => item.kind === 'file')
                .map(item => item.getAsFile());
            handleFiles(files);
        }
    });
    
    organizeBtn.addEventListener('click', startOrganization);

    // Functions
    function handleFileSelect(e) {
        selectedFiles = [...e.target.files];
        updateUI();
    }

    function handleFiles(files) {
        selectedFiles = files;
        updateUI();
    }

    function updateUI() {
        if (selectedFiles.length > 0) {
            organizeBtn.disabled = false;
            progressText.textContent = `Ready to organize ${selectedFiles.length} files`;
        } else {
            organizeBtn.disabled = true;
        }
    }

    async function startOrganization() {
        // Show progress
        progressSection.classList.remove('hidden');
        organizeBtn.disabled = true;
        
        // Create FormData
        const formData = new FormData();
        selectedFiles.forEach(file => {
            formData.append('folder', file);
        });
        
        // Simulate progress
        simulateProgress();
        
        try {
            // In a real app, you would use fetch to send to the backend
            // const response = await fetch('/organize', {
            //     method: 'POST',
            //     body: formData
            // });
            // const data = await response.json();
            
            // For demo, we simulate the response
            setTimeout(() => {
                const data = {
                    status: 'success',
                    message: 'Files organized successfully',
                    stats: {
                        total: selectedFiles.length,
                        organized: Math.floor(selectedFiles.length * 0.9),
                        duplicates: Math.floor(selectedFiles.length * 0.1),
                        categories: [
                            {name: 'Images', count: Math.floor(selectedFiles.length * 0.4), size: '45.2 MB'},
                            {name: 'Documents', count: Math.floor(selectedFiles.length * 0.3), size: '8.7 MB'},
                            {name: 'Videos', count: Math.floor(selectedFiles.length * 0.1), size: '1.2 GB'},
                            {name: 'Other', count: Math.floor(selectedFiles.length * 0.2), size: '12.3 MB'}
                        ]
                    }
                };
                
                // Update results
                showResults(data.stats);
            }, 2000);
            
        } catch (error) {
            console.error('Error:', error);
            progressText.textContent = 'Error organizing files';
        }
    }

    function simulateProgress() {
        let width = 0;
        const interval = setInterval(() => {
            width += 5;
            progressBar.style.width = width + '%';
            progressPercent.textContent = width + '%';
            
            if (width >= 100) {
                clearInterval(interval);
                progressText.textContent = 'Organization complete!';
            } else {
                progressText.textContent = `Processing... ${width}%`;
            }
        }, 150);
    }

    function showResults(stats) {
        // Update stats
        totalFilesEl.textContent = stats.total;
        organizedFilesEl.textContent = stats.organized;
        duplicatesRemovedEl.textContent = stats.duplicates;
        
        // Update categories table
        categoriesTable.innerHTML = '';
        stats.categories.forEach(category => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center">
                        <div class="text-sm font-medium text-gray-900">${category.name}</div>
                    </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-900">${category.count}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-900">${category.size}</div>
                </td>
            `;
            categoriesTable.appendChild(row);
        });
        
        // Show results
        resultsSection.classList.remove('hidden');
    }
});
