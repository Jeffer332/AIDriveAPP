import { StyleSheet } from "react-native";

export default StyleSheet.create({
    container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    paddingTop: 12,
    paddingBottom: 12,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
  },
  headerTitle: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "bold",
  },
  backButton: {
    padding: 8,
  },
  headerRight: {
    width: 40,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  imageContainer: {
    width: "100%",
    height: 250,
    borderRadius: 15,
    overflow: "hidden",
    marginBottom: 20,
  },
  carImage: {
    width: "100%",
    height: "100%",
  },
  detailsContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    color: "#ffffff",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 12,
  },
  detailCard: {
    backgroundColor: "#38303B",
    borderRadius: 15,
    padding: 16,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#2A1943",
  },
  label: {
    color: "#9e9e9e",
    fontSize: 16,
  },
  value: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "500",
  },
  recommendationContainer: {
    marginBottom: 20,
    minHeight: 50, // Asegura que haya espacio para que se renderice
  },
  recommendationCard: {
    backgroundColor: "#38303B",
    borderRadius: 15,
    padding: 16,
  },
  recommendationText: {
    color: "#ffffff",
    fontSize: 16,
    lineHeight: 24,
  },
  actionButtons: {
    gap: 12,
    marginBottom: 20,
  },
  button: {
    borderRadius: 10,
    overflow: "hidden",
  },
  buttonGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    gap: 8,
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
  secondaryButton: {
    opacity: 0.9,
  },
})