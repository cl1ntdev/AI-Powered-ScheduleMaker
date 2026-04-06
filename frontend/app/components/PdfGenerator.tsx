import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: { padding: 30, backgroundColor: "#f8fafc", fontFamily: "Helvetica" },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#0f172a",
    marginBottom: 5,
  },
  subHeader: { fontSize: 12, color: "#64748b", marginBottom: 20 },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  dayCard: {
    width: "48%", // Creates a 2-column layout on the PDF
    marginBottom: 20,
    backgroundColor: "#ffffff",
    border: "1px solid #e2e8f0",
    borderRadius: 8,
  },
  dayHeader: {
    backgroundColor: "#0f172a",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderTopLeftRadius: 7,
    borderTopRightRadius: 7,
  },
  dayHeaderText: {
    color: "#ffffff",
    fontSize: 10,
    textTransform: "uppercase",
    fontWeight: "bold",
    letterSpacing: 1,
  },
  taskRow: {
    flexDirection: "row",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
    alignItems: "center",
  },
  timeCol: { width: 45, alignItems: "center" },
  timeText: { fontSize: 11, fontWeight: "bold", color: "#0f172a" },
  meridiemText: {
    fontSize: 8,
    color: "#94a3b8",
    textTransform: "uppercase",
    marginTop: 2,
  },
  titleCol: {
    flex: 1,
    paddingLeft: 10,
    borderLeftWidth: 2,
    borderLeftColor: "#e0e7ff",
  },
  titleText: { fontSize: 10, color: "#334155", lineHeight: 1.4 },
});

interface pdfConverterProps {
  schedule: any;
}


const PdfGenerator = ({ schedule }: pdfConverterProps) => {
  const days = Object.keys(schedule);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.header}>Your Weekly Plan</Text>
        <Text style={styles.subHeader}>Optimized shift breakdown</Text>

        <View style={styles.grid}>
          {days.map((day) => {
            const tasks = schedule[day];
            if (!tasks || tasks.length === 0) return null;

            return (
              <View key={day} style={styles.dayCard}>
                <View style={styles.dayHeader}>
                  <Text style={styles.dayHeaderText}>{day}</Text>
                </View>
                <View>
                  {tasks.map((task: any, idx: number) => (
                    <View key={idx} style={styles.taskRow}>
                      <View style={styles.timeCol}>
                        <Text style={styles.timeText}>{task.time}</Text>
                        <Text style={styles.meridiemText}>{task.meridiem}</Text>
                      </View>
                      <View style={styles.titleCol}>
                        <Text style={styles.titleText}>{task.title}</Text>
                      </View>
                    </View>
                  ))}
                </View>
              </View>
            );
          })}
        </View>
      </Page>
    </Document>
  );
};

export default  PdfGenerator ;
