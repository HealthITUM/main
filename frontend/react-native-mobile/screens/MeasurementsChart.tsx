import { View, Text, StyleSheet, Dimensions } from "react-native";
import { LineChart } from "react-native-gifted-charts";
import type { IMeasurementDTO } from "@project/shared";
//uses react native gifted charts
//colors for each data type
const palette = {
  moisture: "#378ADD",
  soil: "#1D9E75",
  temp: "#D85A30",
};
//gets device width
const screenWidth = Dimensions.get("window").width;
//chart component for measurements
export default function MeasurementsChart({
  measurements,
}: {
  measurements: IMeasurementDTO[];
}) {
  //if there are no measurements, show message
  if (!measurements.length) {
    return <Text style={styles.empty}>No measurements available.</Text>;
  }
  //converts measurements into chart points with labels
  const moistureData = measurements.map((m) => ({
    value: m.values.moisture ?? 0,
    label: new Date(m.timestamp).toLocaleString("sl-SI", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    }),
  }));
  //no labels for soil and temp, as they share the same y-axis
  const soilData = measurements.map((m) => ({
    value: m.values.soil ?? 0,
  }));

  const tempData = measurements.map((m) => ({
    value: m.values.temp ?? 0,
  }));

  return (
    <View>
      <View style={styles.legend}>
        {Object.entries(palette).map(([key, color]) => (
          <View key={key} style={styles.legendItem}>
            <View
              style={[
                styles.legendDot,
                { borderColor: color },
              ]}
            />
            <Text style={styles.legendText}>{key}</Text>
          </View>
        ))}
      </View>

      <LineChart
        width={screenWidth - 140}
        height={300}
        curved
        isAnimated

        spacing={80}
        initialSpacing={10}
        endSpacing={10}

        data={moistureData}
        data2={soilData}
        data3={tempData}

        color1={palette.moisture}
        color2={palette.soil}
        color3={palette.temp}

        thickness1={3}
        thickness2={3}
        thickness3={3}

        dataPointsRadius1={6}
        dataPointsRadius2={6}
        dataPointsRadius3={6}

        dataPointsColor1={palette.moisture}
        dataPointsColor2={palette.soil}
        dataPointsColor3={palette.temp}

        areaChart
        startFillColor1={palette.moisture}
        endFillColor1={palette.moisture}
        startOpacity={0.15}
        endOpacity={0}

        yAxisColor="rgba(255,255,255,0.2)"
        xAxisColor="rgba(255,255,255,0.2)"
        rulesColor="rgba(255,255,255,0.08)"

        yAxisTextStyle={{
          color: "#fff",
          fontSize: 12,
        }}

        xAxisLabelTextStyle={{
          color: "#fff",
          fontSize: 10,
        }}

        yAxisLabelSuffix="%"

        noOfSections={5}

        maxValue={80}
        secondaryYAxis={{
          maxValue: 30,
          noOfSections: 5,
          yAxisLabelTexts: ["0", "6", "12", "18", "24", "30"],
        }}

        showVerticalLines
        verticalLinesColor="rgba(255,255,255,0.08)"
      />

      <View style={styles.axisLabels}>
        <Text
          style={[
            styles.axisLabel,
            { color: palette.moisture },
          ]}
        >
          moisture (%)
        </Text>

        <Text
          style={[
            styles.axisLabel,
            { color: palette.temp },
          ]}
        >
          soil / temp
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  empty: {
    color: "#fff",
  },

  legend: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 30,
    marginBottom: 20,
  },

  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  legendDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 3,
  },

  legendText: {
    color: "#fff",
    fontSize: 15,
  },

  axisLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },

  axisLabel: {
    fontSize: 12,
  },
});