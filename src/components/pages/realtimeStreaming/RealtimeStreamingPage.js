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
	// const [address, setAddress] = useState(new Set());
	// const [cameraName, setCameraName] = useState(new Set());
	const [address, setAddress] = useState([]);
	const [cameraName, setCameraName] = useState([]);

	const date = moment(new Date()).format("YYYY-MM-DD");
	const currentTime = moment(new Date()).format("HH:mm:ss");
	// var addArr = [];
	// var camName = [];
	var addArr = [
		"ICN/28185/2348176/039/070",
		"ICN/28185/2348176/039/071",
		"ICN/28185/2348176/039/072",
		"ICN/28185/3152044/040/073",
		"ICN/28185/3152045/041/074",
	];
	var camName = [
		"송도4교 진출",
		"송도4교 진입 1",
		"송도4교 진입 2",
		"방범 385",
		"방범 381",
	];
	useEffect(() => {
		// axios
		// 	.get(`${baseURL}/locations/ICN/28110/2008001/001/cameras`, {
		// 		headers: {
		// 			Authorization: `Bearer ${localStorage.getItem("token")}`,
		// 			Cache: "No-cache",
		// 		},
		// 	})
		// 	.then((res) => {
		// 		if (res.data.length !== 0) {
		// 			console.log(res.data);
		// 			res.data.forEach((data) => {
		// 				addArr.push(data.httpStreamAddr);
		// 				camName.push(data.camName);
		// 			});
		// 		}
		// 		setAddress(addArr);
		// 		setCameraName(camName);
		// 	})
		// 	.catch((err) => {
		// 		console.log(err.response);
		// 	});
		setAddress(addArr);
		setCameraName(camName);
	}, []);

	return (
		<div className="realtime-streaming-page">
			<Layout style={{ minHeight: "100vh" }}>
				<Sider setLoggedIn={setLoggedIn} />
				<Layout className="site-layout">
					<Header setLoggedIn={setLoggedIn} isMaster={isMaster} />
					<Content style={{ margin: "0 16px" }}>
						<Breadcrumb pageHierarchy={["대시보드", "실시간 영상"]} />
						<div className="search-input">
							<SearchInput />
						</div>
						<div className="video-container-4">
							{address[0] && (
								<VideoContainer
									camName={cameraName[0]}
									httpAddress={address[0]}
								/>
							)}
							{address[1] && (
								<VideoContainer
									camName={cameraName[1]}
									httpAddress={address[1]}
								/>
							)}
							{address[2] && (
								<VideoContainer
									camName={cameraName[2]}
									httpAddress={address[2]}
								/>
							)}
							{address[3] && (
								<VideoContainer
									camName={cameraName[3]}
									httpAddress={address[3]}
								/>
							)}
							{address[4] && (
								<VideoContainer
									camName={cameraName[4]}
									httpAddress={address[4]}
								/>
							)}
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
