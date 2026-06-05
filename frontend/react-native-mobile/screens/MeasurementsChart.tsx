import { View, Text, StyleSheet, Dimensions } from "react-native";
import { LineChart } from "react-native-gifted-charts";
import type { IMeasurementDTO } from "@project/shared";
//uses react native gifted charts
//colors for each data type
const palette = {
  SoilMoisture: "#378ADD",
  Light: "#1D9E75",
  Temperature: "#D85A30",
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
    value: m.values.SoilMoisture ?? 0,
    label: new Date(m.timestamp).toLocaleString("sl-SI", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    }),
  }));
  //no labels for soil and temp, as they share the same y-axis
  const lightData = measurements.map((m) => ({
    value: m.values.Light ?? 0,
  }));

  const tempData = measurements.map((m) => ({
    value: m.values.Temperature ?? 0,
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
        data2={lightData}
        data3={tempData}

        color1={palette.SoilMoisture}
        color2={palette.Light}
        color3={palette.Temperature}

        thickness1={3}
        thickness2={3}
        thickness3={3}

        dataPointsRadius1={6}
        dataPointsRadius2={6}
        dataPointsRadius3={6}

        dataPointsColor1={palette.SoilMoisture}
        dataPointsColor2={palette.Light}
        dataPointsColor3={palette.Temperature}

        areaChart
        startFillColor1={palette.SoilMoisture}
        endFillColor1={palette.SoilMoisture}
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

        yAxisLabelSuffix=""

        noOfSections={5}

        maxValue={80}
        showVerticalLines
        verticalLinesColor="rgba(255,255,255,0.08)"
      />
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