import React, { useEffect, useState } from "react";
import { Spin, message } from "antd";
import moment from "moment";
import axios from "axios";
import { connect } from "react-redux";

import VisualizationCard from "../../molecules/genVisualizationCard/GenVisualizationCard";
import VehicleRatio from "../../charts/doughnutChart/VehicleRatio";
import OverSpeedBar from "../../charts/barChart/GenOverSpeed";

import "./style.less";

const StreamingGeneralVisualization = (props) => {
	const {
		startDate,
		endTime,
		currentTime,
		realtimeCamCode,
		baseURL,
		trafficURL,
		setLoggedIn,
		associateIds,
	} = props;

	const [isLoadingTraffic, setLoadingTraffic] = useState(true);
	const [trafficData, setTrafficData] = useState([]);
	const [isEmptyData, setEmptyData] = useState(false);
	const [curStartTime, setCurStartTime] = useState("");
	const [curEndTime, setCurEndTime] = useState("");

	const camCodes =
		associateIds.length !== 0
			? `camCodes=[${[...associateIds, realtimeCamCode]}]`
			: `camCode=${realtimeCamCode}`;

	useEffect(() => {
		setLoadingTraffic(true);
		setEmptyData(false);
		setTrafficData([]);
		getTrafficData();
	}, [realtimeCamCode, startDate, endTime, currentTime]);

	const getTrafficData = () => {
		axios
			.get(
				`${baseURL}${trafficURL}/daily?${camCodes}&startDate=${startDate}&endTime=${endTime} ${currentTime}&axis=time&laneNumber=0`,
				{
					headers: {
						Authorization: `Bearer ${localStorage.getItem("token")}`,
						Cache: "No-cache",
					},
				}
			)
			.then((res) => {
				if (res.data.length !== 0) {
					console.log("data", res.data);
					var tempStartTime = moment(
						res.data[res.data.length - 1].recordTime
					).format("HH:mm");
					var tempEndTime = moment(
						new Date(res.data[res.data.length - 1].recordTime)
					)
						.add(15, "m")
						.format("HH:mm");

					setTrafficData(res.data);
					setCurStartTime(tempStartTime);
					setCurEndTime(tempEndTime);
					setLoadingTraffic(false);
					setEmptyData(false);
				} else {
					setLoadingTraffic(true);
					setEmptyData(true);
				}
			})
			.catch((err) => {
				console.log(err.response);
				if (err.response.status === 500) {
					message.error(
						"???????????? ?????? ?????? ???????????? ????????? ???????????? ????????? ??? ????????????"
					);
				} else if (err.response.status === 401) {
					message.warning(
						"????????? ????????? ???????????? ????????????. ?????? ?????????????????????"
					);
					setLoggedIn(false);
				}
				setLoadingTraffic(true);
				setEmptyData(true);
			});
	};

	return (
		<div className="general-graph-layout">
			{!isEmptyData ? (
				isLoadingTraffic ? (
					<div
						style={{
							marginTop: 20,
							marginBottom: 20,
							textAlign: "center",
							paddingTop: 30,
							paddingBottom: 30,
						}}
					>
						<Spin size="large" />
					</div>
				) : (
					<div className="general-graph-card">
						<VisualizationCard
							title={`????????? ????????? | ${curStartTime} ~ ${curEndTime}`}
							chart={
								<VehicleRatio trafficData={trafficData} page="STREAMING" />
							}
						/>
						<VisualizationCard
							title={`????????? ???????????? | ${curStartTime} ~ ${curEndTime}`}
							chart={
								<OverSpeedBar trafficData={trafficData} page="STREAMING" />
							}
						/>
					</div>
				)
			) : (
				<div className="general-graph-card">
					<VisualizationCard title="????????? ?????????" />
					<VisualizationCard title="????????? ????????????" />
				</div>
			)}
		</div>
	);
};
const mapStateToProps = (state) => {
	return {
		cameraCode: state.locationCode.cameraCode,
		baseURL: state.baseURL.baseURL,
		trafficURL: state.baseURL.trafficURL,
		associateIds: state.locationCode.associateIds,
	};
};

export default connect(mapStateToProps)(StreamingGeneralVisualization);
