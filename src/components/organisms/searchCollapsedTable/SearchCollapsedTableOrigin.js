import React, { useEffect, useState } from "react";
import { Collapse, Typography, Divider, Spin, message, Select } from "antd";
import { EyeOutlined, DownloadOutlined } from "@ant-design/icons";
import { CSVLink } from "react-csv";
import moment from "moment";

import axios from "axios";
import { connect } from "react-redux";
import * as actions from "../../../redux/actions";

import FirstTable from "../../molecules/StatisticsTable/searchTable/SearchFirstTable";
import SecondTable from "../../molecules/StatisticsTable/searchTable/SearchSecondTable";
import SearchOverSpeedTable from "../../molecules/StatisticsTable/searchTable/SearchOverSpeed";

import "./style.less";

const SearchCollapsedTable = (props) => {
	const {
		startDate,
		endTime,
		camera,
		cameraCode,
		baseURL,
		trafficURL,
		setLoggedIn,
	} = props;
	const { Panel } = Collapse;
	const { Title, Text } = Typography;

	const [errorMsg, setMsg] = useState(false);

	const [firstData, setFirstData] = useState([]);
	const [secondData, setSecondData] = useState([]);
	const [overSpeedData, setOverSpeedData] = useState([]);

	const [firstDataTotal, setFirstDataTotal] = useState([]);
	const [secondDataTotal, setSecondDataTotal] = useState([]);
	const [overSpeedDataTotal, setOverSpeedDataTotal] = useState([]);

	const [isLoadingFirst, setLoadingFirst] = useState(true);
	const [isLoadingSecond, setLoadingSecond] = useState(true);
	const [isLoadingOverSpeed, setLoadingOverSpeed] = useState(true);

	const [isEmptyTrafficData, setEmptyTrafficData] = useState(false);
	const [isEmptyOverSpeedData, setEmptyOverSpeedData] = useState(false);

	var countFirstCol;
	var countSecondCol;
	var countOverSpeedCol;
	const firstDataHeaders = [
		{ label: "시간", key: "time" },
		{ label: "전체 통행량", key: "totalCount" },
		{ label: "전체 평균속도", key: "totalAvgSpeed" },
		{ label: "전체 PCU", key: "totalpcu" },
		{ label: "전체 과속대수", key: "totalOverSpeed" },
		{ label: "승용차 통행량", key: "carCount" },
		{ label: "승용차 평균속도", key: "totalAvgSpeed" },
		{ label: "승용차 PCU", key: "carpcu" },
		{ label: "승용차 비율", key: "carRatio" },
		{ label: "승용차 과속대수", key: "carOverSpeed" },
		{ label: "버스 통행량", key: "busCount" },
		{ label: "버스 평균속도", key: "busAvgSpeed" },
		{ label: "버스 PCU", key: "buspcu" },
		{ label: "버스 비율", key: "busRatio" },
		{ label: "버스 과속대수", key: "busOverSpeed" },
		{ label: "화물차 통행량", key: "truckCount" },
		{ label: "화물차 평균속도", key: "truckAvgSpeed" },
		{ label: "화물차 PCU", key: "truckpcu" },
		{ label: "화물차 비율", key: "truckRatio" },
		{ label: "화물차 과속대수", key: "truckOverSpeed" },
		{ label: "이륜차 통행량", key: "motorCount" },
		{ label: "이륜차 평균속도", key: "motorAvgSpeed" },
		{ label: "이륜차 PCU", key: "motorpcu" },
		{ label: "이륜차 비율", key: "motorRatio" },
		{ label: "이륜차 과속대수", key: "motorOverSpeed" },
	];

	const secondDataHeaders = [
		{ label: "시간", key: "time" },
		{ label: "전체 주야율", key: "totalDayNightRatio" },
		{ label: "PHF", key: "totalPHF" },
		{ label: "점두유율", key: "totalPeekHourCnt" },
		{ label: "집중율", key: "totalVehiclePeakHourConcentrationRatio" },
		{ label: "승용차 주야율", key: "carDayNightRatio" },
		{ label: "승용차 주야율", key: "busDayNightRatio" },
		{ label: "승용차 주야율", key: "truckDayNightRatio" },
		{ label: "승용차 주야율", key: "motorDayNightRatio" },
	];

	const overSpeedDataHeaders = [
		{ label: "시간", key: "time" },
		{ label: "차종", key: "vehicleType" },
		{ label: "차량번호", key: "licenseNumber" },
		{ label: "위반속도", key: "speed" },
		{ label: "차선", key: "laneNumber" },
		{ label: "이미지 링크", key: "imageLink" },
	];

	useEffect(() => {
		countFirstCol = 0;
		countSecondCol = 0;
		countOverSpeedCol = 0;
		setEmptyTrafficData(false);
		setEmptyOverSpeedData(false);
		setLoadingFirst(true);
		setLoadingSecond(true);
		setLoadingOverSpeed(true);
		axiosAsyncFS();
		axiosOverSpeedData();
	}, [cameraCode, startDate, endTime]);

	const axiosAsyncFS = () => {
		setFirstData([]);
		setSecondData([]);
		setFirstDataTotal([]);
		setSecondDataTotal([]);
		var firstDataParsedTotal = [];
		var secondDataParsedTotal = [];
		var firstDataParsed = [];
		var secondDataParsed = [];
		axios
			.get(
				`${baseURL}${trafficURL}/daily?camCode=${cameraCode}&startDate=${startDate}&endTime=${endTime} 23:59:59&axis=time&laneNumber=0`,
				{
					headers: {
						Authorization: `Bearer ${localStorage.getItem("token")}`,
						Cache: "No-cache",
					},
				}
			)
			.then((res) => {
				if (res.data.length !== 0) {
					setMsg(false);
					res.data.some((eachData, index) => {
						const {
							recordTime,
							totalVehicleVolume,
							totalVehicleAvgSpeed,
							totalVehiclePassengerCarUnit,
							totalVehicleSpdVolume,
							carVolume,
							carAvgSpeed,
							carPassengerCarUnit,
							carVehicleRatio,
							carSpdVolume,
							mBusVolume,
							mBusAvgSpeed,
							mBusPassengerCarUnit,
							mBusVehicleRatio,
							mBusSpdVolume,
							mTruckVolume,
							mTruckAvgSpeed,
							mTruckPassengerCarUnit,
							mTruckVehicleRatio,
							mTruckSpdVolume,
							motorVolume,
							motorAvgSpeed,
							motorPassengerCarUnit,
							motorVehicleRatio,
							motorSpdVolume,
							pedestrianVolume,
							jaywalkVolume,
							totalVehicleDayNightRatio,
							totalVehiclePeakHourFactor,
							totalVehiclePeakHourConcentrationRatio,
							totalVehiclePeakHourFlowRate,
							carDayNightRatio,
							mBusDayNightRatio,
							mTruckDayNightRatio,
							motorDayNightRatio,
							totalVehiclePeakHourTime,
						} = eachData;
						let firstDataTemp = {};
						let secondDataTemp = {};

						if (recordTime === "ALL") {
							secondDataTemp["key"] = index + 1;
							secondDataTemp["time"] = moment(totalVehiclePeakHourTime).format(
								"YYYY년 MM월 DD일"
							);
							secondDataTemp["totalDayNightRatio"] = totalVehicleDayNightRatio;
							secondDataTemp["totalPHF"] = totalVehiclePeakHourFactor;
							secondDataTemp["totalPeekHourCnt"] = totalVehiclePeakHourFlowRate;
							secondDataTemp[
								"totalVehiclePeakHourConcentrationRatio"
							] = totalVehiclePeakHourConcentrationRatio;

							secondDataTemp["carDayNightRatio"] = carDayNightRatio;
							secondDataTemp["busDayNightRatio"] = mBusDayNightRatio;
							secondDataTemp["truckDayNightRatio"] = mTruckDayNightRatio;
							secondDataTemp["motorDayNightRatio"] = motorDayNightRatio;
							secondDataParsedTotal.push(secondDataTemp);

							if (countSecondCol < 5) {
								countSecondCol += 1;
								secondDataParsed.push(secondDataTemp);
							}
							if (countSecondCol === 5) {
								setSecondData(secondDataParsed);
							}
						} else {
							firstDataTemp["key"] = index + 1;
							firstDataTemp["time"] = moment(recordTime).format(
								"YYYY년 MM월 DD일 HH:mm:ss"
							);

							firstDataTemp["totalCount"] = totalVehicleVolume;
							firstDataTemp["totalAvgSpeed"] = totalVehicleAvgSpeed;
							firstDataTemp["totalpcu"] = totalVehiclePassengerCarUnit;
							firstDataTemp["totalOverSpeed"] = totalVehicleSpdVolume;

							firstDataTemp["carCount"] = carVolume;
							firstDataTemp["carAvgSpeed"] = carAvgSpeed;
							firstDataTemp["carpcu"] = carPassengerCarUnit;
							firstDataTemp["carRatio"] = carVehicleRatio;
							firstDataTemp["carOverSpeed"] = carSpdVolume;

							firstDataTemp["busCount"] = mBusVolume;
							firstDataTemp["busAvgSpeed"] = mBusAvgSpeed;
							firstDataTemp["buspcu"] = mBusPassengerCarUnit;
							firstDataTemp["busRatio"] = mBusVehicleRatio;
							firstDataTemp["busOverSpeed"] = mBusSpdVolume;

							firstDataTemp["truckCount"] = mTruckVolume;
							firstDataTemp["truckAvgSpeed"] = mTruckAvgSpeed;
							firstDataTemp["truckpcu"] = mTruckPassengerCarUnit;
							firstDataTemp["truckRatio"] = mTruckVehicleRatio;
							firstDataTemp["truckOverSpeed"] = mTruckSpdVolume;

							firstDataTemp["motorCount"] = motorVolume;
							firstDataTemp["motorAvgSpeed"] = motorAvgSpeed;
							firstDataTemp["motorpcu"] = motorPassengerCarUnit;
							firstDataTemp["motorRatio"] = motorVehicleRatio;
							firstDataTemp["motorOverSpeed"] = motorSpdVolume;
							firstDataTemp["person"] = pedestrianVolume;
							firstDataTemp["jaywalk"] = jaywalkVolume;

							firstDataParsedTotal.push(firstDataTemp);
							if (countFirstCol < 5) {
								countFirstCol += 1;
								firstDataParsed.push(firstDataTemp);
							}
							if (countFirstCol === 5) {
								setFirstData(firstDataParsed);
							}
						}
					});
					if (secondData.length === 0) {
						setSecondData(secondDataParsed);
					}
					setFirstDataTotal(firstDataParsedTotal);
					setSecondDataTotal(secondDataParsedTotal);
					setLoadingFirst(false);
					setLoadingSecond(false);
				} else {
					setEmptyTrafficData(true);
					message.warning("해당 기간 데이터가 없습니다");
				}
			})
			.catch((err) => {
				console.log(err.response);
				setMsg(true);
				if (err.response.status === 400) {
					if (
						new Date(endTime).getTime() >=
						new Date(moment(new Date()).format("YYYY-MM-DD")).getTime()
					) {
						message.warning("해당 기간 데이터가 없습니다");
					} else {
						message.warning("최대 31일까지 조회 할 수 있습니다");
					}
				} else if (err.response.status === 404) {
					setEmptyTrafficData(true);
					message.warning("해당 기간 데이터가 없습니다");
				} else if (err.response.status === 401) {
					message.warning(
						"로그인 정보가 유효하지 않습니다. 다시 로그인해주세요"
					);
					setLoggedIn(false);
				}
			});
	};
	const axiosOverSpeedData = () => {
		setOverSpeedData([]);
		setOverSpeedDataTotal([]);
		var OverSpeedParsedTotal = [];
		var OverSpeedParsed = [];
		axios
			.get(
				`${baseURL}/violations/speeding/records?camCode=${cameraCode}&startDate=${startDate}&endTime=${endTime} 23:59:59&limit=0&offset=0`,
				{
					headers: {
						Authorization: `Bearer ${localStorage.getItem("token")}`,
						Cache: "No-cache",
					},
				}
			)
			.then((res) => {
				if (res.data.length !== 0) {
					setMsg(false);
					res.data.forEach((eachData, index) => {
						const {
							recordTime,
							vehicleType,
							licenseNumber,
							speed,
							imageLink,
							laneNumber,
						} = eachData;
						let overSpeedDataTemp = {};

						overSpeedDataTemp["key"] = index;
						overSpeedDataTemp["time"] = moment(recordTime).format(
							"YYYY년 MM월 DD일 HH:mm:ss"
						);

						overSpeedDataTemp["vehicleType"] = vehicleType;
						overSpeedDataTemp["licenseNumber"] = licenseNumber;
						overSpeedDataTemp["speed"] = speed;
						overSpeedDataTemp["laneNumber"] = `${laneNumber} 차선`;

						overSpeedDataTemp["imageLink"] = imageLink;
						OverSpeedParsedTotal.push(overSpeedDataTemp);
						if (countOverSpeedCol < 5) {
							countOverSpeedCol += 1;
							OverSpeedParsed.push(overSpeedDataTemp);
							setOverSpeedData(OverSpeedParsed);
						}
					});
					setOverSpeedDataTotal(OverSpeedParsedTotal);
					setLoadingOverSpeed(false);
				} else {
					setMsg(true);
					setEmptyOverSpeedData(true);
					message.warning("해당 기간 과속 데이터가 없습니다");
				}
			})
			.catch((err) => {
				console.log(err.response);
				setMsg(true);
				setEmptyOverSpeedData(true);
				if (
					!new Date(endTime).getTime() >=
					new Date(moment(new Date()).format("YYYY-MM-DD")).getTime()
				) {
					message.warning("해당 기간 과속 데이터가 없습니다");
				} else if (err.response.status === 401) {
					setLoggedIn(false);
				}
			});
	};

	const collapseHeaderFirst = (
		<div className="table-collapse-header">
			1차 데이터
			<Divider type="vertical" />
			{moment(startDate).format("LL")} ~ {moment(endTime).format("LL")}
			<Divider type="vertical" />
			전체 및 특정 차선 데이터 <Divider type="vertical" />
			15분 단위 <Divider type="vertical" />
			{/* 차선
			<Select size="small" /> */}
		</div>
	);

	const collapseHeaderSecond = (
		<div className="table-collapse-header">
			2차 데이터
			<Divider type="vertical" />
			{moment(startDate).format("LL")} ~ {moment(endTime).format("LL")}
			<Divider type="vertical" />
			전체 데이터 <Divider type="vertical" />
			하루 단위 <Divider type="vertical" />
		</div>
	);
	const collapseHeaderOverSpeed = (
		<div className="table-collapse-header">
			과속 데이터
			<Divider type="vertical" />
			{moment(startDate).format("LL")} ~ {moment(endTime).format("LL")}
			<Divider type="vertical" />
			전체 데이터 <Divider type="vertical" />
		</div>
	);
	const genExtra = (tableIdx) => (
		<div
			onClick={(event) => {
				// If you don't want click extra trigger collapse, you can prevent this:
				event.stopPropagation();
			}}
		>
			{tableIdx === "FIRST" ? (
				<CSVLink
					data={firstDataTotal}
					filename={`1차 데이터_${moment(startDate).format("l")}-${moment(
						endTime
					).format("l")}.csv`}
					headers={firstDataHeaders}
				>
					<DownloadOutlined />
					다운로드
				</CSVLink>
			) : tableIdx === "SECOND" ? (
				<CSVLink
					data={secondDataTotal}
					filename={`2차 데이터_${moment(startDate).format("l")}-${moment(
						endTime
					).format("l")}.csv`}
					headers={secondDataHeaders}
				>
					<DownloadOutlined />
					다운로드
				</CSVLink>
			) : (
				<CSVLink
					data={overSpeedDataTotal}
					filename={`과속 데이터_${moment(startDate).format("l")}-${moment(
						endTime
					).format("l")}.csv`}
					headers={overSpeedDataHeaders}
				>
					<DownloadOutlined />
					다운로드
				</CSVLink>
			)}
		</div>
	);

	return (
		<>
			{errorMsg ? null : isEmptyTrafficData ? null : (
				<div className="table-collapse">
					<Title level={5} style={{ marginTop: 10 }}>
						{camera} 데이터 조회 결과 <Select size="small" />
					</Title>
					<Divider />
					{isLoadingSecond ? (
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
						<>
							<Collapse
								accordion
								expandIconPosition="right"
								expandIcon={({ isActive }) => (
									<div style={{ fontSize: 14, marginTop: -2 }}>
										<EyeOutlined />
										미리보기
									</div>
								)}
							>
								<Panel
									header={collapseHeaderFirst}
									key="1"
									extra={genExtra("FIRST")}
								>
									데이터 형식 미리보기 (5줄까지)
									{isLoadingFirst ? (
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
										<>
											<FirstTable firstData={firstData} />
										</>
									)}
								</Panel>
								<Panel
									header={collapseHeaderSecond}
									key="2"
									extra={genExtra("SECOND")}
								>
									데이터 형식 미리보기 (5줄까지)
									{isLoadingSecond ? (
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
										<SecondTable secondData={secondData} />
									)}
								</Panel>
								<Panel
									header={collapseHeaderOverSpeed}
									key="3"
									extra={genExtra("OVERSPEED")}
								>
									{isEmptyOverSpeedData ? (
										<Text strong type="danger">
											해당 기간 과속 데이터가 없습니다
										</Text>
									) : isLoadingOverSpeed ? (
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
										<>
											데이터 형식 미리보기 (5줄까지)
											<SearchOverSpeedTable
												overSpeedData={overSpeedData}
												isEmptyOverSpeedData={isEmptyOverSpeedData}
											/>
										</>
									)}
								</Panel>
							</Collapse>
						</>
					)}
				</div>
			)}
		</>
	);
};

const mapStateToProps = (state) => {
	return {
		cameraCode: state.locationCode.cameraCode,
		camera: state.location.camera,
		baseURL: state.baseURL.baseURL,
		trafficURL: state.baseURL.trafficURL,
	};
};
const mapDispatchToProps = (dispatch) => {
	return {
		getLocationCodeInfo: () => {
			dispatch(actions.getLocationCode());
		},
		getBaseURL: () => {
			dispatch(actions.getURL());
		},
	};
};
export default connect(
	mapStateToProps,
	mapDispatchToProps
)(SearchCollapsedTable);
