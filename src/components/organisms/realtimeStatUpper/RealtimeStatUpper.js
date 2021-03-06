import React from "react";
import { Typography, Button, message } from "antd";
import moment from "moment";

import { connect } from "react-redux";
import * as actions from "../../../redux/actions";

import Breadcrumb from "../../atoms/breadcrumb/Breadcrumb";
import SearchDrawer from "../../molecules/searchDrawer/SearchDrawer";

const RealtimeStatUpper = (props) => {
	const { Title, Text } = Typography;
	const {
		city,
		district,
		road,
		spot,
		camera,
		associateIds,
		currTime,
		setCurrTime,
		setRefresh,
		upboundFlag,
		setLoggedIn,
	} = props;
	var locationHierarchy = [city, district, road, spot];

	const handleRefresh = () => {
		const currNewDate = new Date();
		if (
			currTime.hour() === currNewDate.getHours() &&
			Math.floor(currTime.minute() / 15) * 15 ===
				Math.floor(moment(new Date()).minute() / 15) * 15
		) {
			message.success("새로운 데이터가 없습니다");
		} else {
			setCurrTime(moment(new Date()));
			setRefresh(true);
		}
	};
	return (
		<>
			<Breadcrumb
				pageHierarchy={["대시보드", "실시간 데이터"]}
				locationHierarchy={locationHierarchy}
			/>
			<div className="page-title-and-search-input">
				<div className="page-title-and-search-input-refresh-button">
					<Title level={3} style={{ minWidth: 450, marginBottom: 0 }}>
						{camera} 카메라 | 실시간 통계
					</Title>
					<Button onClick={handleRefresh} style={{ marginTop: 0 }}>
						새로고침
					</Button>
				</div>
				<div className="search-input-drawer">
					<SearchDrawer setLoggedIn={setLoggedIn} />
				</div>
			</div>
			{associateIds.length !== 0 && (
				<Text type="secondary" strong style={{ marginTop: 5 }}>
					{spot}
					{upboundFlag ? " 진출" : " 진입"} 통합 데이터
				</Text>
			)}
		</>
	);
};

const mapStateToProps = (state) => {
	return {
		city: state.location.city,
		district: state.location.district,
		road: state.location.road,
		spot: state.location.spot,
		camera: state.location.camera,
		associateIds: state.locationCode.associateIds,
		upboundFlag: state.locationCode.upboundFlag,
	};
};
const mapDispatchToProps = (dispatch) => {
	return {
		getLocationInfo: () => {
			dispatch(actions.getLocation());
		},
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(RealtimeStatUpper);
