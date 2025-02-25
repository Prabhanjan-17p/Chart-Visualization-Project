let globalData = [];

fetch('dump.json')
    .then(res => res.json())
    .then(data => {
        globalData = data;
        const uniqueNames = [...new Set(data.map(item => item.index_name))]; 
        displayIndexNames(uniqueNames);

        updateBarChart(uniqueNames[0]);
        updateLineChart(uniqueNames[0]);
    })
    .catch(err => console.error('Error fetching data:', err));

    
function displayIndexNames(indexNames) {
    const cName = document.getElementById('cName');
    cName.innerHTML = indexNames
        .map(name => `<span class="spanIndexName" onclick="fetchIndexData('${name}')">${name}</span>`)
        .join('');
}


window.fetchIndexData = function (indexName) {
    document.getElementById('saIndexName').textContent = "" + indexName;
    updateBarChart(indexName);
    updateLineChart(indexName);
};


function calculateVolumeByMonth(indexName) {
    const grouped = {};
    globalData.forEach(item => {
        if (item.index_name === indexName) {
            const month = item.index_date.substring(0, 7);
            grouped[month] = (grouped[month] || 0) + (item.volume || 0);
        }
    });
    return grouped;
}


function calculateChangePercent(indexName) {
    const grouped = {};
    globalData.forEach(item => {
        if (item.index_name === indexName) {
            const month = item.index_date.substring(0, 7);
            grouped[month] = parseFloat(item.change_percent) || 0;
        }
    });
    return grouped;
}


const barChart = new Chart(document.getElementById('myChart'), {
    type: 'bar',
    data: {
        labels: [], datasets: [{
            label: 'Total Trading Volume (Monthly)', data: [], 
            backgroundColor: [
                'rgba(255, 26, 104, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.2)',
                'rgba(0, 0, 0, 0.2)'
            ], 
            borderColor: [
                'rgba(255, 26, 104, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)',
                'rgba(0, 0, 0, 1)'
            ], borderWidth: 1
        }]
    },
    options: { responsive: true, maintainAspectRatio: false, scales: { y: { beginAtZero: true } } }
});


function updateBarChart(indexName) {
    const data = calculateVolumeByMonth(indexName);
    barChart.data.labels = Object.keys(data);
    barChart.data.datasets[0].data = Object.values(data);
    barChart.update();
}



const lineChart = new Chart(document.getElementById('myLineChart'), {
    type: 'line',
    data: {
        labels: [], datasets: [{
            label: 'Change Percent Over Time',
            data: [],
            borderColor: 'rgba(255, 99, 132, 1)',
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            borderWidth: 2, fill: false, tension: 0.3
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            x: {
                title: {
                    display: true,
                    text: 'Month'
                }
            }, y: {
                title: {
                    display: true, text: 'Change Percent (%)'
                }, 
                beginAtZero: true
            }
        }
    }
});


function updateLineChart(indexName) {
    const data = calculateChangePercent(indexName);
    const labels = Object.keys(data).sort();
    const values = Object.values(data);

    lineChart.data.labels = labels;
    lineChart.data.datasets[0].data = values;
    lineChart.update();

    
    document.getElementById('chartContainer').style.width = `${Math.max(800, labels.length * 60)}px`;
    document.getElementById('myLineChart').style.height = `${Math.min(600, values.length * 25)}px`;
}


function calculateTotalVolume(data) {
    const totalVolume = {};
    data.forEach(item => {
        const indexName = item.index_name;
        const volume = item.volume || 0;
        totalVolume[indexName] = (totalVolume[indexName] || 0) + volume;
    });
    return totalVolume;
}


function createPieChart(totalVolumeData) {
    const indexNames = Object.keys(totalVolumeData);
    const volumes = indexNames.map(index => totalVolumeData[index]);

    const pieData = {
        labels: indexNames,
        datasets: [{
            data: volumes,
            backgroundColor: indexNames.map(() => `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 0.5)`),
            borderColor: indexNames.map(() => `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 1)`),
            borderWidth: 1
        }]
    };

    new Chart(document.getElementById('totalVolumePieChart'), {
        type: 'pie',
        data: pieData,
        options: { responsive: true, plugins: { legend: { position: 'top' } } }
    });
}


function openBarC() {
    document.getElementById('openBar').style.display = 'block';
    document.getElementById('scrollContainer').style.display = 'none';
    document.getElementById('pieOpen').style.display = 'none';
}

function openLineC() {
    document.getElementById('openBar').style.display = 'none';
    document.getElementById('scrollContainer').style.display = 'block';
    document.getElementById('pieOpen').style.display = 'none';
}

function openPieC() {
    document.getElementById('openBar').style.display = 'none';
    document.getElementById('scrollContainer').style.display = 'none';
    document.getElementById('pieOpen').style.display = 'block';

    createPieChart(calculateTotalVolume(globalData));
}





const openSetting = document.getElementById("mobSetting2")
const closeSetting = document.getElementById("mobSetting")
const showIndex = document.getElementById("mainDiv")

function closeSettingInMobile() {
    showIndex.style.marginLeft = '-900px'
}
function openSettingInMobile() {
    showIndex.style.marginLeft = '0px'
}