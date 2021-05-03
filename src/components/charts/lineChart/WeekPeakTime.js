import React, { useEffect, useState } from "react";
import { Spin } from "antd";
import { Line } from "@ant-design/charts";
import moment from "moment";

const WeekPeakTime = (props) => {
	const { activeVisualKey, trafficTotalData } = props;
	const [Data, setData] = useState([]);
	const [isLoading, setLoading] = useState(true);
	const WeekKey = {
		SUN: "일요일",
		MON: "월요일",
		TUE: "화요일",
		WED: "수요일",
		THU: "목요일",
		FRI: "금요일",
		SAT: "토요일",
		ALL: "전체",
		DAY: "평일전체",
		END: "주말전체",
	};
	useEffect(() => {
		if (activeVisualKey === "7") {
			setLoading(true);
			setData([]);

			parseTotalData();
		}
	}, [trafficTotalData, activeVisualKey]);

	const parseTotalData = () => {
		var TotalData = [];

		trafficTotalData.slice(3).forEach((TrafficData) => {
			const { weekOption, totalVehiclePeak15MinuteTime } = TrafficData;
			let temp = {};
			temp["date"] = WeekKey[weekOption];
			temp["value"] = new Date(totalVehiclePeak15MinuteTime).getHours();
			temp["test"] = new Date(totalVehiclePeak15MinuteTime).getMinutes();
			TotalData.push(temp);
		});
		setData(TotalData);
		setLoading(false);
	};

	var config = {
		data: Data,
		xField: "date",
		yField: "value",
		yAxis: false,

		label: {
			formatter: function formatter(v) {
				let timeStr = v["value"] + ":" + v["test"];
				return ""
					.concat(timeStr)
					.replace(/\d{1,3}(?=(\d{3})+$)/g, function (s) {
						return "".concat(s, ",");
					});
			},
		},
		point: {
			size: 5,
			shape: "diamond",
			style: {
				fill: "white",
				stroke: "#5B8FF9",
				lineWidth: 2,
			},
		},
		tooltip: false,

		state: {
			active: {
				style: {
					shadowColor: "yellow",
					shadowBlur: 4,
					stroke: "transparent",
					fill: "red",
				},
			},
		},
		theme: {
			geometries: {
				point: {
					diamond: {
						active: {
							style: {
								shadowColor: "#FCEBB9",
								shadowBlur: 2,
								stroke: "#F6BD16",
							},
						},
					},
				},
			},
		},
		interactions: [{ type: "marker-active" }],
	};
	return (
		<>
			{isLoading ? (
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
				<Line {...config} />
			)}
		</>
	);
};

export default WeekPeakTime;
