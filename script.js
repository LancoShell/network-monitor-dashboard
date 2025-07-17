const maxPoints = 60;

const bytesCtx = document.getElementById('bytesChart').getContext('2d');
const packetsCtx = document.getElementById('packetsChart').getContext('2d');
const errorsCtx = document.getElementById('errorsChart').getContext('2d');

const labels = [];

const bytesSentData = [];
const bytesRecvData = [];

const packetsSentData = [];
const packetsRecvData = [];

const errInData = [];
const errOutData = [];

const bytesChart = new Chart(bytesCtx, {
    type: 'line',
    data: {
        labels: labels,
        datasets: [
            {
                label: 'Bytes Sent',
                data: bytesSentData,
                borderColor: 'rgba(54, 162, 235, 1)',
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                fill: true,
                tension: 0.3,
            },
            {
                label: 'Bytes Received',
                data: bytesRecvData,
                borderColor: 'rgba(255, 99, 132, 1)',
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                fill: true,
                tension: 0.3,
            }
        ]
    },
    options: {
        animation: false,
        scales: { y: { beginAtZero: true } }
    }
});

const packetsChart = new Chart(packetsCtx, {
    type: 'line',
    data: {
        labels: labels,
        datasets: [
            {
                label: 'Packets Sent',
                data: packetsSentData,
                borderColor: 'rgba(255, 206, 86, 1)',
                backgroundColor: 'rgba(255, 206, 86, 0.2)',
                fill: true,
                tension: 0.3,
            },
            {
                label: 'Packets Received',
                data: packetsRecvData,
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                fill: true,
                tension: 0.3,
            }
        ]
    },
    options: {
        animation: false,
        scales: { y: { beginAtZero: true } }
    }
});

const errorsChart = new Chart(errorsCtx, {
    type: 'line',
    data: {
        labels: labels,
        datasets: [
            {
                label: 'Errors In',
                data: errInData,
                borderColor: 'rgba(153, 102, 255, 1)',
                backgroundColor: 'rgba(153, 102, 255, 0.2)',
                fill: true,
                tension: 0.3,
            },
            {
                label: 'Errors Out',
                data: errOutData,
                borderColor: 'rgba(255, 159, 64, 1)',
                backgroundColor: 'rgba(255, 159, 64, 0.2)',
                fill: true,
                tension: 0.3,
            }
        ]
    },
    options: {
        animation: false,
        scales: { y: { beginAtZero: true } }
    }
});

const bytesAlert = document.getElementById('bytesAlert');
const packetsAlert = document.getElementById('packetsAlert');
const errorsAlert = document.getElementById('errorsAlert');

const socket = io();

socket.on('connect', () => {
    console.log('Connesso al server');
});

socket.on('network_data', (data) => {
    const timeLabel = new Date().toLocaleTimeString();

    if (labels.length >= maxPoints) {
        labels.shift();
        bytesSentData.shift();
        bytesRecvData.shift();
        packetsSentData.shift();
        packetsRecvData.shift();
        errInData.shift();
        errOutData.shift();
    }

    labels.push(timeLabel);
    bytesSentData.push(data.stats.bytes_sent);
    bytesRecvData.push(data.stats.bytes_recv);
    packetsSentData.push(data.stats.packets_sent);
    packetsRecvData.push(data.stats.packets_recv);
    errInData.push(data.stats.errin);
    errOutData.push(data.stats.errout);

    bytesChart.update();
    packetsChart.update();
    errorsChart.update();

    // Gestione alert anomalie
    bytesAlert.innerHTML = '';
    packetsAlert.innerHTML = '';
    errorsAlert.innerHTML = '';

    if (data.anomalies.bytes_sent) {
        bytesAlert.innerHTML += `<div class="alert alert-danger">Anomalia Bytes Sent!</div>`;
    }
    if (data.anomalies.bytes_recv) {
        bytesAlert.innerHTML += `<div class="alert alert-danger">Anomalia Bytes Received!</div>`;
    }
    if (data.anomalies.packets_sent) {
        packetsAlert.innerHTML += `<div class="alert alert-warning">Anomalia Packets Sent!</div>`;
    }
    if (data.anomalies.packets_recv) {
        packetsAlert.innerHTML += `<div class="alert alert-warning">Anomalia Packets Received!</div>`;
    }
    if (data.anomalies.errin) {
        errorsAlert.innerHTML += `<div class="alert alert-danger">Anomalia Errors In!</div>`;
    }
    if (data.anomalies.errout) {
        errorsAlert.innerHTML += `<div class="alert alert-danger">Anomalia Errors Out!</div>`;
    }
});
