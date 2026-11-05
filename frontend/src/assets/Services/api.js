const BASE_URL = 'http://localhost:8000';

const mockData = {
	id: "req-" + Math.floor(Math.random() * 10000),
	timestamp: new Date().toISOString(),
	results: {
		VirusTotal: { status: "success", malicious_votes: 0, message: "گزارش مخربی یافت نشد" },
		AbuseIPDB: { status: "error", message: "پایان زمان انتظار (Timeout)" }
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
