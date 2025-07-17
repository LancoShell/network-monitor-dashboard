from flask import Flask, render_template
from flask_socketio import SocketIO, emit
import psutil
import eventlet
import time
import threading
import numpy as np

eventlet.monkey_patch()

app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret!'
socketio = SocketIO(app)

DATA_HISTORY_LIMIT = 60  # Conserva dati ultimi 60 secondi

network_stats_history = {
    'bytes_sent': [],
    'bytes_recv': [],
    'packets_sent': [],
    'packets_recv': [],
    'errin': [],
    'errout': []
}

def get_network_stats():
    net1 = psutil.net_io_counters()
    time.sleep(1)
    net2 = psutil.net_io_counters()
    stats = {
        'bytes_sent': net2.bytes_sent - net1.bytes_sent,
        'bytes_recv': net2.bytes_recv - net1.bytes_recv,
        'packets_sent': net2.packets_sent - net1.packets_sent,
        'packets_recv': net2.packets_recv - net1.packets_recv,
        'errin': net2.errin - net1.errin,
        'errout': net2.errout - net1.errout
    }
    return stats

def detect_anomaly(metric_list):
    if len(metric_list) < 10:
        return False
    mean = np.mean(metric_list)
    std = np.std(metric_list)
    latest = metric_list[-1]
    # Anomalia se valore supera media + 2*deviazione standard
    return latest > mean + 2 * std

def background_thread():
    while True:
        stats = get_network_stats()
        # Salva in storico limitato
        for key in network_stats_history:
            network_stats_history[key].append(stats[key])
            if len(network_stats_history[key]) > DATA_HISTORY_LIMIT:
                network_stats_history[key].pop(0)

        anomalies = {
            'bytes_sent': detect_anomaly(network_stats_history['bytes_sent']),
            'bytes_recv': detect_anomaly(network_stats_history['bytes_recv']),
            'packets_sent': detect_anomaly(network_stats_history['packets_sent']),
            'packets_recv': detect_anomaly(network_stats_history['packets_recv']),
            'errin': detect_anomaly(network_stats_history['errin']),
            'errout': detect_anomaly(network_stats_history['errout'])
        }

        payload = {
            'stats': stats,
            'anomalies': anomalies
        }
        socketio.emit('network_data', payload)
        socketio.sleep(1)

@app.route('/')
def index():
    return render_template('index.html')

@socketio.on('connect')
def handle_connect():
    print('Client connesso')
    socketio.start_background_task(background_thread)

if __name__ == '__main__':
    socketio.run(app, debug=True)
