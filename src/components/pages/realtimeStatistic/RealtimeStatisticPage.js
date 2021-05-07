import React, { useEffect, useState } from "react";
import { Layout, message } from "antd";
import moment from "moment";
import axios from "axios";
import { connect } from "react-redux";

import Sider from "../../organisms/sider";
import Header from "../../organisms/header";
import RealtimeStatUpper from "../../organisms/realtimeStatUpper/RealtimeStatUpper";
import StatContainer from "../../organisms/videoContainer/StatContainer";
import GeneralVisualization from "../../organisms/generalVisualization/GeneralVisualization";
import TimeTableCard from "../../molecules/tableCard/TimeTableCard";

import "./style.less";

const RealtimeStatisticPage = (props) => {
	const {
		camAddress,
		camera,
		cameraCode,
		baseURL,
		trafficURL,
		setLoggedIn,
		isMaster,
		associateIds,
	} = props;
	const { Content } = Layout;

	const [trafficTotalData, setTrafficTotalData] = useState([]);
	const [isEmptyData, setEmptyData] = useState(false);
	const [currTime, setCurrTime] = useState(
		moment(new Date()).subtract(1, "second")
	);
	const [refresh, setRefresh] = useState(false);
	const [cameraAddress, setCameraAddress] = useState("");
	// const [dataLastTime, setDataLastTime] = useState("");

	const date = moment(new Date()).format("YYYY-MM-DD");
	var currTimeStr = currTime.format("HH:mm:ss");

	const camCodes =
		associateIds.length !== 0
			? `camCodes=[${[...associateIds, cameraCode]}]`
			: `camCode=${cameraCode}`;

	useEffect(() => {
		if (cameraCode.length !== 0) {
			setEmptyData(false);
			setTrafficTotalData([]);
			axios
				.get(`${baseURL}/locations/ICN/28110/2008001/001/cameras`, {
					headers: {
						Authorization: `Bearer ${localStorage.getItem("token")}`,
						Cache: "No-cache",
					},
				})
				.then((res) => {
					if (res.data.length !== 0) {
						setCameraAddress(res.data[0].httpStreamAddr);
						axiosAsync();
					}
				})
				.catch((err) => {
					console.log(err.response);
					if (err.response.status === 401) {
						message.warning(
							"로그인 정보가 유효하지 않습니다. 다시 로그인해주세요"
						);
						setLoggedIn(false);
					}
				});
		} else {
			setCameraAddress(camAddress);
			axiosAsync();
		}
	}, [cameraCode, currTimeStr]);

	useEffect(() => {
		if (refresh) {
			setEmptyData(false);
			setTrafficTotalData([]);
			axiosAsync();
		}
	}, [refresh]);

	const axiosAsync = () => {
		axios
			.get(
				`${baseURL}${trafficURL}/daily?${camCodes}&startDate=${date}&endTime=${date} ${currTimeStr}&axis=time&laneNumber=0`,
				{
					headers: {
						Authorization: `Bearer ${localStorage.getItem("token")}`,
						Cache: "No-cache",
					},
				}
			)
			.then((res) => {
				if (res.data.length !== 0) {
					setTrafficTotalData(res.data);
					setEmptyData(false);
				} else {
					setEmptyData(true);
				}
				if (refresh) {
					message.success("새로고침 성공");
				}
				setRefresh(false);
			})
			.catch((err) => {
				console.log(err.response);
				setEmptyData(true);
				if (err.response.status === 401) {
					setLoggedIn(false);
				}
			});
	};
	return (
		<div className="realtime-statistic-page">
			<Layout style={{ minHeight: "100vh" }}>
				<Sider />
				<Layout className="site-layout">
					<Header setLoggedIn={setLoggedIn} isMaster={isMaster} />

					<Content style={{ margin: "0 16px" }}>
						<RealtimeStatUpper
							currTime={currTime}
							setCurrTime={setCurrTime}
							setRefresh={setRefresh}
						/>
						<div className="realtime-statistic-video-and-graph">
							<StatContainer camName={camera} httpAddress={cameraAddress} />
							<div className="realtime-statistic-graph">
								<GeneralVisualization
									page="REALSTATISTIC"
									period="DAY"
									startDate={date}
									endTime={date}
									currentTime={currTimeStr}
									refresh={refresh}
									setLoggedIn={setLoggedIn}
								/>
							</div>
						</div>
						<TimeTableCard
							period="DAY"
							page="REALSTATISTIC"
							tableKey="first"
							currentLaneNum="0"
							trafficTotalData={trafficTotalData}
							startDate={date}
							endTime={date}
							currentTime={currTime}
							isEmptyData={isEmptyData}
						/>
					</Content>
				</Layout>
			</Layout>
		</div>
	);
};

const mapStateToProps = (state) => {
	return {
		camAddress: state.locationCode.camAddress,
		camera: state.location.camera,
		cameraCode: state.locationCode.cameraCode,
		baseURL: state.baseURL.baseURL,
		trafficURL: state.baseURL.trafficURL,
		associateIds: state.locationCode.associateIds,
	};
};

export default connect(mapStateToProps)(RealtimeStatisticPage);
