# Prometheus-grafana-mongodb-monitoring
**"Prometheus + Grafana + MongoDB: Real-Time Metrics &amp; Data Management"**   A detailed guide to setting up Prometheus for monitoring, Grafana for metrics visualization, and MongoDB for data storage. Includes configurations, queries, and tips for building an integrated monitoring system.


# Complete Setup: Grafana, Prometheus, and MongoDB 

In this guide, we will go through the process of setting up **Prometheus** to collect system metrics, using **Grafana** for visualizing those metrics, and storing the collected metrics in **MongoDB** for long-term storage. By the end, you will have a fully functional monitoring system where Prometheus collects metrics, Grafana visualizes them, and MongoDB stores the data.

## **Table of Contents**

1. [Install Prometheus](#1-install-prometheus)
2. [Install Grafana](#2-install-grafana)
3. [Configure Prometheus as a Data Source in Grafana](#3-configure-prometheus-as-a-data-source-in-grafana)
4. [Create Dashboards in Grafana](#4-create-dashboards-in-grafana)
5. [Install MongoDB](#5-install-mongodb)
6. [Store Metrics in MongoDB](#6-store-metrics-in-mongodb)
7. [Create a Node.js Server for MongoDB Integration](#7-create-a-nodejs-server-for-mongodb-integration)
8. [Test and Validate the Setup](#8-test-and-validate-the-setup)

---

## **1. Install Prometheus**

Prometheus is a tool used to collect and store metrics from different systems in a time-series database. Here's how you can install it:

### **Steps to Install Prometheus**:

1. **Download Prometheus**:
   - Go to the official Prometheus download page: [Prometheus Download](https://prometheus.io/download/).
   - Download the version of Prometheus that matches your operating system.

2. **Extract the Prometheus Files**:
   - Extract the downloaded file using a terminal or file manager.

   ```bash
   tar xvfz prometheus-*.tar.gz
   ```

3. **Configure Prometheus**:
   - Open the `prometheus.yml` configuration file in a text editor.
   - Add your targets under `scrape_configs` to specify which metrics to scrape. For example:

   ```yaml
   global:
     scrape_interval: 15s

   scrape_configs:
     - job_name: 'node-exporter'
       static_configs:
         - targets: ['192.168.49.2:9100']
   ```

   - In this configuration:
     - Prometheus will scrape metrics from `192.168.49.2:9100` every 15 seconds.

4. **Run Prometheus**:
   - Navigate to the Prometheus directory and run Prometheus:

   ```bash
   ./prometheus --config.file=prometheus.yml
   ```

5. **Verify Prometheus**:
   - Open a web browser and go to [http://localhost:9090](http://localhost:9090). You should see the Prometheus web interface.

---

## **2. Install Grafana**

Grafana is a powerful open-source visualization tool used to create dashboards and visualize data. Here's how to install Grafana:

### **Steps to Install Grafana**:

1. **Download Grafana**:
   - Go to the official Grafana download page: [Grafana Download](https://grafana.com/grafana/download).
   - Choose the appropriate version for your operating system.

2. **Install Grafana**:
   - Follow the instructions on the download page for your operating system.
   - On Ubuntu, you can install Grafana via APT:

   ```bash
   sudo apt-get install grafana
   ```

3. **Start Grafana**:
   - Start Grafana by running:

   ```bash
   sudo systemctl start grafana-server
   ```

4. **Access Grafana**:
   - Open a web browser and go to [http://localhost:3000](http://localhost:3000). You should see the Grafana login screen.
   - Use the default username `admin` and password `admin` to log in.

---

## **3. Configure Prometheus as a Data Source in Grafana**

Grafana needs to know where to fetch data from. In this step, we’ll configure Prometheus as a data source in Grafana.

### **Steps to Configure Prometheus in Grafana**:

1. **Add Prometheus Data Source**:
   - In the Grafana dashboard, click on the gear icon (**Configuration**).
   - Click on **Data Sources** and then click **Add data source**.
   - Choose **Prometheus** from the list of available data sources.

2. **Configure the URL**:
   - Set the **URL** to `http://localhost:9090` (or the URL of your Prometheus instance).
   - Leave other settings as default, then click **Save & Test** to verify the connection.

---

## **4. Create Dashboards in Grafana**

Now that Grafana is connected to Prometheus, let's create a dashboard to visualize the data.

### **Steps to Create a Dashboard**:

1. **Create a New Dashboard**:
   - Click on the **+** sign on the left sidebar and choose **Dashboard**.
   - Click **Add new panel** to create your first visualization.

2. **Select the Prometheus Metric**:
   - In the **Query** section, select the metric you want to visualize. For example, to view CPU usage, you can use the following query:

   ```yaml
   rate(node_cpu_seconds_total{mode="user"}[1m])
   ```

3. **Customize the Panel**:
   - You can adjust the **Panel Title**, **Legend**, and **Other Display Options** to make the panel more readable.
   - Click **Apply** to save your panel.

4. **Save the Dashboard**:
   - After adding all the panels you need, click the **disk icon** on the top-right corner to save the dashboard.

---

## **5. Install MongoDB**

MongoDB is a NoSQL database that stores data in flexible, JSON-like documents. In this step, we will install MongoDB.

### **Steps to Install MongoDB**:

1. **Install MongoDB**:
   - Follow the installation guide on the MongoDB website for your operating system: [MongoDB Installation Docs](https://www.mongodb.com/docs/manual/installation/).
   - On Ubuntu, use the following command:

   ```bash
   sudo apt-get install -y mongodb
   ```

2. **Start MongoDB**:
   - Start the MongoDB service:

   ```bash
   sudo systemctl start mongod
   ```

3. **Verify MongoDB**:
   - Open a terminal and run the following command to check if MongoDB is running:

   ```bash
   sudo systemctl status mongod
   ```

---

## **6. Store Metrics in MongoDB**

Now we’ll create a way to store system metrics in MongoDB. For this, we will use a Node.js application to fetch data from Prometheus and save it into MongoDB.

### **Steps to Store Metrics**:

1. **Set Up Node.js Application**:
   - Create a new directory for your project:

   ```bash
   mkdir monitoring-app
   cd monitoring-app
   ```

2. **Install Dependencies**:
   - Install the required libraries:

   ```bash
   npm init -y
   npm install express mongoose prom-client
   ```

3. **Create a Mongoose Schema for Storing Metrics**:
   - Create a file called `metrics.js` in your project directory with the following content:

   ```javascript
   const mongoose = require('mongoose');

   // Define a schema for metrics
   const MetricSchema = new mongoose.Schema({
     metric_name: String,
     value: Number,
     timestamp: { type: Date, default: Date.now },
   });

   const Metric = mongoose.model('Metric', MetricSchema);
   ```

4. **Store Metrics in MongoDB**:
   - Modify your Node.js server to fetch data from Prometheus and store it in MongoDB.

   ```javascript
   const express = require('express');
   const mongoose = require('mongoose');
   const Prometheus = require('prom-client');
   const app = express();

   mongoose.connect('mongodb://localhost:27017/metrics', { useNewUrlParser: true, useUnifiedTopology: true });

   const register = new Prometheus.Registry();
   const cpuUsage = new Prometheus.Gauge({
     name: 'cpu_usage',
     help: 'CPU usage in percentage',
     registers: [register],
   });

   // Function to collect and store metrics
   function collectAndStoreMetrics() {
     const cpuUsageData = Math.random() * 100; // Simulated data

     // Insert data into MongoDB
     const Metric = mongoose.model('Metric', {
       metric_name: String,
       value: Number,
       timestamp: { type: Date, default: Date.now },
     });

     const newMetric = new Metric({
       metric_name: 'cpu_usage',
       value: cpuUsageData,
     });

     newMetric.save().then(() => console.log('Metric saved to MongoDB'));

     // Set Prometheus gauge
     cpuUsage.set(cpuUsageData);
   }

   // Collect metrics every 10 seconds
   setInterval(collectAndStoreMetrics, 10000);

   // Start the Express server
   app.get('/metrics', (req, res) => {
     res.set('Content-Type', register.contentType);
     res.end(register.metrics());
   });

   app.listen(3000, () => {
     console.log('Server running on port 3000');
   });
   ```

5. **Run the

 Node.js Application**:
   - Start the server:

   ```bash
   node server.js
   ```

---

## **7. Create a Node.js Server for MongoDB Integration**

In this step, we will create the backend code to pull metrics from Prometheus, store them in MongoDB, and set up an API for visualization.

### **Steps for Node.js Server**:
This part was covered in the previous step with the Node.js code. You already have the Node.js server set up to collect and store metrics in MongoDB.

---

## **8. Test and Validate the Setup**

Now that everything is set up, it’s time to test and make sure everything is working:

1. **Check Prometheus**:
   - Open Prometheus at [http://localhost:9090](http://localhost:9090) and check if metrics are being collected.

2. **Check Grafana Dashboards**:
   - Open Grafana at [http://localhost:3000](http://localhost:3000), and check if the dashboard is displaying the metrics.

3. **Check MongoDB**:
   - Open MongoDB and verify that the metrics are being saved properly.

---
Screenshot
![Screenshot 2024-11-23 223046](https://github.com/user-attachments/assets/5bfecdb8-15f0-44a7-97aa-bda4822f91bc)

![Screenshot 2024-11-23 215949](https://github.com/user-attachments/assets/6a03b124-8070-4660-88ba-f522ff4385da)

![Screenshot 2024-11-23 230230](https://github.com/user-attachments/assets/711e0507-f22d-4a4a-b992-12abf68f3715)

![Screenshot 2024-11-23 230243](https://github.com/user-attachments/assets/00a40251-a4ca-4201-a797-93dedc187454)

![Screenshot 2024-11-23 234628](https://github.com/user-attachments/assets/bd2e732d-2505-43ea-8b97-a36456566f51)

![Screenshot 2024-11-23 234712](https://github.com/user-attachments/assets/50260361-659d-4802-bb6e-124e14e68fb5)

![Screenshot 2024-11-23 234754](https://github.com/user-attachments/assets/12e09bff-4d35-4d7d-b5d0-0ba37c527461)

![Screenshot 2024-11-23 234805](https://github.com/user-attachments/assets/3b99d6f5-7f6e-46ae-ac8a-249792fd6015)

![Screenshot 2024-11-23 234835](https://github.com/user-attachments/assets/328c630a-d091-4da3-9ff3-f6040dc96349)


![Screenshot 2024-11-23 234844](https://github.com/user-attachments/assets/cfa02d90-3d9f-4062-961a-aa6c96415447)

![Screenshot 2024-11-23 234856](https://github.com/user-attachments/assets/023a7c19-3685-41e3-ab2c-2af2d73ff437)

![Screenshot 2024-11-23 234935](https://github.com/user-attachments/assets/99d0ebdc-ca88-4187-b25a-cda30adf8fd0)

![Screenshot 2024-11-23 234948](https://github.com/user-attachments/assets/8471c958-bd41-4685-b74b-56fed7d5b5fe)

![Screenshot 2024-11-23 235129](https://github.com/user-attachments/assets/f253c46c-c3d2-424f-aaf1-e7636bdf8cda)

