// src/services/api.js

const BASE_URL = 'http://localhost:8000';

const mockData = {
  id: "req-" + Math.floor(Math.random() * 10000),
  timestamp: new Date().toISOString(),
  results: {
    VirusTotal: { 
      status: "no_report", 
      reports_count: 0, 
      message: "در دیتابیس شناسایی نشد" 
    },
    AbuseIPDB: { 
      status: "success", 
      reports_count: 14, 
      message: "سابقه اسکن پورت و رفتار مخرب" 
    }
  }
};

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const checkNewIp = async (ip) => {
    await delay(1200);
    return { ip, ...mockData };
};

export const getHistory = async (searchIp = '') => {
    await delay(800);
    return [
        { ip: "8.8.8.8", ...mockData },
        { ip: searchIp || "192.168.1.10", ...mockData }
    ];
};

export const getDetails = async (id) => {
    await delay(500);
    return { ip: "8.8.8.8", ...mockData, id };
};