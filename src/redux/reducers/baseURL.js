const initialState = {
	trafficURL: "/statistics/road-traffic",

	// baseURL: "http://globalbridge.iptime.org:3002/api",
	// overSpeedVideoURL: "https://globalbridge.synology.me:4000/api/streams",

	// overSpeedVideoURL: "http://10.112.113.182:4000/api/streams",
	// baseURL: "http://10.112.113.184:3002/api",

	// baseURL: "http://192.168.1.100:3002/api",
	// overSpeedVideoURL: "http://192.168.1.100:4000/api/streams",

	baseURL: "http://100.100.100.130:3000/api", // matching with API-server ip
	overSpeedVideoURL: "http://100.100.100.120:4000/api/streams", // matching with NAS ip
};
export default function URL(state = initialState, action) {
	switch (action.type) {
		case "BASE_URL":
			return action.payload;
		default:
			return state;
	}
}
