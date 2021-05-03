const initialState = {
	// baseURL: "http://192.168.1.100:3002/api",
	baseURL: "http://globalbridge.iptime.org:3002/api",
	trafficURL: "/statistics/road-traffic",
	overSpeedVideoURL: "https://globalbridge.synology.me:4000/api/streams",
};
export default function URL(state = initialState, action) {
	switch (action.type) {
		case "BASE_URL":
			return action.payload;
		default:
			return state;
	}
}
