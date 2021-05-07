const initialState = {
	cityCode: "",
	districtCode: "",
	roadCode: "",
	spotCode: "",
	cameraCode: "",
	camAddress: "",
	camLanes: 0,
	ocrFlag: true,
	associateIds: "",
	upboundFlag: true,
};
export default function locationCode(state = initialState, action) {
	switch (action.type) {
		case "LOCATION_CODE_INFO":
			return action.payload;

		case "LOCATION_CODE_SET":
			const {
				cityCode,
				districtCode,
				roadCode,
				spotCode,
				cameraCode,
				camAddress,
				camLanes,
				ocrFlag,
				associateIds,
				upboundFlag,
			} = action.payload;

			return {
				cityCode,
				districtCode,
				roadCode,
				spotCode,
				cameraCode,
				camAddress,
				camLanes,
				ocrFlag,
				associateIds,
				upboundFlag,
			};
		default:
			return state;
	}
}
