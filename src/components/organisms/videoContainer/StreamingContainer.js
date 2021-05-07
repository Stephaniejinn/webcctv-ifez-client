import React from "react";
import { Card, Typography } from "antd";

// import axios from "axios";
// import { connect } from "react-redux";
// import * as actions from "../../../actions";

import Video from "../../molecules/video/Video";
import StreamingGenVisualization from "../generalVisualization/StreamingGenVisualization";

import "./style.less";

const { Title } = Typography;

const VideoContainer = ({ camName, httpAddress }) => {
	return (
		<div className="video-container">
			<Title level={5}>{camName}</Title>
			<div className="video-container-streamming">
				<Card>{httpAddress && <Video source={httpAddress} />}</Card>
			</div>
		</div>
	);
};

export default VideoContainer;
