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
	const [address, setAddress] = useState([]);
	const date = moment(new Date()).format("YYYY-MM-DD");
	const currentTime = moment(new Date()).format("HH:mm:ss");
	var addArr = [];

	useEffect(() => {
		axios
			.get(`${baseURL}/locations/ICN/28110/2008001/001/cameras`, {
				headers: {
					Authorization: `Bearer ${localStorage.getItem("token")}`,
					Cache: "No-cache",
				},
			})
			.then((res) => {
				if (res.data.length !== 0) {
					res.data.forEach((address) => {
						addArr.push(address.httpStreamAddr);
					});
				}
				setAddress(addArr);
			})
			.catch((err) => {
				console.log(err.response);
			});
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
									camName="수인사거리-1 [하행]"
									// httpAddress="https://globalbridge.synology.me:4000/m3u8VideoStream.m3u8"
									httpAddress={address[0]}
									date={date}
									currentTime={currentTime}
									realtimeCamCode="0001"
									setLoggedIn={setLoggedIn}
								/>
							)}
							{address[1] && (
								<VideoContainer
									camName="수인사거리-2 [하행]"
									httpAddress={address[1]}
									date={date}
									currentTime={currentTime}
									realtimeCamCode="0001"
								/>
							)}
							{address[2] && (
								<VideoContainer
									camName="수인사거리-3 [하행]"
									httpAddress={address[2]}
									date={date}
									currentTime={currentTime}
									realtimeCamCode="0001"
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
