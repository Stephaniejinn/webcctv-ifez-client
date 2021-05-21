import React, { useEffect, useState } from "react";
import { Layout } from "antd";
import moment from "moment";
import axios from "axios";
import { connect } from "react-redux";

import Breadcrumb from "../../atoms/breadcrumb/Breadcrumb";
import Sider from "../../organisms/sider";
import Header from "../../organisms/header";
import VideoContainer from "../../organisms/videoContainer/StreamingContainer";
import SearchInput from "../../atoms/cascaderBtn/CascaderBtn";

import "./style.less";

const RealtimeStreamingPage = (props) => {
	const { Content } = Layout;
	const { setLoggedIn, isMaster, baseURL } = props;

	const date = moment(new Date()).format("YYYY-MM-DD");
	const currentTime = moment(new Date()).format("HH:mm:ss");

	const [camNameAdd, setCamNameAdd] = useState({});
	const [isLoadingNameAdd, setLoadingNameAdd] = useState(true);
	const [currNameAdd, setCurrNameAdd] = useState({});
	const [isCurrLoading, setCurrLoading] = useState(true);

	// var addArr = [
	// 	"http://10.112.113.182:4000/api/streams/0072",
	// 	"http://10.112.113.182:4000/api/streams/0071",
	// 	"http://10.112.113.182:4000/api/streams/0070",
	// 	"http://10.112.113.182:4000/api/streams/0073",
	// 	"http://10.112.113.182:4000/api/streams/0074",
	// ];
	// var camName = [
	// 	"송도4교 진입 2",
	// 	"송도4교 진입 1",
	// 	"송도4교 진출",
	// 	"방범 381",
	// 	"방범 385",
	// ];
	var timer;
	const spinTimer = () => {
		setCurrLoading(true);
		if (timer) {
			clearTimeout(timer);
		}
		timer = setTimeout(() => {
			setCurrNameAdd(camNameAdd);
			setCurrLoading(false);
		}, 200);
		return () => clearTimeout(timer);
	};

	useEffect(() => {
		if (!isLoadingNameAdd) {
			spinTimer();
		}
	}, [isLoadingNameAdd]);

	return (
		<div className="realtime-streaming-page">
			<Layout style={{ minHeight: "100vh" }}>
				<Sider setLoggedIn={setLoggedIn} />
				<Layout className="site-layout">
					<Header setLoggedIn={setLoggedIn} isMaster={isMaster} />
					<Content style={{ margin: "0 16px" }}>
						<Breadcrumb pageHierarchy={["대시보드", "실시간 영상"]} />
						<div className="search-input">
							<SearchInput
								setCamNameAdd={setCamNameAdd}
								setLoadingNameAdd={setLoadingNameAdd}
								setLoggedIn={setLoggedIn}
							/>
						</div>
						<div className="video-container-4">
							{!isCurrLoading &&
								Object.getOwnPropertyNames(currNameAdd).map(function (key) {
									return (
										<VideoContainer
											camName={currNameAdd[key][0]}
											httpAddress={currNameAdd[key][1]}
											date={date}
											currentTime={currentTime}
											realtimeCamCode={key}
											setLoggedIn={setLoggedIn}
										/>
									);
								})}
							{/* {addArr[0] && (
								<VideoContainer
									camName={camName[0]}
									httpAddress={addArr[0]}
									date={date}
									currentTime={currentTime}
									realtimeCamCode="0001"
									setLoggedIn={setLoggedIn}
								/>
							)}
							{addArr[1] && (
								<VideoContainer
									camName={camName[1]}
									httpAddress={addArr[1]}
									date={date}
									currentTime={currentTime}
									realtimeCamCode="0001"
								/>
							)}
							{addArr[2] && (
								<VideoContainer
									camName={camName[2]}
									httpAddress={addArr[2]}
									date={date}
									currentTime={currentTime}
									realtimeCamCode="0001"
								/>
							)}
							{addArr[3] && (
								<VideoContainer
									camName={camName[3]}
									httpAddress={addArr[3]}
									date={date}
									currentTime={currentTime}
									realtimeCamCode="0001"
								/>
							)}
							{addArr[4] && (
								<VideoContainer
									camName={camName[4]}
									httpAddress={addArr[4]}
									date={date}
									currentTime={currentTime}
									realtimeCamCode="0001"
								/>
							)} */}
						</div>
					</Content>
				</Layout>
			</Layout>
		</div>
	);
};

const mapStateToProps = (state) => {
	return {
		baseURL: state.baseURL.baseURL,
	};
};

export default connect(mapStateToProps)(RealtimeStreamingPage);
